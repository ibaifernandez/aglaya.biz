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

/** T2 of the mock-up: the markup between its `<!-- T2 -->` and `<!-- T3 -->` markers. */
export function mockupProblem(html: string) {
  const t2 = /<!-- T2 -->([\s\S]*?)<!-- T3 -->/.exec(html)?.[1] ?? '';
  const one = (src: string, re: RegExp) => decode(re.exec(src)?.[1] ?? '');
  const h2 = /<h2 class="sec-h">([\s\S]*?)<\/h2>/.exec(t2)?.[1] ?? '';
  return {
    eyebrow: one(t2, /class="eyebrow[^"]*">([^<]+)</),
    title: decode(h2.replace(/<[^>]+>/g, '')),
    visual: one(t2, /id="storyVisual"[^>]*aria-label="([^"]+)"/),
    pairs: [...t2.matchAll(/<article class="step">([\s\S]*?)<\/article>/g)].map(([, a]) => ({
      n: one(a, /class="n mono">([^<]+)</),
      problem: one(a, /class="prob-h">([^<]+)</),
      problemText: one(a, /class="prob-p">([^<]+)</),
      solution: one(a, /class="sol-h" aria-label="([^"]+)"/),
      solutionText: one(a, /class="sol-p">([^<]+)</),
    })),
  };
}

const html = readFileSync(MOCKUP, 'utf8');
const hook = mockupHook(html);
const problem = mockupProblem(html);

/** Every word of T2 is on screen: eyebrow, heading, drawing, and the four pairs in full. */
async function expectProblemComplete(page: import('@playwright/test').Page) {
  const t2 = page.locator('main#main-content section#problem');
  await expect(t2).toBeVisible();
  await expect(t2.getByText(problem.eyebrow, { exact: true })).toBeVisible();
  await expect(t2.getByRole('heading', { level: 2, name: problem.title })).toBeVisible();
  const drawing = t2.getByRole('img', { name: problem.visual });
  await expect(drawing).toBeVisible();
  expect((await drawing.boundingBox())?.height ?? 0, 'the drawing has a body').toBeGreaterThan(200);
  for (const pair of problem.pairs) {
    await expect(t2.getByText(pair.n, { exact: true })).toBeVisible();
    await expect(t2.getByRole('heading', { level: 3, name: pair.problem, exact: true })).toBeVisible();
    await expect(t2.getByText(pair.problemText, { exact: true })).toBeVisible();
    const sol = t2.getByRole('heading', { level: 3, name: pair.solution, exact: true });
    await expect(sol).toBeVisible();
    // The way out is WRITTEN, not just labelled: the typed (visible) part is the
    // whole phrase, nothing is left in the ghost that is still to be typed.
    await expect(sol.locator('.pv-done')).toHaveText(pair.solution);
    await expect(sol.locator('.pv-rest')).toHaveText('');
    await expect(t2.getByText(pair.solutionText, { exact: true })).toBeVisible();
  }
}

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

  test('the reference mock-up yields the T2 words (the reader is not blind)', () => {
    expect(problem.eyebrow).toBe('Where most companies get stuck');
    expect(problem.title).toBe('Everyone talks about AI. Nobody tells you where to start.');
    expect(problem.visual.length).toBeGreaterThan(80);
    expect(problem.pairs).toHaveLength(4);
    expect(problem.pairs.map((p) => p.n)).toEqual(['Problem 1 of 4', 'Problem 2 of 4', 'Problem 3 of 4', 'Problem 4 of 4']);
    for (const p of problem.pairs) {
      expect(p.problem.length).toBeGreaterThan(5);
      expect(p.problemText.length).toBeGreaterThan(60);
      expect(p.solution.length).toBeGreaterThan(5);
      expect(p.solutionText.length).toBeGreaterThan(60);
    }
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

    test('T2 is complete and visible, word for word from the mock-up', async ({ page }) => {
      await page.goto(ROUTE);
      await expectProblemComplete(page);
    });

    test('carries the six tramos as sections with their ids', async ({ page }) => {
      await page.goto(ROUTE);
      for (const id of ['top', 'problem', 'built', 'orchestrator', 'work', 'contact']) {
        await expect(page.locator(`main#main-content > section#${id}`)).toHaveCount(1);
      }
    });
  });

  test('with reduced motion, T2 stays whole and still (no pin, no typing)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('section#problem')).not.toHaveClass(/is-fx/);
    await expectProblemComplete(page);
  });

  test.describe('with motion', () => {
    for (const [width, height] of [[1440, 900], [768, 1024], [375, 812]]) {
      test(`T2 pins a scene that fills the screen at ${width}x${height} and plays to the last pair`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(ROUTE);
        const section = page.locator('section#problem');
        await expect(section).toHaveClass(/is-fx/);

        // Scroll to the end of the pin (4.8 screens long).
        const top = await page.evaluate(() => {
          const stage = document.querySelector('[data-pv-story-stage]')!;
          return stage.parentElement!.getBoundingClientRect().top + window.scrollY;
        });
        await page.evaluate((y) => window.scrollTo(0, y), top + height * 4.8 * 0.995);

        const last = problem.pairs[3];
        const step = section.locator('[data-pv-step]').nth(3);
        await expect(step).toHaveClass(/is-on/);
        await expect(step.getByRole('heading', { level: 3, name: last.solution })).toHaveText(last.solution);

        // Pinned and full: drawing + text span at least 80% of the screen under the 60px header.
        const fill = await page.evaluate(() => {
          const a = document.querySelector('.pv-story-canvas')!.getBoundingClientRect();
          const b = document.querySelector('.pv-steps-col')!.getBoundingClientRect();
          const stage = document.querySelector('[data-pv-story-stage]')!.getBoundingClientRect();
          return { span: Math.max(a.bottom, b.bottom) - Math.min(a.top, b.top), stageTop: stage.top, vh: window.innerHeight };
        });
        expect(Math.abs(fill.stageTop), 'the stage is pinned to the top').toBeLessThan(2);
        expect(fill.span / (fill.vh - 60)).toBeGreaterThan(0.8);
      });
    }
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
