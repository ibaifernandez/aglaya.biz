import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

/**
 * The static half of "we consume the brand, we do not copy it".
 *
 * The half that actually decides is scripts/mutation-proof.sh: it moves a value
 * in the design system and checks the pixel here moved with it. A vendored copy
 * passes everything in this file and fails that one. So these are not the proof
 * — they are the cheap, fast guards that keep the proof from having to fail:
 * they catch a hand-written brand value the moment it is committed, in unit-test
 * time rather than after a full double build.
 *
 * Read together with docs/PACKAGE.md inside @aglaya/design-tokens, which owns
 * the rules this file enforces from the consumer side.
 */

const REPO_ROOT = resolve(__dirname, '../..');
const PKG = 'node_modules/@aglaya/design-tokens';
const BRIDGE = 'src/styles/tokens.theme.generated.css';

const pkgJson = JSON.parse(readFileSync(resolve(REPO_ROOT, 'package.json'), 'utf8'));
const canonTokens: Record<string, string> = JSON.parse(
  readFileSync(resolve(REPO_ROOT, PKG, 'dist/tokens.json'), 'utf8'),
).tokens;

/** Source we own and paint with. `public/` and `src/content/` are excluded on
 *  purpose — see the PR: third-party demos, national flags, client logos and
 *  Mermaid `style` directives in content are explicitly NOT brand surfaces. */
const SCANNED_DIRS = ['src', 'netlify'];
const SCANNED_EXT = ['.astro', '.css', '.ts', '.js', '.mjs'];

/**
 * `--color-bg` is #000000, and black ink on a white chip is not the brand canvas
 * — it is ink that happens to share the value. The canon makes exactly the same
 * call in its own `.t-codetag` rule, which spells `color: #000`. Tokenising it
 * here would tie the colour of code text to the colour of the page background,
 * which is precisely the kind of false link a design system is supposed to stop.
 */
const EXEMPT_TOKENS = new Set(['--color-bg']);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCANNED_EXT.some((e) => entry.endsWith(e))) out.push(full);
  }
  return out;
}

const files = SCANNED_DIRS.flatMap((d) => walk(resolve(REPO_ROOT, d)))
  .filter((f) => relative(REPO_ROOT, f) !== BRIDGE)
  .map((f) => ({ path: relative(REPO_ROOT, f), text: readFileSync(f, 'utf8') }));

/** #rrggbb -> "r\\s*,\\s*g\\s*,\\s*b", so an rgba() copy is caught too. */
function rgbPattern(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `${r}\\s*,\\s*${g}\\s*,\\s*${b}`;
}

describe('the brand is consumed from @aglaya/design-tokens, not copied', () => {
  it('depends on the package, pinned to a tag', () => {
    const spec: string | undefined = pkgJson.dependencies?.['@aglaya/design-tokens'];
    expect(spec, '@aglaya/design-tokens must be a runtime dependency').toBeTruthy();
    expect(
      spec,
      'A branch or a local path is not a dependency: a branch changes the build ' +
        'without anyone deciding, and file:/link:/workspace: works on the disk it ' +
        'was written on and breaks in Netlify CI, which clones this repo alone.',
    ).toMatch(/#v\d+\.\d+\.\d+$/);
    expect(spec).not.toMatch(/^(file:|link:|workspace:|portal:)/);
    // Written as https on purpose: CI has no SSH key. (npm still normalises the
    // lockfile's `resolved` to git+ssh for GitHub-hosted repos and falls back to
    // https at install time — verified with GIT_SSH_COMMAND=/bin/false — but the
    // spec a human edits should say what CI actually needs.)
    expect(spec).toMatch(/^git\+https:\/\//);
  });

  it('never commits the generated Tailwind bridge', () => {
    const ignore = readFileSync(resolve(REPO_ROOT, '.gitignore'), 'utf8');
    expect(
      ignore.includes(BRIDGE),
      `${BRIDGE} must stay gitignored. Committed, it becomes a second home for ` +
        `every brand value — a copy that passes every check except the mutation proof.`,
    ).toBe(true);
  });

  it('declares no brand token of its own in global.css', () => {
    const css = readFileSync(resolve(REPO_ROOT, 'src/styles/global.css'), 'utf8');
    expect(css).toMatch(/@import\s+["']@aglaya\/design-tokens\/tokens\.css["']/);
    expect(
      css.match(/@theme\s*\{/),
      'global.css must not open its own @theme block; the bridge is generated.',
    ).toBeNull();
  });

  it('keeps product accents off the master surface', () => {
    const bridge = readFileSync(resolve(REPO_ROOT, BRIDGE), 'utf8');
    const leaked = [...bridge.matchAll(/--product-[\w-]+/g)].map((m) => m[0]);
    expect(
      leaked,
      'aglaya.biz is the marca madre: three colours, per get_nonnegotiables("master"). ' +
        'Product accents are first-class only on their own product surface.',
    ).toEqual([]);
  });

  it('writes no canonical colour value by hand', () => {
    const offenders: string[] = [];

    for (const [token, value] of Object.entries(canonTokens)) {
      if (EXEMPT_TOKENS.has(token)) continue;
      if (!/^#[0-9a-f]{6}$/i.test(value)) continue;

      const hex = new RegExp(value, 'i');
      const rgb = new RegExp(rgbPattern(value));

      for (const file of files) {
        for (const [i, line] of file.text.split('\n').entries()) {
          if (hex.test(line) || rgb.test(line)) {
            offenders.push(`${file.path}:${i + 1}  ${token} (${value})`);
          }
        }
      }
    }

    expect(
      offenders,
      'These lines spell a brand value the design system owns:\n' +
        offenders.map((o) => `  → ${o}`).join('\n') +
        '\nUse the token instead — a Tailwind utility (bg-brand, text-corporate-green),\n' +
        'var(--color-…) in CSS, color-mix(in srgb, var(--color-…) N%, transparent) for\n' +
        'an alpha, or `tokens[…]` from the package where only a literal fits (PDF, meta,\n' +
        'manifest). A hand-written value keeps painting the old colour the day the\n' +
        'design system moves it, and nothing tells you.',
    ).toEqual([]);
  });
});
