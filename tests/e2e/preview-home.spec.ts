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
 *     motion is only downloaded where it runs; pair 1's drawing the «Tetris»
 *     timeline, which starts over every time the pair is chosen, and whose last
 *     frame stands still wherever it does not move;
 *   - its T2 heading, selector and stage inside one 1440 × 900 screen;
 *   - WCAG 2 AA clean with reduced motion.
 *
 * The words are not copied into this file. They are read out of the reference
 * mock-ups committed at docs/design/portada-nueva/ — portada-aglaya.html (T1,
 * and the drawing's label), t2-selector.html (T2) and t2-anim1-tetris.html
 * (pair 1's way out, its paragraph, and its drawing) — built page against
 * reference artefact, so the page cannot drift from the mock-up while this
 * suite stays green, and the suite cannot agree with the page just because
 * both were edited together.
 *
 * Needs a build (served from `dist`), like the rest of tests/e2e.
 */

const ROUTE = '/preview/home/';
const MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/portada-aglaya.html', import.meta.url));
const SELECTOR_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t2-selector.html', import.meta.url));
const TETRIS_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t2-anim1-tetris.html', import.meta.url));

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
    pairs: [...t2.matchAll(/<button class="tab" role="tab"[^>]*>([\s\S]*?)<\/button>/g)].map(([, a]) => ({
      n: one(a, /class="n mono">([^<]+)</),
      problem: one(a, /class="prob-h">([^<]+)</),
      problemText: one(a, /class="prob-p">([^<]+)</),
      solution: one(a, /class="sol-h" aria-label="([^"]+)"/),
      solutionText: one(a, /class="sol-p">([^<]+)</),
    })),
  };
}

/** Pair 1 as agreed for the Tetris: its card texts, the canvas's label, and the words of its last frame (`TX.en`). */
export function mockupTetris(html: string) {
  const one = (re: RegExp) => decode(re.exec(html)?.[1] ?? '');
  const en = /en:\{([^}]*)\}/.exec(html)?.[1] ?? '';
  const tx = (k: string) => new RegExp(`\\b${k}:'([^']+)'`).exec(en)?.[1] ?? '';
  return {
    problem: one(/class="prob-h">([^<]+)</),
    solution: one(/class="sol-h">([^<]+)</),
    solutionText: one(/class="sol-p">([^<]+)</),
    label: one(/id="cv"[^>]*aria-label="([^"]+)"/),
    head: [tx('h1'), tx('h2')],
    sub: `${tx('s1')} ${tx('s2')}`,
    builtFor: tx('builtFor'),
    needs: [...(/needs:\[([^\]]+)\]/.exec(en)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]),
  };
}

/** Pair 1's board as the mock-up draws it: the logical canvas (its bitmap over its scale `S`) and the well. */
export function mockupTetrisGeometry(html: string) {
  const cv = /<canvas id="cv" width="(\d+)" height="(\d+)"/.exec(html);
  const S = +(/getContext\('2d'\),S=([\d.]+)/.exec(html)?.[1] ?? NaN);
  const g = /var COLS=(\d+),ROWS=(\d+),C=(\d+),OX=(\d+),OY=(\d+)/.exec(html);
  const depth = (/var DEPTH=\[([^\]]+)\]/.exec(html)?.[1] ?? '').split(',').map(Number);
  const [COLS, ROWS, C, OX, OY] = (g?.slice(1) ?? []).map(Number);
  return { W: cv ? +cv[1] / S : NaN, H: cv ? +cv[2] / S : NaN, COLS, ROWS, C, OX, OY, depth };
}

const html = readFileSync(MOCKUP, 'utf8');
const hook = mockupHook(html);
const tetris = mockupTetris(readFileSync(TETRIS_MOCKUP, 'utf8'));
const board = mockupTetrisGeometry(readFileSync(TETRIS_MOCKUP, 'utf8'));
/** T2: the selector mock-up, with pair 1's way out as agreed for the Tetris. */
const problem = (() => {
  const p = mockupProblem(readFileSync(SELECTOR_MOCKUP, 'utf8'));
  p.pairs[0] = { ...p.pairs[0], solution: tetris.solution, solutionText: tetris.solutionText };
  return p;
})();
const drawingLabel = mockupDrawingLabel(html);
/** The stage's name with pair 1 on it: the Tetris canvas's label, then the words its last frame shows. */
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const tetrisLabel = `${tetris.label} ${sentence(tetris.head.join(' '))} ${tetris.sub}`;
const PICK = /pick one/i;

/** The chunks of T2's motion, as Vite names them after their source files. */
const TEXT_CHUNK = /\/_astro\/story-text-motion\.[^/]*\.js$/;
const DRAWING_CHUNK = /\/_astro\/story-(motion|drawing|tetris)\.[^/]*\.js$/;

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

/** Pair 1's last frame, still, is what the stage holds: the Tetris SVG, its words, no canvas. */
async function expectTetrisStill(page: import('@playwright/test').Page) {
  const host = t2(page).locator('[data-pv-story-drawing]');
  await expect(host.locator('svg[data-pv-tetris-still]')).toHaveCount(1);
  await expect(host.locator('canvas')).toHaveCount(0);
  const words = (await host.locator('svg text').allTextContents()).map((w) => w.trim());
  for (const w of [...tetris.head, tetris.builtFor, ...tetris.needs]) expect(words, `the last frame says ${w}`).toContain(w);
  expect(words.filter((w) => w === tetris.builtFor)).toHaveLength(4);
  expect(words.join(' '), 'the line under the headline').toContain(tetris.sub.split(' and ')[0]);
  await expect(host).toHaveAccessibleName(tetrisLabel);
}

/**
 * The stage's box and the drawing inside it: the drawing is the board's ratio
 * (4:5), whole inside the box and centred in it. «Whole» is measured, not
 * assumed: the drawn element (canvas or SVG) against the box's inner edges.
 */
async function stageGeometry(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const r = (el: Element) => el.getBoundingClientRect();
    const host = document.querySelector<HTMLElement>('[data-pv-story-drawing]')!;
    const box = r(host);
    const list = r(document.querySelector('#problem .pv-list')!);
    const drawn = host.firstElementChild!;
    const d = r(drawn);
    const b = host.clientLeft;
    const inner = { left: box.left + b, right: box.right - b, top: box.top + b, bottom: box.bottom - b };
    const cv = drawn instanceof HTMLCanvasElement ? { w: drawn.width, h: drawn.height } : null;
    return {
      box: { top: box.top, bottom: box.bottom, width: box.width, height: box.height },
      list: { top: list.top, bottom: list.bottom },
      tag: drawn.tagName.toLowerCase(),
      ratio: d.width / d.height,
      dx: (d.left + d.right) / 2 - (box.left + box.right) / 2,
      dy: (d.top + d.bottom) / 2 - (box.top + box.bottom) / 2,
      inside: d.left >= inner.left - 0.5 && d.right <= inner.right + 0.5 && d.top >= inner.top - 0.5 && d.bottom <= inner.bottom + 0.5,
      // Touches the box on at least one axis: scaled to fit, not merely small.
      fits: Math.min(inner.right - inner.left - d.width, inner.bottom - inner.top - d.height) < 1,
      bitmap: cv && cv.w / cv.h,
    };
  });
}

function expectContained(g: Awaited<ReturnType<typeof stageGeometry>>, what: string) {
  expect(Math.abs(g.ratio / (board.W / board.H) - 1), `${what}: the drawing is ${board.W}:${board.H}`).toBeLessThanOrEqual(0.01);
  expect(g.inside, `${what}: the drawing is whole inside the box`).toBe(true);
  expect(g.fits, `${what}: the drawing is scaled to fit the box`).toBe(true);
  expect(Math.abs(g.dx), `${what}: centred across`).toBeLessThanOrEqual(2);
  expect(Math.abs(g.dy), `${what}: centred down`).toBeLessThanOrEqual(2);
  if (g.bitmap !== null) expect(Math.abs(g.bitmap / (board.W / board.H) - 1), `${what}: the canvas bitmap is ${board.W}:${board.H} too`).toBeLessThanOrEqual(0.01);
}

/** The stage holds the drawing and nothing else: no «1 / 4» caption, nothing that says which pair is on it. */
async function expectNoStageCaption(page: import('@playwright/test').Page) {
  const extra = await page.evaluate(() => {
    const stage = document.querySelector('[data-pv-stage]')!;
    return [...stage.children]
      .filter((el) => !el.matches('[data-pv-story-drawing], template[data-pv-frame]'))
      .map((el) => el.outerHTML);
  });
  expect(extra, 'nothing on the stage but the drawing').toEqual([]);
  await expect(page.locator('#problem').getByText(/^\s*\d\s*\/\s*4\s*$/)).toHaveCount(0);
}

/** Every word of T2 is on screen: eyebrow, heading, drawing, and the four pairs open and resolved. */
async function expectProblemComplete(page: import('@playwright/test').Page, label = tetrisLabel) {
  const sec = t2(page);
  await expect(sec).toBeVisible();
  await expect(sec.getByText(problem.eyebrow, { exact: true })).toBeVisible();
  await expect(sec.getByRole('heading', { level: 2, name: problem.title })).toBeVisible();
  const drawing = sec.getByRole('img', { name: label, exact: true });
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
    expect(drawingLabel.length).toBeGreaterThan(80);
    // Pair 1 as agreed with Ibai on 2026-10-04 (card 00b8dd08), read off the Tetris mock-up.
    expect(tetris.problem, 'the Tetris mock-up is pair 1').toBe(problem.pairs[0].problem);
    expect(tetris.solution).toBe('We make the system fit the need');
    expect(tetris.solutionText).toBe(
      'Stop bending off-the-shelf tools to fit your company. We sit with each department, find what actually needs solving, and build each need a system made for it.',
    );
    expect(tetris.label.length).toBeGreaterThan(80);
    expect(tetris.head).toEqual(['THE RIGHT SYSTEMS,', 'MADE FOR YOU.']);
    expect(tetris.sub).toBe('Start from your actual needs and let your company grow solid.');
    expect(tetris.builtFor).toBe('BUILT FOR');
    expect(tetris.needs).toEqual(['SALES', 'REPORTING', 'SUPPORT', 'HIRING']);
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

    test('T2: no «1 / 4» on the stage, and the still frame is 4:5, whole and centred in a box as tall as the list', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      await expectNoStageCaption(page);
      const g = await stageGeometry(page);
      expect(g.tag).toBe('svg');
      expect(Math.abs(g.box.top - g.list.top), 'box top = list top').toBeLessThanOrEqual(2);
      expect(Math.abs(g.box.bottom - g.list.bottom), 'box bottom = list bottom').toBeLessThanOrEqual(2);
      expectContained(g, 'no JavaScript');
    });

    test('T2 is complete and visible, word for word from the mock-up', async ({ page }) => {
      await page.goto(ROUTE);
      await expectProblemComplete(page);
      // No tab semantics promise a selector that cannot work.
      await expect(t2(page).getByRole('tab')).toHaveCount(0);
      // Pair 1's last frame stands on the stage, still, as served.
      expect(await stageShowsFinalFrame(page, 0), 'pair 1, still, in order').toBe(true);
      await expectTetrisStill(page);
    });

    test('nothing says "pick one", in the page or in what it serves', async ({ page }) => {
      const res = await page.goto(ROUTE);
      expect(await res!.text()).not.toMatch(PICK);
      await expect(page.getByText(PICK)).toHaveCount(0);
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
    expect(await stageShowsFinalFrame(page, 0)).toBe(true);
    await expectTetrisStill(page);

    // The selector still works: it changes the drawing, still, in order, and its name.
    await tab(page, 2).click();
    await expect(tab(page, 2)).toHaveAttribute('aria-selected', 'true');
    expect(await stageShowsFinalFrame(page, 2)).toBe(true);
    await expectProblemComplete(page, drawingLabel);
    // Back on pair 1: its last frame again, still — chosen twice, still still.
    await tab(page, 0).click();
    await tab(page, 0).click();
    await page.waitForTimeout(300);
    expect(await stageShowsFinalFrame(page, 0)).toBe(true);
    await expectTetrisStill(page);
    await expect(page.getByText(PICK)).toHaveCount(0);

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
      await expect(page.getByText(PICK), 'no "pick one" once the selector works either').toHaveCount(0);

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

    test('1440: pair 1 is the Tetris timeline, and choosing it starts it over', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const sec = t2(page);
      const canvas = sec.locator('[data-pv-story-drawing] canvas');
      await expect(canvas).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(tetrisLabel);
      /** How much of the well is painted (non-white), and a fingerprint of the frame. */
      const frame = () =>
        canvas.evaluate((cv: HTMLCanvasElement) => {
          const ctx = cv.getContext('2d')!;
          const { data } = ctx.getImageData(0, 0, cv.width, cv.height);
          let ink = 0;
          let hash = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] + data[i + 1] + data[i + 2] < 600) ink++;
            hash = (hash * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7) | 0;
          }
          return { ink: ink / (cv.width * cv.height), hash };
        });

      // Starts when the stage is seen; tools pile up — the frame keeps changing.
      await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const early = await frame();
      await page.waitForTimeout(3000);
      const piled = await frame();
      expect(piled.hash, 'the canvas moves').not.toBe(early.hash);
      expect(piled.ink, 'tools have piled up on the company').toBeGreaterThan(early.ink + 0.01);

      // Chosen again while on screen: it starts over — the pile is gone.
      await tab(page, 0).click();
      await page.waitForTimeout(150);
      const restarted = await frame();
      expect(restarted.ink, 'back to an empty well').toBeLessThan(piled.ink - 0.01);
      await page.waitForTimeout(3600);
      expect((await frame()).ink, 'and it plays again').toBeGreaterThan(restarted.ink + 0.01);

      // Leaving for pair 2 puts its own drawing on the stage; coming back starts the timeline from 0.
      await tab(page, 1).click();
      await expect(canvas).toHaveCount(0);
      await expect(sec.locator('[data-pv-story-drawing] svg')).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(drawingLabel);
      await tab(page, 0).click();
      await expect(canvas).toHaveCount(1);
      await page.waitForTimeout(150);
      expect((await frame()).ink, 'from the start').toBeLessThan(piled.ink - 0.01);
    });

    test('1440: the still frame is drawn at the type sizes the canvas would use', async ({ page }) => {
      // The server draws the last frame without a browser, estimating the width of
      // anything not monospaced; the canvas measures. Wherever the drawing asks "does
      // it fit?", the still frame must have got the canvas's answer.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      const sizes = await page.evaluate(async () => {
        const css = getComputedStyle(document.documentElement);
        const texts = [...document.querySelectorAll('[data-pv-story-drawing] svg[data-pv-tetris-still] text')].map((t) => ({
          text: t.textContent ?? '',
          size: parseFloat((t as SVGTextElement).style.fontSize),
          weight: (t as SVGTextElement).style.fontWeight,
          family: css.getPropertyValue((t as SVGTextElement).style.fontFamily.replace(/^var\((--[^)]+)\)$/, '$1')).trim(),
        }));
        await document.fonts.ready;
        await Promise.all(texts.map((t) => document.fonts.load(`${t.weight} ${t.size}px ${t.family}`)));
        const ctx = document.createElement('canvas').getContext('2d')!;
        return texts.map((t) => {
          ctx.font = `${t.weight} ${t.size}px ${t.family}`;
          return { ...t, width: ctx.measureText(t.text).width };
        });
      });
      const at = (text: string) => sizes.find((s) => s.text === text)!;
      const { COLS, C, depth } = board;
      // The headline: 22px unless wider than the well minus 20 (COLS × C − 20, the mock-up's board).
      for (const line of tetris.head) {
        expect(at(line).size).toBe(22);
        expect(at(line).width, `${line} fits at 22px on the canvas too`).toBeLessThanOrEqual(COLS * C - 20);
      }
      // «BUILT FOR / <need>»: 6.4px unless wider than its piece minus 8. A piece
      // spans the columns between two walls (depth 0) of the company's profile.
      const runs = depth.join(',').split(/(?:^|,)0(?:,|$)/).map((r) => r.split(',').filter(Boolean).length);
      expect(runs, 'four gaps between the walls').toHaveLength(tetris.needs.length);
      tetris.needs.forEach((need, i) => {
        expect(at(need).size).toBe(6.4);
        expect(Math.max(at(need).width, at(tetris.builtFor).width), `${need} fits its piece on the canvas too`).toBeLessThanOrEqual(runs[i] * C - 8);
      });
    });

    test('the still frame is the mock-up\'s 4:5 board: its viewBox, its well, its HUD and «YOUR COMPANY» where the mock-up puts them', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      const { W, H, COLS, ROWS, C, OX, OY } = board;
      expect(W / H, 'the mock-up is 4:5').toBeCloseTo(0.8, 5);
      const svg = page.locator('[data-pv-story-drawing] svg[data-pv-tetris-still]');
      await expect(svg).toHaveAttribute('viewBox', `0 0 ${W} ${H}`);
      const got = await svg.evaluate((el) => {
        const rects = [...el.querySelectorAll('rect')].map((r) => ({ x: +r.getAttribute('x')!, y: +r.getAttribute('y')!, w: +r.getAttribute('width')!, h: +r.getAttribute('height')!, stroke: (r.getAttribute('style') ?? '').includes('stroke:') }));
        const texts = [...el.querySelectorAll('text')].map((t) => ({ text: t.textContent ?? '', x: +t.getAttribute('x')!, y: +t.getAttribute('y')! }));
        return { rects, texts };
      });
      // The paper covers the whole board: no band left unpainted.
      expect(got.rects[0], 'paper over the whole board').toEqual({ x: 0, y: 0, w: W, h: H, stroke: false });
      // The well: the mock-up's OX, OY, COLS × C by ROWS × C (stroked half a pixel out).
      expect(got.rects.find((r) => r.stroke), 'the well').toEqual({ x: OX - 0.5, y: OY - 0.5, w: COLS * C + 1, h: ROWS * C + 1, stroke: true });
      const text = (re: RegExp) => got.texts.find((t) => re.test(t.text))!;
      expect(text(/^YOUR COMPANY$/), '«YOUR COMPANY» on the company').toMatchObject({ x: OX + (COLS * C) / 2, y: OY + 13 * C });
      expect(text(/^NEEDS MET/), 'the HUD above the well').toMatchObject({ x: OX + COLS * C, y: OY - 16 });
      expect(text(new RegExp(`^${tetris.head[0]}$`)), 'the closing headline').toMatchObject({ x: OX + (COLS * C) / 2, y: OY + 3.2 * C });
    });

    test('1440 × 900: the T2 heading, the selector and the stage fit in one screen', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const sec = t2(page);
      for (let i = 0; i < 4; i++) {
        await tab(page, i).click();
        const box = await page.evaluate(() => {
          const q = (s: string) => document.querySelector(`#problem ${s}`)!.getBoundingClientRect();
          const header = document.querySelector('header')!.getBoundingClientRect().height;
          return { header, top: q('h2').top, bottom: Math.max(q('.pv-list').bottom, q('[data-pv-stage]').bottom) };
        });
        const screen = 900 - box.header;
        expect(box.bottom - box.top, `pair ${i + 1} open: heading → bottom of selector and stage, within ${screen}px`).toBeLessThanOrEqual(screen);
      }
      await expect(sec.locator('h2')).not.toHaveCSS('max-width', /ch|px/);
    });

    test('1440: the stage box is as tall as the list for every pair open, the drawing 4:5 inside it, and no «1 / 4»', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const heights = new Set<number>();
      for (const i of [0, 1, 2, 3, 0]) {
        await tab(page, i).click();
        if (i === 0) await expect(t2(page).locator('[data-pv-story-drawing] canvas')).toHaveCount(1);
        await page.waitForTimeout(150);
        const g = await stageGeometry(page);
        expect(g.tag, `pair ${i + 1}: drawn as`).toBe(i === 0 ? 'canvas' : 'svg');
        expect(Math.abs(g.box.top - g.list.top), `pair ${i + 1}: box top = list top`).toBeLessThanOrEqual(2);
        expect(Math.abs(g.box.bottom - g.list.bottom), `pair ${i + 1}: box bottom = list bottom`).toBeLessThanOrEqual(2);
        expectContained(g, `pair ${i + 1}`);
        heights.add(Math.round(g.box.height));
        await expectNoStageCaption(page);
      }
      expect(heights.size, 'the box follows the list when another pair opens').toBeGreaterThan(1);
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
        // On top of the list, the box itself is 4:5 and the drawing fills it; no «1 / 4».
        const g = await stageGeometry(page);
        expect(Math.abs(g.box.width / g.box.height / 0.8 - 1), 'the box is 4:5').toBeLessThanOrEqual(0.01);
        expectContained(g, `${width}`);
        await expectNoStageCaption(page);

        await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
        const p1 = problem.pairs[0];
        await expect(sec.getByRole('heading', { level: 3, name: p1.solution }).locator('.pv-done')).toHaveText(p1.solution, { timeout: 5000 });
        expect(await stageShowsFinalFrame(page, 0)).toBe(true);
        await expectTetrisStill(page);

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
