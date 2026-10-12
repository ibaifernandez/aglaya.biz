/**
 * T4 · the Orchestrator's drawing — «a task goes round the team». PROVISIONAL,
 * like the T2 drawings, to be replaced by video behind the same exports.
 *
 * Ported from the sketch `docs/design/portada-nueva/t4-flow.html` (card
 * 8d7af9ae; it replaces the mock-up's 3D ball): one deterministic `draw(T)` that
 * paints any instant of a ≈36 s loop on a 500 × 500 logical board.
 *   Five stations on a pentagon — SPEC, BUILD, REVIEW, AUDIT («AGENT») and CHECK
 *   («PERSON», green). A task card goes round, writing down each step. The
 *   second task fails its REVIEW («FIX IT») and goes back to BUILD. After CHECK
 *   the card flies into the live map in the middle and lights it.
 *
 * One change from the sketch (Ibai): the card no longer brushes the live map.
 * Beside each station it stands as far in as the sketch put it (0.42 of the way
 * to the centre) or less, whatever keeps MAP_GAP between it and the map.
 *
 * Same two backends as the T2 drawings (./story-svg-recorder.ts): in the browser
 * a <canvas> (`createOrchestrator`), on a wide screen with motion allowed; on the
 * server the SVG recorder (`orchestratorFinalMarkup`), the still frame for the
 * ground floor, reduced motion and phones — the third task checked and the
 * whole map lit.
 *
 * The section is night (black): the canon has no night tokens in light mode, so
 * paper is `--color-text` and ink `--color-bg`, the same pair the other way
 * round; the faint inks are those blended into the paper (`a(f)`), and the card
 * keeps the light pair. No brand value is written here.
 */

import { SvgCtx, type Ctx } from './story-svg-recorder';

export type Lang = 'en' | 'es';

/* ---------- The words (sketch, and the delineante's Spanish on card 8d7af9ae) ---------- */

const EN = {
  stations: ['SPEC', 'BUILD', 'REVIEW', 'AUDIT', 'CHECK'],
  agent: 'AGENT',
  person: 'PERSON',
  log: ['spec written', 'built + tested', 'reviewed: ok', 'audited', 'checked by a person'],
  fixLog: 'reviewed: fix it',
  fixIt: 'FIX IT',
  map: 'LIVE MAP',
  task: 'TASK #',
  done: 'TASKS DONE',
  back: 'SENT BACK',
};
const WORDS: Record<Lang, typeof EN> = {
  en: EN,
  es: {
    stations: ['ENCARGO', 'CONSTRUYE', 'REVISA', 'AUDITA', 'COMPRUEBA'],
    agent: 'AGENTE',
    person: 'PERSONA',
    log: ['encargo escrito', 'construida y probada', 'revisada: ok', 'auditada', 'comprobada por una persona'],
    fixLog: 'revisada: a corregir',
    fixIt: 'A CORREGIR',
    map: 'MAPA VIVO',
    task: 'TAREA #',
    done: 'TAREAS HECHAS',
    back: 'DEVUELTAS',
  },
};

/* ---------- The board and the script (sketch) ---------- */

/** The logical board: square, like the stage. */
export const W = 500;
export const H = 500;
const CX = 250;
const CY = 262;
const R = 182;
const ST = WORDS.en.stations.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), person: i === 4 };
});
const STATION_W = 100;
const STATION_H = 42;
const CARD_W = 104;
const CARD_H = 64;
/** The live map: 3 × 3 cells of MS with 5 between, 6 below the centre, its label 44 above it. */
const MS = 22;
const MAP = { left: CX - 1.5 * MS - 5, right: CX + 1.5 * MS + 5, top: CY - 44 - 5, bottom: CY + 6 + 1.5 * MS + 5 };
/** The least room between the card and the map (Ibai: the card must not touch it). */
export const MAP_GAP = 16;

const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);

/** The room between two boxes (0 if they overlap). */
const gap = (a: { left: number; right: number; top: number; bottom: number }, b: typeof a) =>
  Math.max(0, Math.max(a.left - b.right, b.left - a.right), Math.max(a.top - b.bottom, b.top - a.bottom));
const cardBox = (p: { x: number; y: number }) => ({ left: p.x - CARD_W / 2, right: p.x + CARD_W / 2, top: p.y - CARD_H / 2, bottom: p.y + CARD_H / 2 });

/** Where the card stands beside station i: toward the centre, as far as the sketch (0.42) or as MAP_GAP allows. */
const CARD_AT = ST.map((s) => {
  let f = 0.42;
  const at = (k: number) => ({ x: lerp(s.x, CX, k), y: lerp(s.y, CY, k) });
  while (f > 0 && gap(cardBox(at(f)), MAP) < MAP_GAP) f -= 0.005;
  return at(f);
});
/** The card's box beside each station, and the map's — for the test that the card never touches the map. */
export const geometry = () => ({ map: MAP, cards: CARD_AT.map(cardBox) });

const MOVE = 0.8;
const DWELL = 1.0;
const TASKS = [
  { n: 12, fail: false },
  { n: 13, fail: true },
  { n: 14, fail: false },
];
type Step =
  | { ti: number; type: 'move'; from: number | null; to: number; t0: number; t1: number }
  | { ti: number; type: 'dwell'; at: number; t0: number; t1: number }
  | { ti: number; type: 'fix'; t0: number; t1: number }
  | { ti: number; type: 'ship'; t0: number; t1: number };
const steps: Step[] = [];
let t = 0;
TASKS.forEach((task, ti) => {
  const seq: (number | 'fix')[] = task.fail ? [0, 1, 2, 'fix', 1, 2, 3, 4] : [0, 1, 2, 3, 4];
  let prev: number | null = null;
  for (const s of seq) {
    if (s === 'fix') {
      steps.push({ ti, type: 'fix', t0: t, t1: t + DWELL });
      t += DWELL;
      continue;
    }
    steps.push({ ti, type: 'move', from: prev, to: s, t0: t, t1: t + MOVE });
    t += MOVE;
    steps.push({ ti, type: 'dwell', at: s, t0: t, t1: t + DWELL });
    t += DWELL;
    prev = s;
  }
  steps.push({ ti, type: 'ship', t0: t, t1: t + 0.9 });
  t += 1.1;
});
/** Seconds of one loop (≈36). */
export const ORCHESTRATOR_PERIOD = t + 0.8;
/** The still frame: just before the loop starts over — three tasks checked, the whole map lit. */
export const ORCHESTRATOR_STILL = ORCHESTRATOR_PERIOD - 0.81;

interface State {
  card: { x: number; y: number; scale?: number; fade?: number } | null;
  active: number;
  log: string[];
  done: number;
  back: number;
  fix: boolean;
  ti: number;
  ship: number;
}

function stateAt(T: number, TX: typeof EN): State {
  const r: State = { card: null, active: -1, log: [], done: 0, back: 0, fix: false, ti: -1, ship: 0 };
  let cur = -1;
  let log: string[] = [];
  for (const s of steps) {
    if (s.ti !== cur) {
      cur = s.ti;
      log = [];
    }
    if (T < s.t0) break;
    const f = cl((T - s.t0) / (s.t1 - s.t0));
    r.ti = s.ti;
    if (s.type === 'move') {
      const A = s.from === null ? { x: CX, y: -50 } : CARD_AT[s.from];
      const B = CARD_AT[s.to];
      const e = ease(f);
      r.card = { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e) };
      r.active = -1;
      r.fix = false;
    } else if (s.type === 'dwell') {
      r.card = CARD_AT[s.at];
      r.active = s.at;
      if (f >= 0.5 && log[log.length - 1] !== TX.log[s.at]) log.push(TX.log[s.at]);
    } else if (s.type === 'fix') {
      r.card = CARD_AT[2];
      r.active = 2;
      r.fix = true;
      log[log.length - 1] = TX.fixLog;
    } else {
      const e2 = ease(f);
      const P = CARD_AT[4];
      r.card = { x: lerp(P.x, CX, e2), y: lerp(P.y, CY, e2), scale: 1 - 0.7 * e2, fade: 1 - cl((f - 0.6) / 0.4) };
      r.active = -1;
      r.ship = f;
    }
    r.log = log.slice();
  }
  for (const s of steps) {
    if (s.type === 'ship' && T >= s.t1) r.done++;
    if (s.type === 'fix' && T >= s.t0 + 0.4) r.back++;
  }
  return r;
}

/* ---------- Drawing ---------- */

/** Token roles; `a(f)` is the night's ink at strength f over its paper. */
export interface Palette {
  paper: string; // --color-text (the night's black)
  ink: string; // --color-bg (the night's white)
  red: string; // --color-brand
  green: string; // --color-corporate-green
  card: string; // --color-bg
  cardInk: string; // --color-text
  cardMuted: string; // --color-muted
  mono: string; // --font-mono
  disp: string; // --font-display
  a(f: number): string;
}
type Role = Exclude<keyof Palette, 'a'>;
const ROLES: Record<Role, string> = {
  paper: '--color-text',
  ink: '--color-bg',
  red: '--color-brand',
  green: '--color-corporate-green',
  card: '--color-bg',
  cardInk: '--color-text',
  cardMuted: '--color-muted',
  mono: '--font-mono',
  disp: '--font-display',
};

/** Paint instant `T` (seconds, wrapped to one loop) on the 500 × 500 board in `ctx`'s current transform. */
export function drawOrchestrator(ctx: Ctx, T: number, P: Palette, lang: Lang = 'en') {
  const TX = WORDS[lang];
  T = ((T % ORCHESTRATOR_PERIOD) + ORCHESTRATOR_PERIOD) % ORCHESTRATOR_PERIOD;
  const st = stateAt(T, TX);
  const font = (w: number, size: number, fam: string) => `${w} ${size}px ${fam}`;

  ctx.globalAlpha = 1;
  ctx.fillStyle = P.paper;
  ctx.fillRect(0, 0, W, H);

  // the round
  ctx.strokeStyle = P.a(0.14);
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ST.forEach((s, i) => (i ? ctx.lineTo(s.x, s.y) : ctx.moveTo(s.x, s.y)));
  ctx.lineTo(ST[0].x, ST[0].y);
  ctx.stroke();
  ctx.setLineDash([]);

  // the live map
  ctx.font = font(700, 7, P.mono);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = P.a(0.55);
  ctx.fillText(TX.map, CX, CY - 44);
  for (let g = 0; g < 9; g++) {
    const gx = CX + ((g % 3) - 1) * (MS + 5);
    const gy = CY + (Math.floor(g / 3) - 1) * (MS + 5) + 6;
    const hot = st.ship > 0.7 && g >= st.done * 3 && g < st.done * 3 + 3;
    ctx.fillStyle = hot ? P.red : g < st.done * 3 ? P.a(0.85) : P.a(0.08);
    ctx.fillRect(gx - MS / 2, gy - MS / 2, MS, MS);
  }

  // the stations
  ST.forEach((s, i) => {
    const on = st.active === i;
    const fx = on && st.fix;
    ctx.fillStyle = on && !fx ? P.red : P.paper;
    ctx.fillRect(s.x - STATION_W / 2, s.y - STATION_H / 2, STATION_W, STATION_H);
    ctx.strokeStyle = on ? P.red : P.a(0.5);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(s.x - STATION_W / 2, s.y - STATION_H / 2, STATION_W, STATION_H);
    // The station's name: 14px, smaller if a longer (Spanish) word would not fit the box.
    const name = fx ? TX.fixIt : TX.stations[i];
    let size = 14;
    ctx.font = font(900, size, P.disp);
    while (size > 9 && ctx.measureText(name).width > STATION_W - 12) ctx.font = font(900, (size -= 0.5), P.disp);
    ctx.fillStyle = fx ? P.red : P.ink;
    ctx.fillText(name, s.x, s.y - 5);
    ctx.font = font(700, 7, P.mono);
    ctx.fillStyle = on && !fx ? P.ink : s.person ? P.green : P.a(0.55);
    ctx.fillText(s.person ? TX.person : TX.agent, s.x, s.y + 11);
  });

  // the card
  if (st.card) {
    const c = st.card;
    const sc = c.scale ?? 1;
    const fa = c.fade ?? 1;
    ctx.save();
    ctx.globalAlpha = fa;
    ctx.translate(c.x, c.y);
    ctx.scale(sc, sc);
    ctx.fillStyle = P.card;
    ctx.fillRect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H);
    ctx.fillStyle = P.red;
    ctx.fillRect(-CARD_W / 2, -CARD_H / 2, 3, CARD_H);
    ctx.fillStyle = P.cardInk;
    ctx.textAlign = 'left';
    ctx.font = font(700, 7.5, P.mono);
    ctx.fillText(`${TX.task}${TASKS[st.ti].n}`, -CARD_W / 2 + 8, -CARD_H / 2 + 10);
    st.log.slice(-4).forEach((l, k) => {
      // A line at 6.5px, smaller if a longer (Spanish) one would leave the card.
      let size = 6.5;
      ctx.font = font(400, size, P.mono);
      while (size > 4.5 && ctx.measureText(`✓ ${l}`).width > CARD_W - 14) ctx.font = font(400, (size -= 0.25), P.mono);
      ctx.fillStyle = l === TX.fixLog ? P.red : P.cardMuted;
      ctx.fillText(`✓ ${l}`, -CARD_W / 2 + 8, -CARD_H / 2 + 23 + k * 10);
    });
    ctx.restore();
    ctx.textAlign = 'center';
  }

  // the counters
  ctx.font = font(700, 8, P.mono);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = P.a(0.6);
  ctx.fillText(`${TX.done}  ${`0${st.done}`.slice(-2)}`, 20, 22);
  ctx.textAlign = 'right';
  ctx.fillStyle = st.back ? P.red : P.a(0.6);
  ctx.fillText(`${TX.back}  ${`0${st.back}`.slice(-2)}`, 480, 22);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

/* ---------- Server side: the still frame, through ./story-svg-recorder.ts ---------- */

const pct = (f: number) => Math.round(f * 10000) / 100;
const SERVER_PALETTE: Palette = {
  ...(Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, `var(${v})`])) as Record<Role, string>),
  a: (f) => `color-mix(in srgb, var(${ROLES.ink}) ${pct(f)}%, var(${ROLES.paper}))`,
};

/** The still frame as SVG — the third task checked, the whole map lit. */
export function orchestratorFinalMarkup(lang: Lang = 'en'): string {
  const ctx = new SvgCtx({ idPrefix: 'pv-orch-clip' });
  drawOrchestrator(ctx, ORCHESTRATOR_STILL, SERVER_PALETTE, lang);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" width="100%" height="100%" data-pv-orch-still>${ctx}</svg>`;
}

/* ---------- Browser side: the <canvas>, looping while it is on screen ---------- */

/** «#rgb», «#rrggbb» or «rgb(a)(…)» → [r, g, b]; a canvas cannot mix two token strings itself. */
function rgbOf(c: string): [number, number, number] {
  const s = c.trim();
  if (s.startsWith('#')) {
    const h = s.length === 4 ? [...s.slice(1)].map((x) => x + x).join('') : s.slice(1, 7);
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
  }
  const m = s.match(/[\d.]+/g) ?? ['0', '0', '0'];
  return [+m[0], +m[1], +m[2]];
}

export interface Orchestrator {
  /** Paint instant `T` (seconds) still. */
  paint(T: number): void;
  /** Loop, from 0 the first time; `stop()` holds the frame it is on and `play()` goes on from it. */
  play(): void;
  stop(): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createOrchestrator(host: HTMLElement): Orchestrator {
  const held = [...host.childNodes];
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.dataset.pvOrch = '';
  host.replaceChildren(cv);
  const ctx = cv.getContext('2d')!;
  const lang: Lang = host.closest('[lang]')?.getAttribute('lang') === 'es' ? 'es' : 'en';
  cv.dataset.pvLang = lang;
  const css = getComputedStyle(host);
  const tok = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, css.getPropertyValue(v).trim()])) as Record<Role, string>;
  const ink = rgbOf(tok.ink);
  const paper = rgbOf(tok.paper);
  const P: Palette = { ...tok, a: (f) => `rgb(${ink.map((v, i) => Math.round(lerp(paper[i], v, f))).join(',')})` };

  let T = ORCHESTRATOR_STILL;
  let raf = 0;
  let scale = 1;
  let t0 = 0;
  let started = false;
  const render = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawOrchestrator(ctx, T, P, lang);
  };
  const size = () => {
    const w = cv.clientWidth || host.clientWidth || W;
    const px = Math.round(w * (window.devicePixelRatio || 1));
    if (px !== cv.width) {
      cv.width = px;
      cv.height = Math.round((px * H) / W);
    }
    scale = px / W;
  };
  size();
  const ro = new ResizeObserver(() => {
    size();
    render();
  });
  ro.observe(host);
  document.fonts
    ?.load(`700 10px ${P.mono}`)
    .then(() => document.fonts.load(`900 10px ${P.disp}`))
    .then(render, () => {});
  render();

  return {
    paint(t) {
      cancelAnimationFrame(raf);
      raf = 0;
      T = t;
      render();
    },
    play() {
      if (raf) return;
      // The first time from the start of the loop; after a stop, from where it stood.
      if (!started) T = 0;
      started = true;
      t0 = performance.now() - (T % ORCHESTRATOR_PERIOD) * 1000;
      const loop = (now: number) => {
        T = ((now - t0) / 1000) % ORCHESTRATOR_PERIOD;
        render();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      host.replaceChildren(...held);
    },
  };
}
