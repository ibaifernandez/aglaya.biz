import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * NO CATCH-ALL FUNCTION.
 *
 * Astro treats any adapter that does not declare itself static as server output,
 * even with every page prerendered, and @astrojs/netlify then deploys `ssr` on
 * `/*`. Nothing on this site needed it: measured on 2026-11-02, 90 of 90
 * invocations in an hour were 404s, mostly scanners, and each one counts against
 * a function limit that pauses the whole Netlify account.
 *
 * A `prerender = false` route needs no guard here: without an adapter the build
 * itself refuses it. Re-adding the adapter is the silent way back, so that is
 * what this catches.
 */
describe('astro.config.mjs', () => {
  const config = readFileSync(resolve(process.cwd(), 'astro.config.mjs'), 'utf8');

  it('sets no adapter', () => {
    expect(config).not.toMatch(/^\s*adapter\s*:/m);
    expect(config).not.toMatch(/from\s+['"]@astrojs\/netlify['"]/);
  });
});
