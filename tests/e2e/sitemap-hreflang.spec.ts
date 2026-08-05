import { test, expect } from '@playwright/test';

/**
 * THE MAP MUST NAME THE SAME EQUIVALENTS THE PAGE NAMES.
 *
 * Every page has always declared its language twins in its own `<head>`. The
 * sitemap listed the addresses and said nothing, so a crawler could only learn
 * which of them were the same page by fetching all of them. `astro.config.mjs`
 * now writes `<xhtml:link>` alternates into each `<url>`; this compares the two
 * built artefacts, address by address, and fails when they disagree.
 *
 * The comparison — not the fact that the map has links in it — is what makes
 * `src/i18n/routes.ts` a single truth rather than a second one. A page that
 * overrides its alternates with something the rule does not produce turns this
 * red, which is the point: the override is allowed, the divergence is not.
 *
 * ON `x-default`: every entry repeats it, pointing at the home page. That is
 * what the pages have always declared, and the map copies it rather than
 * inventing a better answer. Whether it SHOULD instead point at each page's own
 * English version is a live SEO question and a change to the pages — not to the
 * map — so it is not settled here.
 *
 * Runs against `dist` as served on the E2E base URL, so it needs a build. That
 * is also why it is here and not in `tests/unit/`: the unit job never builds.
 */

/** `hreflang → href`, the shape both surfaces get compared in. */
export type Alternates = Record<string, string>;

const attr = (tag: string, name: string): string =>
  new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1] ?? '';

/** Every `<url>…</url>` body of a sitemap chunk. */
export function urlEntries(xml: string): string[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
}

export function locOf(entry: string): string {
  return /<loc>([\s\S]*?)<\/loc>/.exec(entry)?.[1] ?? '';
}

/** The alternates the MAP declares for one entry. */
export function alternatesInXml(entry: string): Alternates {
  const found: Alternates = {};
  for (const [tag] of entry.matchAll(/<xhtml:link\b[^>]*>/g)) {
    if (attr(tag, 'rel') !== 'alternate') continue;
    found[attr(tag, 'hreflang')] = attr(tag, 'href');
  }
  return found;
}

/** The alternates the PAGE declares for itself. */
export function alternatesInHtml(html: string): Alternates {
  const found: Alternates = {};
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    if (attr(tag, 'rel') !== 'alternate') continue;
    const lang = attr(tag, 'hreflang');
    if (lang) found[lang] = attr(tag, 'href');
  }
  return found;
}

/** The four this site publishes: three languages plus the fallback. */
const EXPECTED_HREFLANGS = ['en', 'es', 'pt-BR', 'x-default'];

test.describe('sitemap language equivalents', () => {
  test('every entry declares the same alternates its page does', async ({ request }) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.ok(), 'no sitemap index in the build').toBeTruthy();

    const chunks = [...(await index.text()).matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1]);
    expect(chunks.length, 'sitemap index points at nothing').toBeGreaterThan(0);

    const entries: string[] = [];
    for (const chunk of chunks) {
      const res = await request.get(new URL(chunk).pathname);
      expect(res.ok(), `chunk not served: ${chunk}`).toBeTruthy();
      entries.push(...urlEntries(await res.text()));
    }

    // Anti-vacuity: a parser that found nothing would make every comparison
    // below pass by comparing two empty objects.
    expect(entries.length, 'no <url> entries parsed out of the sitemap').toBeGreaterThan(30);

    for (const entry of entries) {
      const loc = locOf(entry);
      const inMap = alternatesInXml(entry);
      expect(Object.keys(inMap).sort(), `map declares no alternates for ${loc}`).toEqual(
        [...EXPECTED_HREFLANGS].sort(),
      );

      const page = await request.get(new URL(loc).pathname);
      expect(page.ok(), `listed but not served: ${loc}`).toBeTruthy();
      const inPage = alternatesInHtml(await page.text());
      expect(Object.keys(inPage).sort(), `page declares no alternates: ${loc}`).toEqual(
        [...EXPECTED_HREFLANGS].sort(),
      );

      expect(inMap, `map and page disagree about ${loc}`).toEqual(inPage);
    }
  });

  /**
   * A comparison that cannot fail proves nothing. These drive the same two
   * parsers with broken input and require each break to be caught.
   */
  test.describe('the comparison bites', () => {
    const PAGE = `<head>
      <link rel="canonical" href="https://aglaya.biz/es/contact/">
      <link rel="alternate" hreflang="en" href="https://aglaya.biz/contact/">
      <link rel="alternate" hreflang="es" href="https://aglaya.biz/es/contact/">
      <link rel="alternate" hreflang="pt-BR" href="https://aglaya.biz/pt/contact/">
      <link rel="alternate" hreflang="x-default" href="https://aglaya.biz/">
    </head>`;

    const links = (...tags: string[]) => tags.join('');
    const EN = '<xhtml:link rel="alternate" hreflang="en" href="https://aglaya.biz/contact/"/>';
    const ES = '<xhtml:link rel="alternate" hreflang="es" href="https://aglaya.biz/es/contact/"/>';
    const PT = '<xhtml:link rel="alternate" hreflang="pt-BR" href="https://aglaya.biz/pt/contact/"/>';
    const XD = '<xhtml:link rel="alternate" hreflang="x-default" href="https://aglaya.biz/"/>';
    const entry = (body: string) => `<loc>https://aglaya.biz/es/contact/</loc>${body}`;

    test('agrees when the map says what the page says', () => {
      expect(alternatesInXml(entry(links(EN, ES, PT, XD)))).toEqual(alternatesInHtml(PAGE));
    });

    test('an entry stripped of its alternates fails', () => {
      const stripped = alternatesInXml(entry(''));
      expect(stripped).toEqual({});
      expect(stripped).not.toEqual(alternatesInHtml(PAGE));
      expect(Object.keys(stripped).sort()).not.toEqual([...EXPECTED_HREFLANGS].sort());
    });

    test('one dropped language fails', () => {
      expect(alternatesInXml(entry(links(EN, ES, XD)))).not.toEqual(alternatesInHtml(PAGE));
    });

    test('the pre-existing default — English twin pointing at the home page — fails', () => {
      // Exactly what `/es/contact/` shipped before `src/i18n/routes.ts`: the map
      // would have carried the right path while the page kept announcing the
      // home page as its English version.
      const wrong = PAGE.replace(
        '<link rel="alternate" hreflang="en" href="https://aglaya.biz/contact/">',
        '<link rel="alternate" hreflang="en" href="https://aglaya.biz/">',
      );
      expect(alternatesInHtml(wrong)).not.toEqual(alternatesInHtml(PAGE));
      expect(alternatesInXml(entry(links(EN, ES, PT, XD)))).not.toEqual(alternatesInHtml(wrong));
    });

    test('the parsers are not blind (they read a real tag when there is one)', () => {
      expect(alternatesInHtml(PAGE)).toEqual({
        en: 'https://aglaya.biz/contact/',
        es: 'https://aglaya.biz/es/contact/',
        'pt-BR': 'https://aglaya.biz/pt/contact/',
        'x-default': 'https://aglaya.biz/',
      });
      expect(urlEntries('<url><loc>a</loc></url><url><loc>b</loc></url>')).toHaveLength(2);
      // `rel="canonical"` is a `<link>` too and must not be counted as a twin.
      expect(alternatesInHtml('<link rel="canonical" href="https://aglaya.biz/">')).toEqual({});
    });
  });
});
