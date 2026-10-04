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
 *   - its T1 and T2 readable in full with JavaScript OFF — the effects are an
 *     upper floor, never the floor;
 *   - its T2 a selector (WAI-ARIA tabs) where nothing moves on by itself, whose
 *     motion is only downloaded where it runs;
 *   - WCAG 2 AA clean with reduced motion.
 *
 * The words are not copied into this file. They are read out of the reference
 * mock-ups committed at docs/design/portada-nueva/ — portada-aglaya.html (T1,
 * and the drawing's label) and t2-selector.html (T2) — built page against
 * reference artefact, so the page cannot drift from the mock-up while this
 * suite stays green, and the suite cannot agree with the page just because
 * both were edited together.
 *
 * Needs a build (served from `dist`), like the rest of tests/e2e.
 */

const ROUTE = '/preview/home/';
const MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/portada-aglaya.html', import.meta.url));
const SELECTOR_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t2-selector.html', import.meta.url));

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

/** The drawing's label: T2 of portada-aglaya.html, between its `<!-- T2 -->` and `<!-- T3 -->` markers. */
export function mockupDrawingLabel(html: string) {
  const t2 = /<!-- T2 -->([\s\S]*?)<!-- T3 -->/.exec(html)?.[1] ?? '';
  return decode(/id="storyVisual"[^>]*aria-label="([^"]+)"/.exec(t2)?.[1] ?? '');
}

/** T2 as a selector: `section.story` of t2-selector.html. */
export function mockupProblem(html: string) {
  const t2 = /<section class="story">([\s\S]*?)<\/section>/.exec(html)?.[1] ?? '';
  const one = (src: string, re: RegExp) => decode(re.exec(src)?.[1] ?? '');
  const h2 = /<h2 class="sec-h">([\s\S]*?)<\/h2>/.exec(t2)?.[1] ?? '';
  return {
    eyebrow: one(t2, /class="eyebrow[^"]*">([^<]+)</),
    title: decode(h2.replace(/<[^>]+>/g, '')),
    tabsLabel: one(t2, /role="tablist" aria-label="([^"]+)"/),
    pick: one(t2, /class="hint mono">([^<]+)</),
    pairs: [...t2.matchAll(/<button class="tab" role="tab"[^>]*>([\s\S]*?)<\/button>/g)].map(([, a]) => ({
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
const problem = mockupProblem(readFileSync(SELECTOR_MOCKUP, 'utf8'));
const drawingLabel = mockupDrawingLabel(html);

/** The chunks of T2's motion, as Vite names them after their source files. */
const TEXT_CHUNK = /\/_astro\/story-text-motion\.[^/]*\.js$/;
const DRAWING_CHUNK = /\/_astro\/story-(motion|drawing)\.[^/]*\.js$/;

/** Every script URL the page asks for, from before the first byte. */
function scriptRequests(page: import('@playwright/test').Page) {
  const urls: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'script') urls.push(new URL(r.url()).pathname);
  });
  return urls;
}

const t2 = (page: import('@playwright/test').Page) => page.locator('main#main-content section#problem');
const tab = (page: import('@playwright/test').Page, i: number) => t2(page).getByRole('tab').nth(i);

/** The stage shows pair `i`'s final frame, still: exactly the served <template> of that pair. */
async function stageShowsFinalFrame(page: import('@playwright/test').Page, i: number) {
  return page.evaluate((k) => {
    const host = document.querySelector('[data-pv-story-drawing]')!;
    const frame = document.querySelectorAll<HTMLTemplateElement>('template[data-pv-frame]')[k];
    const box = document.createElement('div');
    box.append(frame.content.cloneNode(true));
    return host.innerHTML === box.innerHTML;
  }, i);
}

/** Every word of T2 is on screen: eyebrow, heading, drawing, and the four pairs open and resolved. */
async function expectProblemComplete(page: import('@playwright/test').Page) {
  const sec = t2(page);
  await expect(sec).toBeVisible();
  await expect(sec.getByText(problem.eyebrow, { exact: true })).toBeVisible();
  await expect(sec.getByRole('heading', { level: 2, name: problem.title })).toBeVisible();
  const drawing = sec.getByRole('img', { name: drawingLabel });
  await expect(drawing).toBeVisible();
  expect((await drawing.boundingBox())?.height ?? 0, 'the drawing has a body').toBeGreaterThan(200);
  for (const pair of problem.pairs) {
    await expect(sec.getByText(pair.n, { exact: true })).toBeVisible();
    const prob = sec.getByText(pair.problem, { exact: true });
    await expect(prob).toBeVisible();
    // Struck through, all the way.
    await expect(prob, 'struck the full width').toHaveCSS('background-size', /^100% /);
    await expect(sec.getByText(pair.problemText, { exact: true })).toBeVisible();
    const sol = sec.getByRole('heading', { level: 3, name: pair.solution, exact: true });
    await expect(sol).toBeVisible();
    // The way out is WRITTEN, not just labelled: the typed (visible) part is the
    // whole phrase, nothing is left in the ghost that is still to be typed.
    await expect(sol.locator('.pv-done')).toHaveText(pair.solution);
    await expect(sol.locator('.pv-rest')).toHaveText('');
    await expect(sec.getByText(pair.solutionText, { exact: true })).toBeVisible();
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

  test('the reference mock-ups yield the T2 words (the reader is not blind)', () => {
    expect(problem.eyebrow).toBe('Where most companies get stuck');
    expect(problem.title).toBe('Everyone talks about AI. Nobody tells you where to start.');
    expect(problem.tabsLabel).toBe('Where companies get stuck');
    expect(problem.pick).toBe('Pick one');
    expect(drawingLabel.length).toBeGreaterThan(80);
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
      // Nothing to pick without JavaScript, so nothing says "pick one", and no
      // tab semantics promise a selector that cannot work.
      await expect(t2(page).getByText(problem.pick, { exact: true })).toBeHidden();
      await expect(t2(page).getByRole('tab')).toHaveCount(0);
      expect(await stageShowsFinalFrame(page, 0), 'pair 1, still, in order').toBe(true);
    });

    test('carries the six tramos as sections with their ids', async ({ page }) => {
      await page.goto(ROUTE);
      for (const id of ['top', 'problem', 'built', 'orchestrator', 'work', 'contact']) {
        await expect(page.locator(`main#main-content > section#${id}`)).toHaveCount(1);
      }
    });
  });

  test('with reduced motion, T2 stays whole and still, and its motion is never downloaded', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const scripts = scriptRequests(page);
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await expectProblemComplete(page);
    await expect(t2(page)).not.toHaveClass(/is-fx/);

    // The selector still works: it changes the drawing, still, in order.
    await tab(page, 2).click();
    await expect(tab(page, 2)).toHaveAttribute('aria-selected', 'true');
    expect(await stageShowsFinalFrame(page, 2)).toBe(true);
    await expectProblemComplete(page);

    expect(scripts.some((u) => u.includes('home.astro')), 'the page script ran (the check is not vacuous)').toBe(true);
    expect(scripts.filter((u) => TEXT_CHUNK.test(u) || DRAWING_CHUNK.test(u))).toEqual([]);
  });

  test.describe('with motion', () => {
    test('1440: the four pairs are WAI-ARIA tabs with a roving tabindex', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const list = t2(page).getByRole('tablist', { name: problem.tabsLabel });
      await expect(list).toHaveAttribute('aria-orientation', 'vertical');
      const tabs = list.getByRole('tab');
      await expect(tabs).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const name = `${problem.pairs[i].n} ${problem.pairs[i].problem}`;
        await expect(tabs.nth(i)).toHaveAccessibleName(name);
        await expect(tabs.nth(i)).toHaveAttribute('aria-selected', String(i === 0));
        await expect(tabs.nth(i)).toHaveAttribute('tabindex', i === 0 ? '0' : '-1');
        const panelId = await tabs.nth(i).getAttribute('aria-controls');
        const panel = page.locator(`#${panelId}`);
        await expect(panel).toHaveAttribute('role', 'tabpanel');
        await expect(panel).toHaveAttribute('aria-labelledby', (await tabs.nth(i).getAttribute('id'))!);
      }
      await expect(t2(page).getByText(problem.pick, { exact: true })).toBeVisible();

      // Keyboard: arrows (both axes, wrapping), Home, End. Selection follows focus.
      const expectOn = async (i: number) => {
        await expect(tabs.nth(i)).toBeFocused();
        await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
        await expect(tabs.nth(i)).toHaveAttribute('tabindex', '0');
        await expect(t2(page).locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
        await expect(t2(page).locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
        await expect(t2(page).getByRole('tabpanel')).toHaveCount(1); // only the chosen one is open
      };
      await tabs.nth(0).focus();
      await page.keyboard.press('ArrowDown');
      await expectOn(1);
      await page.keyboard.press('ArrowRight');
      await expectOn(2);
      await page.keyboard.press('ArrowLeft');
      await expectOn(1);
      await page.keyboard.press('End');
      await expectOn(3);
      await page.keyboard.press('ArrowDown');
      await expectOn(0);
      await page.keyboard.press('ArrowUp');
      await expectOn(3);
      await page.keyboard.press('Home');
      await expectOn(0);
    });

    test('1440: pair 1 plays when the stage is seen, a chosen pair opens, seen pairs stay struck, nothing moves on', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const scripts = scriptRequests(page);
      await page.goto(ROUTE);
      const sec = t2(page);
      await expect(sec).toHaveClass(/is-fx/);
      expect(scripts.some((u) => TEXT_CHUNK.test(u)), 'text motion downloaded').toBe(true);
      expect(scripts.some((u) => DRAWING_CHUNK.test(u)), 'drawing motion downloaded').toBe(true);

      // Before the stage is on screen, pair 1 has not started.
      const first = sec.getByText(problem.pairs[0].problem, { exact: true });
      await page.waitForTimeout(500);
      await expect(first.locator('xpath=..')).not.toHaveClass(/is-struck/);
      await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
      const sol1 = sec.getByRole('heading', { level: 3, name: problem.pairs[0].solution, exact: true });
      await expect(sol1.locator('.pv-done')).toHaveText(problem.pairs[0].solution, { timeout: 5000 });
      await expect(first.locator('xpath=..')).toHaveClass(/is-struck/);

      // The drawing is moving, not a still: two moments of pair 3 differ.
      await tab(page, 2).click();
      const svgAt = () => page.locator('[data-pv-story-drawing]').innerHTML();
      const a = await svgAt();
      await page.waitForTimeout(400);
      const b = await svgAt();
      expect(a, 'the drawing animates on a wide screen').not.toBe(b);

      // The chosen pair opens and resolves; the others are closed; pair 1 stays struck.
      const p3 = problem.pairs[2];
      await expect(sec.getByRole('tabpanel')).toHaveCount(1);
      await expect(sec.getByText(p3.problemText, { exact: true })).toBeVisible();
      await expect(sec.getByText(problem.pairs[0].problemText, { exact: true })).toBeHidden();
      await expect(sec.getByRole('heading', { level: 3, name: p3.solution }).locator('.pv-done')).toHaveText(p3.solution, { timeout: 5000 });
      await expect(sec.getByText(p3.solutionText, { exact: true })).toBeVisible();
      await expect(first.locator('xpath=..')).toHaveClass(/is-struck/);
      // Never chosen, never struck.
      await expect(sec.getByText(problem.pairs[1].problem, { exact: true }).locator('xpath=..')).not.toHaveClass(/is-struck/);

      // Nothing moves on by itself.
      await page.waitForTimeout(4000);
      await expect(tab(page, 2)).toHaveAttribute('aria-selected', 'true');
      await expect(sec.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      // ...and the drawing has settled: no frame changes once in order.
      const c = await svgAt();
      await page.waitForTimeout(400);
      expect(await svgAt()).toBe(c);
    });

    test('1440: the stage stays in view (sticky) beside the list', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const stage = t2(page).locator('[data-pv-stage]');
      await expect(stage).toHaveCSS('position', 'sticky');
      const box = await page.evaluate(() => {
        const s = document.querySelector('[data-pv-stage]')!.getBoundingClientRect();
        const l = document.querySelector('.pv-list')!.getBoundingClientRect();
        return { stageLeft: s.left, listRight: l.right, size: s.width };
      });
      expect(box.stageLeft, 'stage to the right of the list').toBeGreaterThan(box.listRight);
      expect(box.size, 'a stage with a body').toBeGreaterThan(400);
    });

    for (const [width, height] of [[375, 812], [768, 1024]]) {
      test(`${width}: the text plays, the drawing never moves and its motion is never downloaded`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        const scripts = scriptRequests(page);
        await page.goto(ROUTE);
        const sec = t2(page);
        await expect(sec).toHaveClass(/is-fx/);

        // Stage on top of the list.
        const order = await page.evaluate(() => ({
          stage: document.querySelector('[data-pv-stage]')!.getBoundingClientRect().top,
          list: document.querySelector('.pv-list')!.getBoundingClientRect().top,
        }));
        expect(order.stage).toBeLessThan(order.list);

        await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
        const p1 = problem.pairs[0];
        await expect(sec.getByRole('heading', { level: 3, name: p1.solution }).locator('.pv-done')).toHaveText(p1.solution, { timeout: 5000 });
        expect(await stageShowsFinalFrame(page, 0)).toBe(true);

        // Choosing pair 4: the text animates — caught half-way: problem not yet
        // struck, way out not yet written — then resolves.
        await tab(page, 3).click();
        const p4 = problem.pairs[3];
        const sol4 = sec.getByRole('heading', { level: 3, name: p4.solution });
        expect(await sol4.locator('.pv-rest').textContent(), 'the way out is still being written').not.toBe('');
        // The drawing changed to pair 4 at once, in order, still.
        expect(await stageShowsFinalFrame(page, 3)).toBe(true);
        await page.waitForTimeout(300);
        expect(await stageShowsFinalFrame(page, 3), 'no motion in the drawing').toBe(true);

        await expect(sol4.locator('.pv-done')).toHaveText(p4.solution, { timeout: 5000 });
        await expect(sec.getByText(p4.solutionText, { exact: true })).toBeVisible();
        await expect(sec.getByText(p4.problem, { exact: true }).locator('xpath=..')).toHaveClass(/is-struck/);
        await expect(sec.getByText(p1.problem, { exact: true }).locator('xpath=..')).toHaveClass(/is-struck/);

        expect(scripts.some((u) => TEXT_CHUNK.test(u)), 'text motion downloaded').toBe(true);
        expect(scripts.filter((u) => DRAWING_CHUNK.test(u)), 'drawing motion NOT downloaded').toEqual([]);
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
