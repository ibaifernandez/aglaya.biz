import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { HREFLANG, LOCALES, alternateUrlsFor } from '../../src/i18n/routes';

/**
 * THE SITE IS EN + ES. `/pt/*` IS ONE 301 TO ITS SPANISH TWIN.
 *
 * Decided 2026-09-24: Portuguese is no longer published. Two things keep that
 * true, and either can come back without anyone noticing, because every page
 * still renders:
 *
 *   1. THE REDIRECT. Old `/pt/` addresses are indexed and linked. One rule in
 *      `netlify.toml` sends all of them to `/es/:splat` with a 301 — one rule,
 *      not one per page, and first in the file, because Netlify takes the first
 *      rule that matches: a later per-page `/pt/...` rule would never fire, and
 *      an earlier one would win over this.
 *   2. THE ANNOUNCEMENTS. The sitemap (`astro.config.mjs`) and every page's
 *      `<link rel="alternate">` (`BaseLayout.astro`) are both generated from
 *      `LOCALES`/`HREFLANG` in `src/i18n/routes.ts`. A `pt` there tells search
 *      engines a Portuguese page exists at an address that now redirects.
 *
 * What this cannot see is the deployed edge: whether Netlify actually answers
 * 301 for `/pt/services/` is measured with curl against the deploy, not here.
 */

const REPO_ROOT = resolve(__dirname, '../..');

type Redirect = Record<string, string>;

/** The `[[redirects]]` blocks of netlify.toml, in file order, values unquoted. */
function redirects(): Redirect[] {
  const toml = readFileSync(resolve(REPO_ROOT, 'netlify.toml'), 'utf8');
  return toml
    .split(/^\[\[redirects\]\]\s*$/m)
    .slice(1)
    .map((block) => {
      const rule: Redirect = {};
      for (const line of block.split('\n')) {
        if (/^\s*\[/.test(line)) break; // next table: this block is over
        const m = line.match(/^\s*(\w+)\s*=\s*"?([^"#]*?)"?\s*(#.*)?$/);
        if (m) rule[m[1]] = m[2];
      }
      return rule;
    });
}

function filesUnder(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  const walk = (abs: string) => {
    for (const entry of readdirSync(abs)) {
      const child = join(abs, entry);
      if (statSync(child).isDirectory()) walk(child);
      else if (exts.some((e) => entry.endsWith(e))) out.push(child);
    }
  };
  walk(dir);
  return out;
}

describe('Portuguese is not published', () => {
  it('sends every /pt/ address to its Spanish twin with ONE 301', () => {
    const all = redirects();
    expect(all.length, 'parsed no [[redirects]] out of netlify.toml').toBeGreaterThan(5);

    const fromPt = all.filter((r) => r.from?.startsWith('/pt'));
    expect(fromPt, 'one rule for /pt/*, not one per page').toHaveLength(1);
    expect(fromPt[0]).toMatchObject({ from: '/pt/*', to: '/es/:splat', status: '301' });
  });

  it('puts that rule first, so no other rule can claim a /pt/ path', () => {
    expect(redirects()[0]?.from).toBe('/pt/*');
  });

  it('redirects nothing INTO /pt/', () => {
    const intoPt = redirects().filter((r) => r.to?.startsWith('/pt'));
    expect(intoPt.map((r) => `${r.from} -> ${r.to}`)).toEqual([]);
  });

  it('builds no /pt/ page', () => {
    expect(existsSync(resolve(REPO_ROOT, 'src/pages/pt'))).toBe(false);
  });

  it('announces no Portuguese twin in hreflang or the sitemap', () => {
    // Both surfaces are generated from these two constants.
    expect([...LOCALES]).toEqual(['en', 'es']);
    expect(Object.values(HREFLANG).some((v) => v.toLowerCase().startsWith('pt'))).toBe(false);
    for (const path of ['/', '/services/', '/es/services/', '/privacy/', '/es/aviso-legal/']) {
      const urls = Object.values(alternateUrlsFor(path, 'https://aglaya.biz'));
      expect(urls.filter((u) => u.includes('/pt/')), path).toEqual([]);
    }
  });

  it('has no hand-written Portuguese alternate left in the layout or the sitemap config', () => {
    const sources = [
      ...filesUnder(resolve(REPO_ROOT, 'src'), ['.astro', '.ts', '.mjs']),
      resolve(REPO_ROOT, 'astro.config.mjs'),
    ];
    const offenders = sources.filter((file) =>
      /hreflang=["']pt|lang:\s*['"]pt|['"]\/pt\//i.test(readFileSync(file, 'utf8')),
    );
    expect(offenders.map((f) => relative(REPO_ROOT, f))).toEqual([]);
  });
});
