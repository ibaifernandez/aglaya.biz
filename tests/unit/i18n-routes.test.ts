import { describe, it, expect } from 'vitest';
import { readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import {
  HREFLANG,
  LOCALES,
  X_DEFAULT_PATH,
  alternatePathsFor,
  alternateUrlsFor,
  enPathOf,
  localeOf,
} from '../../src/i18n/routes';

/**
 * The rule that says where the same page lives in each language. Two surfaces
 * read it — the page's own `<link rel="alternate">` and the sitemap's
 * `<xhtml:link>` — and `tests/e2e/sitemap-hreflang.spec.ts` compares those two
 * built artefacts against each other. What it cannot check is whether the rule
 * points at pages that EXIST: both surfaces would be wrong in the same words.
 * That is this file's job.
 */

const REPO_ROOT = resolve(__dirname, '../..');
const PAGES = resolve(REPO_ROOT, 'src/pages');

/** Every routable page, as the path it is served at. Dynamic segments kept as-is. */
function routes(): string[] {
  const found: string[] = [];
  const walk = (abs: string) => {
    for (const entry of readdirSync(abs)) {
      const child = join(abs, entry);
      if (statSync(child).isDirectory()) walk(child);
      else if (entry.endsWith('.astro')) found.push(child);
    }
  };
  walk(PAGES);

  return found
    .map((abs) => relative(PAGES, abs).replace(/\.astro$/, ''))
    .filter((route) => route !== '404')
    .map((route) => (route === 'index' ? '/' : `/${route.replace(/\/index$/, '')}/`))
    .sort();
}

describe('where the same page lives in every language', () => {
  it('reads the locale off the first segment, English being the unprefixed one', () => {
    expect(localeOf('/')).toBe('en');
    expect(localeOf('/contact/')).toBe('en');
    expect(localeOf('/es/contact/')).toBe('es');
    // Portuguese is no longer published: a `/pt/` path is not a locale.
    expect(localeOf('/pt/services/')).toBe('en');
  });

  it('is spelling-proof about the trailing slash', () => {
    expect(alternatePathsFor('/contact')).toEqual(alternatePathsFor('/contact/'));
    expect(alternatePathsFor('/es/contact?utm=x')).toEqual(alternatePathsFor('/es/contact/'));
  });

  it('maps parallel routes by prefix', () => {
    expect(alternatePathsFor('/es/roi-audit/')).toEqual({
      en: '/roi-audit/',
      es: '/es/roi-audit/',
    });
    expect(alternatePathsFor('/')).toEqual({ en: '/', es: '/es/' });
  });

  it('maps the routes whose slug is itself translated', () => {
    const legal = { en: '/legal-notice/', es: '/es/aviso-legal/' };
    expect(alternatePathsFor('/legal-notice/')).toEqual(legal);
    expect(alternatePathsFor('/es/aviso-legal/')).toEqual(legal);

    const privacy = { en: '/privacy/', es: '/es/privacidad/' };
    expect(alternatePathsFor('/es/privacidad/')).toEqual(privacy);
  });

  it('gives every language of a page the same answer', () => {
    // The property that makes hreflang legal at all: the annotations have to be
    // reciprocal. Whichever twin you ask, the set must come back identical.
    for (const route of routes()) {
      const paths = alternatePathsFor(route);
      for (const locale of LOCALES) {
        expect(alternatePathsFor(paths[locale]), `${route} via ${locale}`).toEqual(paths);
      }
    }
  });

  it('points only at pages that exist', () => {
    const published = new Set(routes());
    // `/proof/[slug]/` is dynamic: its twins are built from the same slug, and
    // the equality above already covers the shape. Only fixed routes are checked.
    const fixed = routes().filter((route) => !route.includes('['));
    expect(fixed.length).toBeGreaterThan(15); // 20 on the EN + ES site

    for (const route of fixed) {
      const paths = alternatePathsFor(route);
      for (const locale of LOCALES) {
        expect(published, `${route} → ${locale} points at nothing`).toContain(paths[locale]);
      }
    }
  });

  it('absolutises against the site origin', () => {
    expect(alternateUrlsFor('/es/aviso-legal/', 'https://aglaya.biz')).toEqual({
      en: 'https://aglaya.biz/legal-notice/',
      es: 'https://aglaya.biz/es/aviso-legal/',
    });
  });

  it('publishes the hreflang values the site actually uses', () => {
    // Changing either of these renames a published
    // annotation on every page and in every sitemap entry at once.
    expect(HREFLANG).toEqual({ en: 'en', es: 'es' });
    expect(X_DEFAULT_PATH).toBe('/');
  });

  describe('the rule bites (mutants)', () => {
    it('does not send a translated slug down the parallel path', () => {
      // The failure this table exists to prevent: `/es/legal-notice/` is a 404.
      expect(alternatePathsFor('/legal-notice/').es).not.toBe('/es/legal-notice/');
      expect(alternatePathsFor('/privacy/').es).not.toBe('/es/privacy/');
    });

    it('never answers the home page for a page that is not the home page', () => {
      // The old BaseLayout default, and the reason three published pages were
      // announcing `https://aglaya.biz/` as their English version. The two
      // home pages are excluded because `/` IS their honest English twin.
      const homes = ['/', '/es/'];
      for (const route of routes().filter((r) => !homes.includes(r) && !r.includes('['))) {
        expect(alternatePathsFor(route).en, `${route} fell back to the home page`).not.toBe('/');
      }
    });

    it('the route sweep is not vacuous', () => {
      const all = routes();
      expect(all).toContain('/contact/');
      expect(all).toContain('/es/aviso-legal/');
      expect(all).toContain('/es/the-stack/');
      expect(all.some((r) => r.startsWith('/pt/')), 'a /pt/ page is published again').toBe(false);
      expect(all.length).toBeGreaterThan(20); // 22 on the EN + ES site
    });
  });
});
