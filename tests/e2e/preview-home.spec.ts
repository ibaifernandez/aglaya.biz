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
 *     frame stands still wherever it does not move; pair 2's the «heat map»
 *     timeline and pair 3's «the plugs», the same way;
 *   - THREE pairs: Ibai dropped the selector mock-up's fourth («Your data
 *     teaches them») on 2026-10-06 (card 544e2a13); the decision rules over
 *     that mock-up, which stays as the historical reference;
 *   - its T2 heading, selector and stage inside one 1440 × 900 screen;
 *   - its T3 the sketch t3-grid.html built: one wide card and three pairs of
 *     short ones, readable with JavaScript off and still with reduced motion;
 *   - WCAG 2 AA clean with reduced motion.
 *
 * The words of the grill of 2026-10-06 (minutes b7d39088, card 82868b81) ARE
 * written here, in `GRILL`, because no mock-up carries them except T3's: they
 * are Ibai's decisions, copied from the card, not from the page.
 *
 * Every other word is not copied into this file. They are read out of the reference
 * mock-ups committed at docs/design/portada-nueva/ — portada-aglaya.html (T1),
 * t2-selector.html (T2, minus its fourth pair), t2-anim1-tetris.html (pair 1's
 * way out, its paragraph, and its drawing), t2-anim2-heatmap.html (pair 2's
 * drawing) and t2-anim3-plugs.html (pair 3's drawing) — built page against
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
const HEATMAP_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t2-anim2-heatmap.html', import.meta.url));
const PLUGS_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t2-anim3-plugs.html', import.meta.url));
const T3_MOCKUP = fileURLToPath(new URL('../../docs/design/portada-nueva/t3-grid.html', import.meta.url));

/** The grill of 2026-10-06, word for word from card 82868b81 (decisions 3, 6–8, 11–14 of minutes b7d39088). */
const GRILL = {
  hookSub:
    'We bring AI into your company: a few hours for a one-off task, one project when you need a specific system, or a whole stack when your company is ready for its next big step. We work with a team of AI agents under rules, audits and human control. Everything we build is yours, and designed to keep running without us.',
  title: 'Everyone sells you AI tools. Nobody starts from your company.',
  /** Pair 1's paragraph as read; «the one» in italic, «actually» in bold. */
  texts: [
    {
      problemText: 'Chatbots, copilots, agents, automations. Each one promises to be the one that matters. But the one that actually matters is your company.',
      em: 'the one',
      strong: 'actually',
      solutionText: 'Stop bending off-the-shelf tools to fit your company. We sit with each department, find what needs solving, and build each need a system made for it.',
    },
    {
      problemText: 'Licences nobody uses, a bill that grows every month, and a team that stops trusting AI before it does anything useful.',
      solutionText: 'We find where your team loses the most hours and put AI right there first. Licences nobody uses go. Then we grow from what works.',
    },
    {
      problemText: 'Your company runs on tools you rent. If the vendor is bought, shuts down or changes its terms, the work those tools did for you stops with them.',
      solutionText: "What we build runs on infrastructure your company controls. You don't pay us rent for it: it's an asset of your own.",
    },
  ],
  tetrisLabel:
    'Before: AI tools fall faster and faster onto your company, piling up with gaps until they overflow. After: we start from your real needs, the gaps, and each one gets a system built for it that fits in place. The right systems, made for you. Start from your real needs and let your company grow solid.',
};

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

/** Pair 2's drawing as the mock-up writes it: the words of its timeline (`TX.en`). */
export function mockupHeatmap(html: string) {
  const en = /\ben:\{([\s\S]*?)\},\s*es:\{/.exec(html)?.[1] ?? '';
  const tx = (k: string) => new RegExp(`\\b${k}:'([^']+)'`).exec(en)?.[1] ?? '';
  const list = (k: string) => [...(new RegExp(`\\b${k}:\\[([^\\]]+)\\]`).exec(en)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
  return {
    close: [tx('c1'), tx('c2')],
    m1: tx('m1'),
    m2a: tx('m2a'),
    words: list('words'),
    rows: list('rows'),
    days: list('days'),
    sys: tx('sys'),
    built: tx('built'),
    saved: tx('saved'),
    trust: tx('trust'),
    unusedL: tx('unusedL'),
  };
}

/**
 * Pair 2's board as the mock-up lays it out: the logical canvas, the 50 px its
 * 400-wide composition is moved down, the grid's cells, and the rules of
 * `closingFit()` (start size, step, widest line allowed) on which `layout()`
 * hangs the grid and the department names.
 */
export function mockupHeatmapGeometry(html: string) {
  const cv = /<canvas id="cv" width="(\d+)" height="(\d+)"/.exec(html);
  const S = +(/getContext\('2d'\),S=([\d.]+)/.exec(html)?.[1] ?? NaN);
  const g = /var GX=(\d+),GY=(\d+),CW=(\d+),CH=(\d+);/.exec(html);
  const [, GY, CW, CH] = (g?.slice(1) ?? []).map(Number);
  const fit = /function closingFit\(\)\{var fz=(\d+);[\s\S]*?measureText\(TX\.c2\)\.width\)>(\d+)\)\{fz-=([\d.]+);/.exec(html);
  return {
    W: cv ? +cv[1] / S : NaN,
    H: cv ? +cv[2] / S : NaN,
    DY: +(/ctx\.translate\(0,(\d+)\);\s*\/\/ 4:5/.exec(html)?.[1] ?? NaN),
    GY,
    CW,
    CH,
    fz0: fit ? +fit[1] : NaN,
    maxW: fit ? +fit[2] : NaN,
    step: fit ? +fit[3] : NaN,
    /** The two lines of the close sit at GY + 4·CH + 66 and one line (fz · 1.15) below. */
    closeY: +(/fillText\(TX\.c1,200,GY\+4\*CH\+(\d+)\)/.exec(html)?.[1] ?? NaN),
    layout: /function layout\(\)\{var cf=closingFit\(\),w=\(200-cf\.left\)\*2;GX=cf\.left\+w-5\*CW;\}/.test(html),
    namesAtLeft: /var LBL=closingFit\(\)\.left;/.test(html),
  };
}

/** Pair 3's drawing as the mock-up writes it: its card texts, the canvas's label, and the words of its timeline (`TX.en`). */
export function mockupPlugs(html: string) {
  const one = (re: RegExp) => decode((re.exec(html)?.[1] ?? '').replace(/&#39;/g, "'"));
  const en = /\ben:\{([\s\S]*?)\},\s*es:\{/.exec(html)?.[1] ?? '';
  // JS string literals as the mock-up writes them: '…' (with \' inside) or "…".
  const unq = (s: string) => s.replace(/\\'/g, "'");
  const tx = (k: string) => unq(new RegExp(`\\b${k}:'((?:[^'\\\\]|\\\\.)+)'`).exec(en)?.[1] ?? '');
  const list = (k: string) =>
    [...(new RegExp(`\\b${k}:\\[([^\\]]+)\\]`).exec(en)?.[1] ?? '').matchAll(/'((?:[^'\\]|\\.)+)'|"([^"]+)"/g)].map((m) => unq(m[1] ?? m[2]));
  const g = /var FX=(\d+),FY=(\d+),FH=(\d+),WALL0=(\d+),WALL1=(\d+),PITCH=(\d+),CARD_X=(\d+),CARD_W=(\d+),CARD_H=(\d+)/.exec(html);
  const [FX, FY, FH, WALL0, WALL1, PITCH, CARD_X, CARD_W, CARD_H] = (g?.slice(1) ?? []).map(Number);
  return {
    problem: one(/class="prob-h">([^<]+)</),
    problemText: one(/class="prob-p">([^<]+)</),
    solution: one(/class="sol-h">([^<]+)</),
    solutionText: one(/class="sol-p">([^<]+)</),
    label: one(/id="cv"[^>]*aria-label="([^"]+)"/),
    close: [tx('c1'), tx('c2')],
    under: list('c3'),
    owned: tx('owned'),
    live: tx('live'),
    yours: tx('yours'),
    sys: tx('sys'),
    procs: list('procs'),
    notices: list('notices'),
    msg: list('msg'),
    geo: {
      FX, FY, FH, WALL0, WALL1, PITCH, CARD_X, CARD_W, CARD_H,
      HUDY: /HUDY=FY\+FH\+(\d+)/.test(html) ? FY + FH + +/HUDY=FY\+FH\+(\d+)/.exec(html)![1] : NaN,
      STRIPY: /STRIPY=FY\+FH\+(\d+)/.test(html) ? FY + FH + +/STRIPY=FY\+FH\+(\d+)/.exec(html)![1] : NaN,
    },
  };
}

/** The stage's name with pair 2 on it — set word for word on card 6e837be0 (the mock-up's canvas label describes an earlier drawing). */
const HEATMAP_LABEL =
  "Before: the monthly AI bill keeps growing, most licences go unused, and the team's trust in AI drops. After: the week's lost hours by department; one AI system on each hot spot until it cools down, licences go to zero and trust rises. Start where it pays, then grow from what works.";

const html = readFileSync(MOCKUP, 'utf8');
/** T1: the mock-up's words, but the paragraph the grill set. */
const hook = { ...mockupHook(html), sub: GRILL.hookSub };
/** The mock-up's old paragraph: gone since the grill. */
const oldHookSub = mockupHook(html).sub;
const tetris = mockupTetris(readFileSync(TETRIS_MOCKUP, 'utf8'));
const board = mockupTetrisGeometry(readFileSync(TETRIS_MOCKUP, 'utf8'));
const heatmap = mockupHeatmap(readFileSync(HEATMAP_MOCKUP, 'utf8'));
const heat = mockupHeatmapGeometry(readFileSync(HEATMAP_MOCKUP, 'utf8'));
const plugs = mockupPlugs(readFileSync(PLUGS_MOCKUP, 'utf8'));
/** The selector mock-up as it stands: four pairs (the historical reference). */
const selectorMockup = mockupProblem(readFileSync(SELECTOR_MOCKUP, 'utf8'));
/** The pair Ibai dropped on 2026-10-06 (card 544e2a13): nothing of it may reach the page. */
const dropped = selectorMockup.pairs[3];
/**
 * T2 as decided: the selector mock-up's first three pairs, counted «of 3», with
 * pair 1's way out as agreed for the Tetris.
 */
const problem = (() => {
  const p = mockupProblem(readFileSync(SELECTOR_MOCKUP, 'utf8'));
  p.pairs = p.pairs.slice(0, 3).map((q, i) => ({
    ...q,
    n: q.n.replace(/ of 4$/, ' of 3'),
    problemText: GRILL.texts[i].problemText,
    solutionText: GRILL.texts[i].solutionText,
  }));
  p.pairs[0] = { ...p.pairs[0], solution: tetris.solution };
  p.title = GRILL.title;
  return p;
})();
/** The stage's name with pair 3 on it: the plugs canvas's label, word for word. */
const plugsLabel = plugs.label;
/** The stage's name with pair 1 on it: the Tetris canvas's label, then the words its last frame shows. */
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const tetrisLabel = `${tetris.label} ${sentence(tetris.head.join(' '))} ${tetris.sub}`;
/** T3 as the sketch writes it: heading, cards in order (row, «Ours · …», title, paragraph), the link that is not one yet. */
export function mockupBuilt(src: string) {
  const one = (s: string, re: RegExp) => decode((re.exec(s)?.[1] ?? '').replace(/&#39;/g, "'"));
  const h2 = /<h2 class="sec-h">([\s\S]*?)<\/h2>/.exec(src)?.[1] ?? '';
  return {
    eyebrow: one(src, /class="eyebrow mono">([^<]+)</),
    title: decode(h2.replace(/<[^>]+>/g, '')),
    titleEm: one(h2, /<em>([^<]+)<\/em>/),
    lede: one(src, /class="lede">([^<]+)</),
    depthWord: one(src, /class="depth-word"[^>]*>([^<·]+)/),
    // Each card runs from its `data-row` to the next one (cards nest divs, so no closing tag can end it).
    cards: [...src.matchAll(/<div class="card[^"]*" data-row="(\d)">([\s\S]*?)(?=<div class="card[^"]*" data-row=|<\/section>)/g)].map(([, row, c]) => ({
      row: +row,
      ours: one(c, /class="ours mono">([^<]+)</),
      title: one(c, /<h3>([^<]+)<\/h3>/),
      text: one(c, /<\/h3><p>([^<]+)<\/p>/),
    })),
    more: one(src, /class="more">([^<]+?)\s*</),
    speed: (/SPEED=\[([^\]]+)\]/.exec(src)?.[1] ?? '').split(',').map(Number),
  };
}
const t3 = mockupBuilt(readFileSync(T3_MOCKUP, 'utf8'));
const PICK = /pick one/i;

/** The chunks of T2's motion, as Vite names them after their source files. */
const TEXT_CHUNK = /\/_astro\/story-text-motion\.[^/]*\.js$/;
const DRAWING_CHUNK = /\/_astro\/story-(motion|tetris|heatmap|plugs|svg-recorder)\.[^/]*\.js$/;

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

/** Pair 2's last frame, still, is what the stage holds: the heat-map SVG, the close, the cooled grid, no canvas. */
async function expectHeatmapStill(page: import('@playwright/test').Page) {
  const host = t2(page).locator('[data-pv-story-drawing]');
  await expect(host.locator('svg[data-pv-heatmap-still]')).toHaveCount(1);
  await expect(host.locator('canvas')).toHaveCount(0);
  const words = (await host.locator('svg text').allTextContents()).map((w) => w.trim());
  for (const w of [...heatmap.close, ...heatmap.rows, ...heatmap.days, heatmap.trust]) expect(words, `the last frame says ${w}`).toContain(w);
  // The markers at their final value: four systems, every hot spot cooled to 0H, no unused licence left.
  expect(words).toContain(`${heatmap.built}  04`);
  expect(words).toContain(`${heatmap.unusedL}  0`);
  expect(words.filter((w) => w === '0H')).toHaveLength(8);
  // Nothing of the timeline's middle stays on the last frame.
  for (const w of [heatmap.m1, heatmap.m2a, ...heatmap.words, `${heatmap.sys} #1`]) expect(words, `${w} is gone by the end`).not.toContain(w);
  await expect(host).toHaveAccessibleName(HEATMAP_LABEL);
}

/** Pair 3's last frame, still, is what the stage holds: the plugs SVG, the close, four owned systems, nothing stopped, no canvas. */
async function expectPlugsStill(page: import('@playwright/test').Page) {
  const host = t2(page).locator('[data-pv-story-drawing]');
  await expect(host.locator('svg[data-pv-plugs-still]')).toHaveCount(1);
  await expect(host.locator('canvas')).toHaveCount(0);
  const words = (await host.locator('svg text').allTextContents()).map((w) => w.trim());
  for (const w of [...plugs.close, ...plugs.under, ...plugs.procs]) expect(words, `the last frame says ${w}`).toContain(w);
  for (const p of plugs.procs) expect(words, `${plugs.sys} · ${p}`).toContain(`${plugs.sys} · ${p}`);
  expect(words.filter((w) => w === plugs.yours), `four «${plugs.yours}»`).toHaveLength(4);
  expect(words).toContain(`${plugs.owned}  4/4`);
  expect(words).toContain(`${plugs.live}  4/4`);
  // Nothing of the timeline's middle stays: no notice, no message line, nothing stopped.
  for (const w of [...plugs.notices, ...plugs.msg, 'STOPPED']) expect(words, `${w} is gone by the end`).not.toContain(w);
  await expect(host).toHaveAccessibleName(plugsLabel);
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
  await expect(page.locator('#problem').getByText(/^\s*\d\s*\/\s*[34]\s*$/)).toHaveCount(0);
}

/** Every word of T2 is on screen: eyebrow, heading, drawing, and the three pairs open and resolved. */
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

  // Card 75d4eda9: Ibai reads the T1 paragraph better across the whole container,
  // so it carries no `max-width` (it used to stop at 56ch).
  for (const [w, h] of [[1440, 900], [768, 1024], [375, 812]] as const) {
    test(`${w}: the T1 paragraph spans its container, with no max-width and no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      const sub = page.locator('main#main-content section#top').getByText(hook.sub, { exact: true });
      await expect(sub).toBeVisible();
      const m = await sub.evaluate((el) => {
        const cs = getComputedStyle(el);
        const parent = el.parentElement as HTMLElement;
        const pcs = getComputedStyle(parent);
        const inner = parent.clientWidth - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight);
        return {
          maxWidth: cs.maxWidth,
          width: el.getBoundingClientRect().width,
          inner,
          lines: Math.round(el.getBoundingClientRect().height / parseFloat(cs.lineHeight)),
          sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(m.maxWidth).toBe('none');
      expect(Math.abs(m.width - m.inner), `paragraph ${m.width}px vs container ${m.inner}px`).toBeLessThanOrEqual(1);
      expect(m.sideways, 'no horizontal scroll').toBeLessThanOrEqual(0);
      // Two lines in Ibai's capture of the old paragraph; the grill's is longer and takes three.
      if (w === 1440) expect(m.lines, 'three lines at 1440').toBe(3);
    });
  }

  test('the reference mock-ups yield the T2 words (the reader is not blind)', () => {
    expect(problem.eyebrow).toBe('Where most companies get stuck');
    expect(problem.title).toBe('Everyone sells you AI tools. Nobody starts from your company.');
    expect(problem.tabsLabel).toBe('Where companies get stuck');
    // Pair 1 as agreed with Ibai on 2026-10-04 (card 00b8dd08), read off the Tetris mock-up.
    expect(tetris.problem, 'the Tetris mock-up is pair 1').toBe(problem.pairs[0].problem);
    expect(tetris.solution).toBe('We make the system fit the need');
    expect(tetris.label.length).toBeGreaterThan(80);
    expect(tetris.head).toEqual(['THE RIGHT SYSTEMS,', 'MADE FOR YOU.']);
    expect(tetris.sub).toBe('Start from your real needs and let your company grow solid.');
    // Decision 10: the label says what the drawing shows now, and ends on its last words.
    expect(tetrisLabel).toBe(GRILL.tetrisLabel);
    expect(tetris.builtFor).toBe('BUILT FOR');
    expect(tetris.needs).toEqual(['SALES', 'REPORTING', 'SUPPORT', 'HIRING']);
    // Pair 2's drawing, read off the heat-map mock-up (card 6e837be0).
    expect(heatmap.close).toEqual(['START WHERE IT PAYS.', 'THEN GROW FROM WHAT WORKS.']);
    expect(heatmap.m2a).toBe('AND NOTHING GOT');
    expect(heatmap.words).toEqual(['FASTER.', 'CHEAPER.', 'SIMPLER.', 'MORE EFFICIENT.', 'BETTER.']);
    expect(heatmap.rows).toEqual(['SALES', 'OPS', 'FINANCE', 'SUPPORT']);
    expect(heatmap.days).toHaveLength(5);
    expect(heatmap.sys).toBe('AI SYSTEM');
    expect([heatmap.built, heatmap.saved, heatmap.trust, heatmap.unusedL].every((w) => w.length > 5)).toBe(true);
    expect(heat).toMatchObject({ W: 400, H: 500, DY: 50, GY: 96, CW: 56, CH: 40, fz0: 22, maxW: 360, step: 0.5, closeY: 66, layout: true, namesAtLeft: true });
    // Pair 3's drawing, read off the plugs mock-up (card 544e2a13); its card texts are pair 3's.
    expect(plugs.problem, 'the plugs mock-up is pair 3').toBe(problem.pairs[2].problem);
    expect(plugs.solution).toBe(problem.pairs[2].solution);
    expect(plugs.label.length).toBeGreaterThan(80);
    expect(plugs.label).toContain("your company's asset");
    expect(plugs.close).toEqual(['BUILT FOR YOU.', 'YOURS TO KEEP.']);
    expect(plugs.under).toEqual(['No more rent. What we build', "becomes your company's asset."]);
    expect(plugs.procs).toEqual(['LEADS', 'ORDERS', 'REPORTS', 'SUPPORT']);
    expect(plugs.notices).toEqual(['ACQUIRED', 'PLAN CHANGE', 'SHUTDOWN', 'NEW TERMS']);
    expect(plugs.msg).toHaveLength(6);
    expect([plugs.owned, plugs.live, plugs.yours, plugs.sys]).toEqual(['DIGITAL ASSETS', 'STILL RUNNING', 'YOUR ASSET', 'SYSTEM']);
    expect(plugs.geo).toMatchObject({ FX: 40, FY: 75, FH: 270, WALL0: 230, WALL1: 360, HUDY: 369, STRIPY: 393 });
    // The selector mock-up still has four pairs — the decision, not the mock-up, says three.
    expect(selectorMockup.pairs).toHaveLength(4);
    expect(dropped.problem).toBe('Your data teaches them');
    expect(problem.pairs).toHaveLength(3);
    expect(problem.pairs.map((p) => p.n)).toEqual(['Problem 1 of 3', 'Problem 2 of 3', 'Problem 3 of 3']);
    for (const p of problem.pairs) {
      expect(p.problem.length).toBeGreaterThan(5);
      expect(p.problemText.length).toBeGreaterThan(60);
      expect(p.solution.length).toBeGreaterThan(5);
      expect(p.solutionText.length).toBeGreaterThan(60);
    }
  });

  test('T2 has three pairs: no trace of the dropped fourth, and nothing counts «of 4»', async ({ request }) => {
    const served = decode((await (await request.get(ROUTE)).text()).replace(/&#39;/g, "'"));
    for (const w of [dropped.problem, dropped.problemText, dropped.solution, dropped.solutionText]) {
      expect(served, `«${w}» is gone`).not.toContain(w);
    }
    expect(served).not.toMatch(/Problem \d of 4/);
    for (const p of problem.pairs) expect(served).toContain(p.n);
    expect(served.match(/<template data-pv-frame/g), 'one still frame per pair').toHaveLength(3);
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

    test('T2: pair 2\'s last frame is served too, still, under its own name', async ({ page }) => {
      await page.goto(ROUTE);
      const frame = page.locator('template[data-pv-frame]').nth(1);
      await expect(frame).toHaveAttribute('data-pv-label', HEATMAP_LABEL);
      // What the selector would put on the stage: put it there, as it would, and read it.
      await page.evaluate(() => {
        const host = document.querySelector('[data-pv-story-drawing]')!;
        const t = document.querySelectorAll<HTMLTemplateElement>('template[data-pv-frame]')[1];
        host.replaceChildren(t.content.cloneNode(true));
        host.setAttribute('aria-label', t.dataset.pvLabel ?? '');
      });
      await expectHeatmapStill(page);
    });

    test('T2: pair 3\'s last frame is served too, still, under its own name', async ({ page }) => {
      await page.goto(ROUTE);
      const frame = page.locator('template[data-pv-frame]').nth(2);
      await expect(frame).toHaveAttribute('data-pv-label', plugsLabel);
      await page.evaluate(() => {
        const host = document.querySelector('[data-pv-story-drawing]')!;
        const t = document.querySelectorAll<HTMLTemplateElement>('template[data-pv-frame]')[2];
        host.replaceChildren(t.content.cloneNode(true));
        host.setAttribute('aria-label', t.dataset.pvLabel ?? '');
      });
      await expectPlugsStill(page);
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
    await expectPlugsStill(page);
    await expectProblemComplete(page, plugsLabel);
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

  test('with reduced motion, pair 2 shows its last frame, still, chosen once or twice', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const scripts = scriptRequests(page);
    await page.goto(ROUTE);
    await page.waitForLoadState('networkidle');
    await tab(page, 1).click();
    await expect(tab(page, 1)).toHaveAttribute('aria-selected', 'true');
    expect(await stageShowsFinalFrame(page, 1)).toBe(true);
    await expectHeatmapStill(page);
    await expectProblemComplete(page, HEATMAP_LABEL);
    await tab(page, 1).click();
    await page.waitForTimeout(300);
    expect(await stageShowsFinalFrame(page, 1), 'chosen again: still the last frame').toBe(true);
    expect(scripts.filter((u) => DRAWING_CHUNK.test(u))).toEqual([]);
  });

  test.describe('with motion', () => {
    test('1440: the three pairs are WAI-ARIA tabs with a roving tabindex', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const list = t2(page).getByRole('tablist', { name: problem.tabsLabel });
      await expect(list).toHaveAttribute('aria-orientation', 'vertical');
      const tabs = list.getByRole('tab');
      await expect(tabs).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
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
      await expectOn(2);
      await page.keyboard.press('ArrowDown');
      await expectOn(0);
      await page.keyboard.press('ArrowUp');
      await expectOn(2);
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

      // The drawing is moving, not a still: two moments of pair 3's canvas differ.
      await tab(page, 2).click();
      const cv = sec.locator('[data-pv-story-drawing] canvas[data-pv-plugs]');
      await expect(cv).toHaveCount(1);
      const pixelsAt = () =>
        cv.evaluate((c: HTMLCanvasElement) => {
          const { data } = c.getContext('2d')!.getImageData(0, 0, c.width, c.height);
          let h = 0;
          for (let i = 0; i < data.length; i += 4) h = (h * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7) | 0;
          return h;
        });
      const a = await pixelsAt();
      await page.waitForTimeout(400);
      const b = await pixelsAt();
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

      // Nothing moves on by itself: the chosen pair stays chosen (its own timeline
      // plays on; that is the drawing, not the selector).
      await page.waitForTimeout(4000);
      await expect(tab(page, 2)).toHaveAttribute('aria-selected', 'true');
      await expect(sec.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
    });

    test('1440: pair 3 is the plugs timeline: it starts when chosen, and choosing it again starts it over', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const sec = t2(page);
      await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-tetris]')).toHaveCount(1);
      await tab(page, 2).click();
      const canvas = sec.locator('[data-pv-story-drawing] canvas[data-pv-plugs]');
      await expect(canvas).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing] canvas')).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(plugsLabel);
      /**
       * A fingerprint of the frame, and how much of it is a stopped process's
       * card: the canon's grey `--color-surface-2`, which no running card uses.
       */
      const frame = () =>
        canvas.evaluate((cv: HTMLCanvasElement) => {
          const off = getComputedStyle(cv.parentElement!).getPropertyValue('--color-surface-2').trim();
          const hex = off.startsWith('#') ? off.slice(1) : 'f3f3f3';
          const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
          const { data } = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height);
          let stopped = 0;
          let hash = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] === r && data[i + 1] === g && data[i + 2] === b) stopped++;
            hash = (hash * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7) | 0;
          }
          return { stopped: stopped / (cv.width * cv.height), hash };
        });

      // From the start: four processes running, none stopped.
      await page.waitForTimeout(150);
      const start = await frame();
      expect(start.stopped, 'nothing stopped at the start').toBeLessThan(0.002);
      // It moves: a notice lands and LEADS goes dark (stops ≈3.7 s in).
      await page.waitForTimeout(4400);
      const later = await frame();
      expect(later.hash, 'the canvas moves').not.toBe(start.hash);
      expect(later.stopped, 'a process has stopped').toBeGreaterThan(start.stopped + 0.005);

      // Chosen again while on screen: it starts over — nothing stopped again.
      await tab(page, 2).click();
      await page.waitForTimeout(150);
      expect((await frame()).stopped, 'back to all running').toBeLessThan(0.002);
      await page.waitForTimeout(4400);
      expect((await frame()).stopped, 'and it plays again').toBeGreaterThan(start.stopped + 0.005);

      // Pairs 1 and 2 untouched by it: each comes back as its own timeline.
      await tab(page, 1).click();
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-heatmap]')).toHaveCount(1);
      await expect(canvas).toHaveCount(0);
      await tab(page, 0).click();
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-tetris]')).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(tetrisLabel);
    });

    test('pair 3\'s still frame is the mock-up\'s 4:5 board: the company, the HUD, the systems and the close where the mock-up puts them', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      await tab(page, 2).click();
      const svg = page.locator('[data-pv-story-drawing] svg[data-pv-plugs-still]');
      await expect(svg).toHaveAttribute('viewBox', '0 0 400 500');
      const { FX, FY, FH, WALL1, PITCH, CARD_X, CARD_W, CARD_H, HUDY, STRIPY } = plugs.geo;
      const got = await svg.evaluate((el) => ({
        rects: [...el.querySelectorAll('rect')].map((r) => ({ x: +r.getAttribute('x')!, y: +r.getAttribute('y')!, w: +r.getAttribute('width')!, h: +r.getAttribute('height')!, stroke: (r.getAttribute('style') ?? '').includes('stroke:') })),
        texts: [...el.querySelectorAll('text')].map((t) => ({ text: t.textContent ?? '', x: +t.getAttribute('x')!, y: +t.getAttribute('y')! })),
      }));
      const text = (t: string) => got.texts.find((x) => x.text === t)!;
      // The paper covers the whole board: no band left unpainted.
      expect(got.rects[0], 'paper over the whole board').toEqual({ x: 0, y: 0, w: 400, h: 500, stroke: false });
      // The company, its wall already moved out to WALL1.
      expect(got.rects.find((r) => r.stroke && r.x === FX && r.y === FY), 'the company').toEqual({ x: FX, y: FY, w: WALL1 - FX, h: FH, stroke: true });
      expect(text('YOUR COMPANY')).toEqual({ text: 'YOUR COMPANY', x: (FX + WALL1) / 2, y: FY + FH - 11 });
      // Four process cards, one per row, PITCH apart.
      const rowC = (i: number) => FY + 18 + i * PITCH + CARD_H / 2;
      for (let i = 0; i < 4; i++) {
        expect(got.rects.some((r) => r.stroke && r.x === CARD_X && r.w === CARD_W && r.h === CARD_H && Math.abs(r.y - (rowC(i) - CARD_H / 2)) < 0.01), `card ${i + 1}`).toBe(true);
        expect(Math.abs(text(`${plugs.sys} · ${plugs.procs[i]}`).y - (rowC(i) + 0.5)), `${plugs.procs[i]}'s system on its row`).toBeLessThan(0.01);
      }
      // The HUD below the company, spanning it; the close under it, centred.
      expect(text(`${plugs.owned}  4/4`)).toMatchObject({ x: FX, y: HUDY });
      expect(text(`${plugs.live}  4/4`)).toMatchObject({ x: WALL1, y: HUDY });
      expect(text(plugs.close[0])).toMatchObject({ x: 200, y: STRIPY + 2 });
    });

    test('1440: pair 1 is the Tetris timeline, and choosing it starts it over', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const sec = t2(page);
      const canvas = sec.locator('[data-pv-story-drawing] canvas[data-pv-tetris]');
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
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-heatmap]')).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(HEATMAP_LABEL);
      await tab(page, 0).click();
      await expect(canvas).toHaveCount(1);
      await page.waitForTimeout(150);
      expect((await frame()).ink, 'from the start').toBeLessThan(piled.ink - 0.01);
    });

    test('1440: pair 2 is the heat-map timeline: it starts when chosen, and choosing it again starts it over', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const sec = t2(page);
      await sec.locator('[data-pv-stage]').scrollIntoViewIfNeeded();
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-tetris]')).toHaveCount(1);
      await tab(page, 1).click();
      const canvas = sec.locator('[data-pv-story-drawing] canvas[data-pv-heatmap]');
      await expect(canvas).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing] canvas')).toHaveCount(1);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(HEATMAP_LABEL);
      /** A fingerprint of the frame, and how much of it is the brand red (the «UNUSED» stamps, later the heat). */
      const frame = () =>
        canvas.evaluate((cv: HTMLCanvasElement) => {
          const { data } = cv.getContext('2d')!.getImageData(0, 0, cv.width, cv.height);
          let red = 0;
          let hash = 0;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 150 && data[i + 1] < 120) red++;
            hash = (hash * 31 + data[i] + data[i + 1] * 3 + data[i + 2] * 7) | 0;
          }
          return { red: red / (cv.width * cv.height), hash };
        });

      // From the start: the empty bill, nothing stamped yet.
      await page.waitForTimeout(150);
      const start = await frame();
      expect(start.red, 'nothing stamped at the start').toBe(0);
      // It moves: lines land on the bill and get stamped «UNUSED».
      await page.waitForTimeout(3000);
      const later = await frame();
      expect(later.hash, 'the canvas moves').not.toBe(start.hash);
      expect(later.red, 'the bill has been stamped').toBeGreaterThan(0.002);

      // Chosen again while on screen: it starts over — the very first frame again.
      await tab(page, 1).click();
      await page.waitForTimeout(150);
      const again = await frame();
      expect(again.red, 'back to an unstamped bill').toBe(0);
      expect(again.hash, 'the same frame it started on').toBe(start.hash);
      await page.waitForTimeout(3000);
      expect((await frame()).red, 'and it plays again').toBeGreaterThan(0.002);

      // Pair 1 untouched by it: back there, its own timeline from 0.
      await tab(page, 0).click();
      await expect(sec.locator('[data-pv-story-drawing] canvas[data-pv-tetris]')).toHaveCount(1);
      await expect(canvas).toHaveCount(0);
      await expect(sec.locator('[data-pv-story-drawing]')).toHaveAccessibleName(tetrisLabel);
    });

    test('pair 2\'s still frame is the mock-up\'s layout: names start where «THEN» starts, the grid ends where the close ends, the counters and the bar span the grid', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      await tab(page, 1).click();
      const svg = page.locator('[data-pv-story-drawing] svg[data-pv-heatmap-still]');
      await expect(svg).toHaveAttribute('viewBox', `0 0 ${heat.W} ${heat.H}`);
      const { W, DY, GY, CW, CH, fz0, maxW, step, closeY } = heat;
      const got = await svg.evaluate(async (el, { close, fz0, maxW, step }) => {
        // The mock-up's closingFit(), run on the real canvas with the canon's face.
        const css = getComputedStyle(document.documentElement);
        const disp = css.getPropertyValue('--font-display').trim();
        await document.fonts.load(`900 22px ${disp}`);
        const ctx = document.createElement('canvas').getContext('2d')!;
        let fz = fz0;
        ctx.font = `900 ${fz}px ${disp}`;
        while (fz > 12 && Math.max(ctx.measureText(close[0]).width, ctx.measureText(close[1]).width) > maxW) ctx.font = `900 ${(fz -= step)}px ${disp}`;
        const w2 = ctx.measureText(close[1]).width;
        const texts = [...el.querySelectorAll('text')].map((t) => {
          const b = (t as SVGTextElement).getBBox();
          return { text: t.textContent ?? '', x: +t.getAttribute('x')!, y: +t.getAttribute('y')!, tf: t.getAttribute('transform'), size: parseFloat((t as SVGTextElement).style.fontSize), left: b.x, right: b.x + b.width };
        });
        const rects = [...el.querySelectorAll('rect')].map((r) => ({ x: +r.getAttribute('x')!, y: +r.getAttribute('y')!, w: +r.getAttribute('width')!, h: +r.getAttribute('height')!, tf: r.getAttribute('transform'), style: r.getAttribute('style') ?? '' }));
        return { fz, w2, texts, rects };
      }, { close: heatmap.close, fz0, maxW, step });
      const text = (t: string) => got.texts.find((x) => x.text === t)!;
      // Everything but the paper is the mock-up's 400-wide composition moved DY down: its own
      // coordinates (x, y and the rendered box) are the mock-up's, the move is the transform.
      expect(got.rects[0], 'paper over the whole board').toMatchObject({ x: 0, y: 0, w: W, h: heat.H, tf: null });
      const moved = `matrix(1 0 0 1 0 ${DY})`;
      expect(got.texts.every((t) => t.tf === moved) && got.rects.slice(1).every((r) => r.tf === moved), `all of it moved ${DY} down`).toBe(true);
      const left = W / 2 - got.w2 / 2;
      const gridEnd = W / 2 + got.w2 / 2;
      const GX = gridEnd - 5 * CW;
      // The close: the size closingFit() gives on the canvas, where the mock-up puts it.
      expect(text(heatmap.close[0]).size, 'the close at the canvas\'s size').toBe(got.fz);
      expect(text(heatmap.close[1]).size).toBe(got.fz);
      expect(text(heatmap.close[0])).toMatchObject({ x: W / 2, y: GY + 4 * CH + closeY });
      expect(text(heatmap.close[1]).y).toBeCloseTo(GY + 4 * CH + closeY + got.fz * 1.15, 1);
      // As drawn: «THEN …» starts at `left` and ends at the grid's end (the rendered box, ±1 px).
      expect(Math.abs(text(heatmap.close[1]).left - left), '«THEN» starts where the server put the names').toBeLessThanOrEqual(1);
      expect(Math.abs(text(heatmap.close[1]).right - gridEnd), 'the close ends where the grid ends').toBeLessThanOrEqual(1);
      // The department names start where «THEN» starts.
      for (const name of heatmap.rows) expect(Math.abs(text(name).x - left), `${name} starts at «THEN»`).toBeLessThanOrEqual(0.5);
      // The grid: 4 × 5 cells of CW × CH (2 px of paper around each), ending where the close ends.
      const cells = got.rects.filter((r) => Math.abs(r.w - (CW - 4)) < 0.01 && Math.abs(r.h - (CH - 4)) < 0.01);
      expect(cells, 'twenty cells').toHaveLength(20);
      expect(Math.abs(Math.min(...cells.map((c) => c.x)) - 2 - GX), 'the grid starts at GX').toBeLessThanOrEqual(0.5);
      expect(Math.abs(Math.max(...cells.map((c) => c.x + c.w)) + 2 - gridEnd), 'the grid ends where the close ends').toBeLessThanOrEqual(0.5);
      expect(Math.min(...cells.map((c) => c.y)) - 2).toBeCloseTo(GY, 1);
      // The counters above and the trust bar below span the grid exactly.
      expect(Math.abs(text(`${heatmap.built}  04`).x - GX), 'SYSTEMS BUILT starts at the grid').toBeLessThanOrEqual(0.5);
      expect(Math.abs(got.texts.find((t) => t.text.startsWith(heatmap.saved))!.x - gridEnd), 'HOURS SAVED ends at the grid\'s end').toBeLessThanOrEqual(0.5);
      expect(Math.abs(text(`${heatmap.unusedL}  0`).x - GX), 'the licences start at the grid').toBeLessThanOrEqual(0.5);
      const track = got.rects.filter((r) => Math.abs(r.h - 6) < 0.01 && r.style.includes('--color-surface-3'));
      expect(track, 'one trust track').toHaveLength(1);
      expect(Math.abs(track[0].x + track[0].w - gridEnd), 'the trust bar ends at the grid\'s end').toBeLessThanOrEqual(0.5);
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
      for (let i = 0; i < problem.pairs.length; i++) {
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
      for (const i of [0, 1, 2, 0]) {
        await tab(page, i).click();
        await expect(t2(page).locator('[data-pv-story-drawing] canvas')).toHaveCount(1);
        await page.waitForTimeout(150);
        const g = await stageGeometry(page);
        expect(g.tag, `pair ${i + 1}: drawn as`).toBe('canvas');
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

        // Choosing pair 3: the text animates — caught half-way: problem not yet
        // struck, way out not yet written — then resolves.
        await tab(page, 2).click();
        const p3 = problem.pairs[2];
        const sol3 = sec.getByRole('heading', { level: 3, name: p3.solution });
        expect(await sol3.locator('.pv-rest').textContent(), 'the way out is still being written').not.toBe('');
        // The drawing changed to pair 3's last frame at once, still.
        expect(await stageShowsFinalFrame(page, 2)).toBe(true);
        await expectPlugsStill(page);
        await page.waitForTimeout(300);
        expect(await stageShowsFinalFrame(page, 2), 'no motion in the drawing').toBe(true);

        await expect(sol3.locator('.pv-done')).toHaveText(p3.solution, { timeout: 5000 });
        await expect(sec.getByText(p3.solutionText, { exact: true })).toBeVisible();
        await expect(sec.getByText(p3.problem, { exact: true }).locator('xpath=..')).toHaveClass(/is-struck/);
        await expect(sec.getByText(p1.problem, { exact: true }).locator('xpath=..')).toHaveClass(/is-struck/);

        // Pair 2: its last frame, still — chosen once or twice — while its text plays.
        await tab(page, 1).click();
        const sol2 = sec.getByRole('heading', { level: 3, name: problem.pairs[1].solution });
        expect(await sol2.locator('.pv-rest').textContent(), 'pair 2\'s way out is being written').not.toBe('');
        expect(await stageShowsFinalFrame(page, 1)).toBe(true);
        await expectHeatmapStill(page);
        await tab(page, 1).click();
        await page.waitForTimeout(300);
        expect(await stageShowsFinalFrame(page, 1), 'no motion in pair 2\'s drawing').toBe(true);
        await expect(sol2.locator('.pv-done')).toHaveText(problem.pairs[1].solution, { timeout: 5000 });

        expect(scripts.some((u) => TEXT_CHUNK.test(u)), 'text motion downloaded').toBe(true);
        expect(scripts.filter((u) => DRAWING_CHUNK.test(u)), 'drawing motion NOT downloaded').toEqual([]);
      });
    }
  });

  test('the grill of 2026-10-06 reached the page, and the words it replaced are gone', async ({ request }) => {
    expect(t3.cards, 'the T3 sketch reader is not blind').toHaveLength(7);
    expect(t3.cards.map((c) => c.row)).toEqual([0, 1, 1, 2, 2, 3, 3]);
    for (const c of t3.cards) expect(c.text.length, c.title).toBeGreaterThan(60);
    expect(t3.speed).toEqual([0.05, 0.25, 0.12, 0.3]);
    const served = decode((await (await request.get(ROUTE)).text()).replace(/&#39;/g, "'"));
    for (const w of [
      oldHookSub,
      'Everyone talks about AI.',
      'Nobody tells you where to start.',
      'Everyone is selling one',
      "data in places it shouldn't be",
      'Most companies run on a dozen tools they rent.',
      'When we leave the room, everything keeps running.',
      'find what actually needs solving',
      'Start from your actual needs',
      'the rows complete and clear',
      'Trello',
      'Jira',
    ]) {
      expect(served, `«${w}» is gone`).not.toContain(w);
    }
    // No webfont from Google: every family comes from the design-tokens package.
    expect(served).not.toContain('fonts.googleapis.com');
  });

  test('pair 1: «the one» in Inter\'s own italic, «actually» in bold', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(ROUTE);
    const p = t2(page).locator('.pv-prob-p').first();
    await expect(p).toHaveText(GRILL.texts[0].problemText);
    const em = p.locator('em');
    await expect(em).toHaveText(GRILL.texts[0].em!);
    await expect(p.locator('strong')).toHaveText(GRILL.texts[0].strong!);
    await expect(em).toHaveCSS('font-style', 'italic');
    // A real italic face, not the browser slanting the upright one.
    const real = await page.evaluate(async () => {
      await document.fonts.ready;
      await document.fonts.load('italic 400 15px Inter');
      return [...document.fonts].some((f) => f.family.replace(/['"]/g, '') === 'Inter' && f.style === 'italic' && f.weight === '400' && f.status === 'loaded');
    });
    expect(real, 'Inter Italic 400 is served and loaded').toBe(true);
  });

  /** T3's cards, as the page shows them: row, «Ours · …», title, paragraph. */
  const builtSection = (page: import('@playwright/test').Page) => page.locator('main#main-content section#built');
  async function expectBuiltComplete(page: import('@playwright/test').Page) {
    const sec = builtSection(page);
    await expect(sec.getByText(t3.eyebrow, { exact: true })).toBeVisible();
    await expect(sec.getByRole('heading', { level: 2, name: t3.title })).toBeVisible();
    await expect(sec.locator('h2 em')).toHaveText(t3.titleEm);
    await expect(sec.getByText(t3.lede, { exact: true })).toBeVisible();
    const cards = sec.locator('[data-pv-row]');
    await expect(cards).toHaveCount(t3.cards.length);
    for (const [i, c] of t3.cards.entries()) {
      const card = cards.nth(i);
      await expect(card).toHaveAttribute('data-pv-row', String(c.row));
      await expect(card.getByRole('heading', { level: 3, name: c.title, exact: true })).toBeVisible();
      await expect(card.getByText(c.text, { exact: true })).toBeVisible();
      if (c.ours) await expect(card.locator('.pv-ours')).toHaveText(c.ours);
      else await expect(card.locator('.pv-ours')).toHaveCount(0);
      await expect(card.getByText(t3.more)).toBeVisible();
    }
    // «See how it works» is not a link yet.
    await expect(sec.getByRole('link')).toHaveCount(0);
  }

  test.describe('T3 with JavaScript off', () => {
    test.use({ javaScriptEnabled: false });
    test('T3 is complete and visible, word for word from the sketch', async ({ page }) => {
      await page.goto(ROUTE);
      await expectBuiltComplete(page);
      await expect(builtSection(page).locator('.pv-depth-word')).toContainText(t3.depthWord.trim());
    });
  });

  for (const [w, h] of [[1440, 900], [375, 812]] as const) {
    test(`${w}: with reduced motion, T3 stays whole and still, its rows of pairs the same height, and nothing scrolls sideways`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(ROUTE);
      await expectBuiltComplete(page);
      await builtSection(page).scrollIntoViewIfNeeded();
      await page.mouse.move(w / 2, h / 2);
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const els = [...document.querySelectorAll<HTMLElement>('#built [data-pv-row], #built [data-pv-tilt], #built .pv-depth-word')];
        const rows = new Map<string, number[]>();
        document.querySelectorAll<HTMLElement>('#built [data-pv-row]').forEach((c) => {
          const r = c.dataset.pvRow!;
          rows.set(r, [...(rows.get(r) ?? []), c.getBoundingClientRect().height]);
        });
        return {
          moved: els.filter((e) => getComputedStyle(e).transform !== 'none').length,
          heights: [...rows.entries()].filter(([r]) => r !== '0').map(([, hs]) => hs),
          sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(m.moved, 'nothing of T3 is moved').toBe(0);
      expect(m.sideways, 'no horizontal scroll').toBeLessThanOrEqual(0);
      if (w === 1440) {
        const all = m.heights.flat();
        expect(Math.max(...all) - Math.min(...all), `row heights ${all.join(', ')}`).toBeLessThanOrEqual(1);
      }
    });
  }

  test('1440: with motion, each pair of T3 moves with the scroll at its row\'s speed, together', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    await page.waitForFunction(() => !document.documentElement.classList.contains('pv-fx-wait'));
    const ys = async () =>
      page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('#built [data-pv-row]')].map((c) => ({
          row: +c.dataset.pvRow!,
          y: new DOMMatrixReadOnly(getComputedStyle(c).transform).m42,
        })),
      );
    await page.evaluate(() => window.scrollTo(0, document.querySelector<HTMLElement>('#built')!.offsetTop - 300));
    await page.waitForTimeout(600);
    const a = await ys();
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(600);
    const b = await ys();
    const delta = (row: number) => {
      const d = a.filter((c) => c.row === row).map((c, i) => c.y - b.filter((x) => x.row === row)[i].y);
      expect(Math.max(...d) - Math.min(...d), `row ${row} moves together`).toBeLessThanOrEqual(0.5);
      return d[0];
    };
    const d = [0, 1, 2, 3].map(delta);
    for (const v of d) expect(v, 'scrolling down moves the cards up').toBeGreaterThan(0);
    // Faster rows travel further, in the sketch's order of speeds.
    expect(d[1]).toBeGreaterThan(d[2]);
    expect(d[3]).toBeGreaterThan(d[1]);
    expect(d[2]).toBeGreaterThan(d[0]);
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
