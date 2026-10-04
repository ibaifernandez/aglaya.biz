import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * THE HIDDEN PREVIEW OF THE NEW HOME PAGE (`/preview/home/`).
 *
 * What it must be, before anything else is built on it:
 *   - served, `noindex`, and out of the sitemap — a preview nobody links to and
 *     no search engine is told about;
 *   - English only, so it announces NO language twin (an `es` alternate would
 *     point at `/es/preview/home/`, which does not exist);
 *   - its T1 readable in full with JavaScript OFF — the effects are an upper
 *     floor, never the floor;
 *   - WCAG 2 AA clean with reduced motion.
 *
 * The words are not copied into this file. They are read out of the reference
 * mock-up committed at docs/design/portada-nueva/portada-aglaya.html — built
 * page against reference artefact, so the page cannot drift from the mock-up
 * while this suite stays green, and the suite cannot agree with the page just
 * because both were edited together.
 *
 * Needs a build (served from `dist`), like the rest of tests/e2e.
 */

const ROUTE = '/preview/home/';
const MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/portada-aglaya.html', import.meta.url));

const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

/** T1 of the mock-up: the markup between its `<!-- T1 -->` and `<!-- T2 -->` markers. */
export function mockupHook(html: string) {
  const t1 = /<!-- T1 -->([\s\S]*?)<!-- T2 -->/.exec(html)?.[1] ?? '';
  const one = (re: RegExp) => decode(re.exec(t1)?.[1] ?? '');
  return {
    eyebrow: one(/class="eyebrow[^"]*">([^<]+)</),
    title: one(/<h1[^>]*aria-label="([^"]+)"/),
    lines: [...t1.matchAll(/class="line[^"]*"><span>([^<]+)<\/span>/g)].map((m) => decode(m[1])),
    sub: one(/<p class="sub">([^<]+)<\/p>/),
    ctas: [...(/class="ctas">([\s\S]*?)<\/div>/.exec(t1)?.[1] ?? '').matchAll(/<span>([^<]+)<\/span>/g)].map((m) => decode(m[1])),
  };
}

const hook = mockupHook(readFileSync(MOCKUP, 'utf8'));

test.describe('new home page preview', () => {
  test('the reference mock-up yields the T1 words (the reader is not blind)', () => {
    // Anti-vacuity: if the regexes above stopped matching, every text assertion
    // below would be asking the page for an empty string, and pass.
    expect(hook.eyebrow).toBe('AI for companies that want to stay independent');
    expect(hook.title).toBe('The agency is dead. Long live the system.');
    expect(hook.lines).toHaveLength(4);
    expect(hook.sub.length).toBeGreaterThan(80);
    expect(hook.ctas).toEqual(['Talk to us', "See what we've built"]);
  });

  test('is served, noindex, and announces no language twin', async ({ request }) => {
    const res = await request.get(ROUTE);
    expect(res.status()).toBe(200);
    const html = await res.text();

    expect(html).toMatch(/<meta name="robots" content="noindex[^"]*"/);
    expect(html, 'an es alternate points at a page that does not exist').not.toMatch(/hreflang="es"/);
    expect(html, 'a one-language preview declares no alternates at all').not.toMatch(/rel="alternate"[^>]*hreflang/);
    expect(html).toMatch(/<html[^>]*data-theme="light"/);
  });

  test('is not in the sitemap', async ({ request }) => {
    const index = await request.get('/sitemap-index.xml');
    expect(index.ok(), 'no sitemap index in the build').toBeTruthy();
    const chunks = [...(await index.text()).matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1]);
    expect(chunks.length).toBeGreaterThan(0);

    const locs: string[] = [];
    for (const chunk of chunks) {
      const xml = await (await request.get(new URL(chunk).pathname)).text();
      locs.push(...[...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1]));
    }
    // Anti-vacuity: an empty map would trivially not contain the preview.
    expect(locs.length).toBeGreaterThan(20);
    expect(locs.some((loc) => loc.endsWith('/contact/')), 'the parser reads real entries').toBe(true);
    expect(locs.filter((loc) => new URL(loc).pathname.startsWith('/preview/'))).toEqual([]);
  });

  test('the current home page links nowhere near it', async ({ request }) => {
    for (const path of ['/', '/es/']) {
      const html = await (await request.get(path)).text();
      expect(html, `${path} links to the preview`).not.toContain('/preview/');
    }
  });

  test.describe('with JavaScript off', () => {
    test.use({ javaScriptEnabled: false });

    test('T1 is complete and visible, word for word from the mock-up', async ({ page }) => {
      await page.goto(ROUTE);
      const t1 = page.locator('main#main-content section#top');
      await expect(t1).toBeVisible();

      await expect(t1.getByText(hook.eyebrow, { exact: true })).toBeVisible();
      await expect(t1.getByRole('heading', { level: 1, name: hook.title })).toBeVisible();
      for (const line of hook.lines) {
        await expect(t1.getByText(line, { exact: true })).toBeVisible();
      }
      await expect(t1.getByText(hook.sub, { exact: true })).toBeVisible();
      for (const cta of hook.ctas) {
        await expect(t1.getByRole('link', { name: cta, exact: true })).toBeVisible();
      }
    });

    test('carries the six tramos as sections with their ids', async ({ page }) => {
      await page.goto(ROUTE);
      for (const id of ['top', 'problem', 'built', 'orchestrator', 'work', 'contact']) {
        await expect(page.locator(`main#main-content > section#${id}`)).toHaveCount(1);
      }
    });
  });

  test('passes axe WCAG 2 AA with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
});
