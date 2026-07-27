import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Every font family we NAME, we must also FETCH.
 *
 * `global.css` declared `--font-mono: 'Space Mono', monospace` and 245 call
 * sites used it (eyebrows, labels, form microcopy — the mono voice of the whole
 * brand). `BaseLayout.astro` fetched Outfit and Inter only. Nothing was broken
 * on screen for us, and that is precisely the trap: Space Mono is installed on
 * the design machine, so `document.fonts.check('12px "Space Mono"')` answered
 * `true` locally while every visitor without it got the system monospace. A
 * browser check on the author's laptop cannot see this bug. A static check can.
 *
 * So this test reads the two files against each other: every non-generic family
 * named by a `--font-*` token must appear either in a stylesheet URL the layout
 * requests, or in an `@font-face` we ship ourselves.
 */

const REPO_ROOT = resolve(__dirname, '../..');
const GLOBAL_CSS = resolve(REPO_ROOT, 'src/styles/global.css');
const BASE_LAYOUT = resolve(REPO_ROOT, 'src/layouts/BaseLayout.astro');

/** Fallbacks the browser always has; naming them fetches nothing and needs nothing. */
const GENERIC = new Set([
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-monospace',
  'ui-sans-serif',
]);

/** Families named by `--font-*` tokens in global.css, generics dropped. */
export function declaredFamilies(css: string): string[] {
  const families = new Set<string>();
  for (const [, value] of css.matchAll(/--font-[\w-]*\s*:\s*([^;]+);/g)) {
    for (const raw of value.split(',')) {
      const name = raw.trim().replace(/^['"]|['"]$/g, '');
      if (name && !GENERIC.has(name.toLowerCase())) families.add(name);
    }
  }
  return [...families];
}

/** True when the layout (or our own @font-face) actually pulls the family in. */
export function isFetched(family: string, layout: string, css: string): boolean {
  // Google Fonts spells spaces as '+' inside the `family=` query parameter.
  const inLayoutUrl = layout.includes(`family=${family.replace(/ /g, '+')}`);
  const inFontFace = new RegExp(`@font-face[^}]*?font-family:\\s*['"]?${family}`, 'is').test(css);
  return inLayoutUrl || inFontFace;
}

const css = readFileSync(GLOBAL_CSS, 'utf8');
const layout = readFileSync(BASE_LAYOUT, 'utf8');

describe('declared font families are actually fetched', () => {
  it('finds the tokens at all (the check itself can rot)', () => {
    const families = declaredFamilies(css);
    expect(families).toContain('Outfit');
    expect(families).toContain('Inter');
    expect(families).toContain('Space Mono');
  });

  it('fetches every family it names', () => {
    const orphans = declaredFamilies(css).filter((f) => !isFetched(f, layout, css));
    expect(
      orphans,
      `global.css names font families that nothing loads:\n` +
        orphans.map((f) => `  → ${f}`).join('\n') +
        `\nAdd them to the Google Fonts link in BaseLayout.astro (or ship an\n` +
        `@font-face), or stop naming them. Visitors without the font installed\n` +
        `silently get a fallback; on a machine that has it, everything looks fine.\n`,
    ).toEqual([]);
  });

  it('does not demand a fetch for generic fallbacks', () => {
    expect(declaredFamilies("--font-x: 'Foo', monospace, system-ui;")).toEqual(['Foo']);
  });

  // The mutant: the exact regression this file exists for.
  it('flags a family that is declared but never requested', () => {
    const orphanCss = "@theme { --font-mono: 'Space Mono', monospace; }";
    const layoutWithoutIt = '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400" />';
    expect(declaredFamilies(orphanCss).filter((f) => !isFetched(f, layoutWithoutIt, orphanCss))).toEqual([
      'Space Mono',
    ]);
  });

  it('accepts a self-hosted family declared via @font-face', () => {
    const selfHosted = "@font-face { font-family: 'Foo'; src: url(/fonts/foo.woff2); }\n--font-x: 'Foo', serif;";
    expect(declaredFamilies(selfHosted).filter((f) => !isFetched(f, '', selfHosted))).toEqual([]);
  });
});
