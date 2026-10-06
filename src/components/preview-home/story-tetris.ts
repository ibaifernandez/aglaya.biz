/**
 * T2 · pair 1's drawing — «AGLAYA fixes your Tetris». PROVISIONAL, to be
 * replaced by video, like ./story-heatmap.ts (pair 2) and ./story-plugs.ts (pair 3).
 *
 * Ported from the reference mock-up `docs/design/portada-nueva/t2-anim1-tetris.html`
 * (English and Spanish, `TX.en` / `TX.es`): one deterministic `draw(T)` that paints any instant of a
 * ≈24 s timeline on a 400 × 500 logical board (4:5, the stage).
 *   1 off-the-shelf tools fall faster and faster onto a flat company until it
 *     overflows · 2 fade · 3 «SO MANY TOOLS. / WHAT DID THEY SOLVE?» · 4 fade ·
 *   5 the company shows its real shape, four irregular gaps named after a need ·
 *   6 one made-to-measure piece per gap falls in red and fits, then turns ink
 *     and its outline melts · 7 «THE RIGHT SYSTEMS, / MADE FOR YOU.» + the line
 *     under it.
 *
 * `draw` only talks to a small subset of the Canvas 2D API (`Ctx`, in
 * ./story-svg-recorder.ts, shared with pair 2's ./story-heatmap.ts), so the
 * same code paints two surfaces:
 *   - in the browser, a real <canvas> (`createTetris`), on a wide screen with
 *     motion allowed — the only place it moves;
 *   - on the server, the recorder that writes SVG (`tetrisFinalMarkup`): the last
 *     frame, still, for the ground floor (no JavaScript), reduced motion and
 *     phones. One drawing, two backends; the still frame cannot drift from the
 *     animation's end.
 *
 * Swapping it for video means rewriting this file behind the same exports —
 * `tetrisFinalMarkup()` a poster frame, `createTetris(host)` a <video> whose
 * `paint(T)` seeks and whose `play()` plays from 0 — and touching nothing else.
 *
 * Colours and type are the canon's tokens: on the server written as
 * `var(--color-*)`, in the browser read off the host's computed style (a
 * canvas cannot take a `var()`). No brand value is written here.
 */

import { SvgCtx, type Ctx } from './story-svg-recorder';

export type { Ctx };

/** The pair (0-based) this drawing belongs to. */
export const TETRIS_PAIR = 0;

/* ---------- The words (mock-up `TX.en` / `TX.es`) ---------- */

export type Lang = 'en' | 'es';

const WORDS = {
  en: {
    bought: 'TOOLS BOUGHT',
    built: 'SYSTEMS BUILT',
    met: 'NEEDS MET',
    m1: 'SO MANY TOOLS.',
    m2a: 'WHAT DID THEY ',
    m2b: 'SOLVE?',
    needs: ['SALES', 'REPORTING', 'SUPPORT', 'HIRING'],
    builtFor: 'BUILT FOR',
    company: 'YOUR COMPANY',
    h1: 'THE RIGHT SYSTEMS,',
    h2: 'MADE FOR YOU.',
    s1: 'Start from your real needs and',
    s2: 'let your company grow solid.',
    red: '',
  },
  es: {
    bought: 'HERRAMIENTAS COMPRADAS',
    built: 'SISTEMAS CONSTRUIDOS',
    met: 'NECESIDADES CUBIERTAS',
    m1: 'TANTÍSIMAS HERRAMIENTAS, PERO…',
    m2a: '¿VERDADERAMENTE',
    m2b: 'CADA UNA RESUELVE UN PROBLEMA?',
    needs: ['VENTAS', 'INFORMES', 'SOPORTE', 'RRHH'],
    builtFor: 'HECHO PARA',
    company: 'TU EMPRESA',
    h1: 'LOS SISTEMAS ADECUADOS,',
    h2: 'HECHOS PARA TI.',
    s1: 'Empieza por tus necesidades reales',
    s2: 'y deja que tu empresa crezca sólida.',
    /** The word of `m2b` drawn in red (the Spanish question takes three lines). */
    red: 'RESUELVE',
  },
};
/** The words of the language being drawn — set by `useLang()` at the top of every draw. */
let LANG: Lang = 'en';
let TX = WORDS.en;

/* ---------- The board and the script (mock-up, unchanged) ---------- */

const COLS = 13;
const ROWS = 14;
const C = 26;
const OX = 31;
const OY = 78;
/** The logical board: 4:5, like the stage it fills. */
const W = 400;
const H = 500;

type Cell = [number, number];
const SH: Record<string, Cell[]> = {
  I: [[0, 0], [1, 0], [2, 0], [3, 0]],
  Iv: [[0, 0], [0, 1], [0, 2], [0, 3]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1]],
  Tu: [[1, 0], [0, 1], [1, 1], [2, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
  Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
  L: [[0, 0], [0, 1], [0, 2], [1, 2]],
  J: [[1, 0], [1, 1], [1, 2], [0, 2]],
};
const KEYS = Object.keys(SH);
const NAMES = ['CHATGPT', 'COPILOT', 'ZAPIER', 'GEMINI', 'N8N', 'JASPER', 'CLAUDE', 'MAKE', 'NOTION AI', 'PERPLEXITY', 'HUBSPOT AI', 'MIDJOURNEY', 'CHATBOT', 'AGENT', 'LOVABLE', 'CURSOR', 'FIREFLIES', 'SYNTHESIA', 'GAMMA', 'RUNWAY', 'CANVA AI', 'OTTER', 'TYPEFORM AI', 'AIRTABLE AI', 'MANUS', 'GRAMMARLY', 'DEEPL', 'HEYGEN', 'ELEVENLABS', 'SORA'];

/** The company's real profile (rows 9–11): depth of each gap per column, 0 = a wall. No standard tetromino fills them. */
const DEPTH = [2, 3, 1, 0, 3, 3, 0, 1, 3, 2, 0, 2, 3];
const gapCells = (c0: number, c1: number) => {
  const out: Cell[] = [];
  for (let c = c0; c <= c1; c++) for (let r = 0; r < DEPTH[c]; r++) out.push([c, 9 + r]);
  return out;
};
/** The four gaps; their names are `TX.needs[i]`. */
const NEEDS = [gapCells(0, 2), gapCells(4, 5), gapCells(7, 9), gapCells(11, 12)].map((cells, i) => ({
  get short() { return TX.needs[i]; },
  cells,
}));

interface Drop {
  cells: Cell[];
  x: number;
  y: number;
  t0: number;
  dur: number;
  name: string;
}

/* BEFORE: a deterministic simulation of the falls — same pile on every load. */
const before: Drop[] = [];
let tEnd = 0.6;
{
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const grid: (string | null)[][] = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill(null));
  for (let c = 0; c < COLS; c++) grid[12][c] = grid[13][c] = 'base';
  const fits = (cells: Cell[], x: number, y: number) =>
    cells.every(([dx, dy]) => {
      const cx = x + dx;
      const cy = y + dy;
      return cx >= 0 && cx < COLS && cy < ROWS && !(cy >= 0 && grid[cy][cx]);
    });
  let dur = 0.62;
  for (let i = 0; i < 30; i++) {
    let k = KEYS[Math.floor(rnd() * KEYS.length)];
    if (NAMES[i % NAMES.length] === 'PERPLEXITY') k = 'Iv'; // the last to fall: an upright bar, its name readable
    const cells = SH[k];
    const w = Math.max(...cells.map((p) => p[0])) + 1;
    const x = Math.floor(rnd() * (COLS - w + 1));
    let y = -4;
    while (fits(cells, x, y + 1)) y++;
    if (!fits(cells, x, y)) break;
    const top = Math.min(...cells.map((p) => y + p[1]));
    for (const [dx, dy] of cells) if (y + dy >= 0) grid[y + dy][x + dx] = 'tool';
    before.push({ cells, x, y, t0: tEnd, dur, name: NAMES[i % NAMES.length] });
    tEnd += dur + 0.06;
    dur = Math.max(0.2, dur * 0.86);
    if (top <= 2) break;
  }
}

/* The script (Ibai): 1 fall · 2 fade · 3 message (≥ 1 s per 3 words) · 4 fade · 5 gaps · 6 fit · 7 close. */
const T_OVER = tEnd + 0.5;
const FADE = 0.8;
const T_MSG = T_OVER + FADE + 0.2;
const MSG_FADE = 0.6;
const FIT_DUR = 0.9;
const FIT_GAP = 0.35;
/** The message is held longer in Spanish, which has more words (mock-up: 1.4 / 2.8 s against 1.2 / 2.0). */
const script = (l1Hold: number, l2Hold: number) => {
  const T_MSG2 = T_MSG + l1Hold;
  const T_MSGOUT = T_MSG2 + l2Hold;
  const T_GHOST = T_MSGOUT + MSG_FADE + 0.3;
  const T_FIT = T_GHOST + 1.0;
  const T_ROWS = T_FIT + NEEDS.length * (FIT_DUR + FIT_GAP) + 0.2;
  const T_HEAD = T_ROWS + 0.6;
  const T_SUB = T_HEAD + 2.0;
  return { T_MSG2, T_MSGOUT, T_GHOST, T_FIT, T_ROWS, T_HEAD, T_SUB, END: T_SUB + 4.0 };
};
const SCRIPTS = { en: script(1.2, 2.0), es: script(1.4, 2.8) };
let { T_MSG2, T_MSGOUT, T_GHOST, T_FIT, T_ROWS, T_HEAD, T_SUB } = SCRIPTS.en;

/** Draw in `lang` from now on: its words and its timings. */
function useLang(lang: Lang) {
  LANG = lang;
  TX = WORDS[lang];
  ({ T_MSG2, T_MSGOUT, T_GHOST, T_FIT, T_ROWS, T_HEAD, T_SUB } = SCRIPTS[lang]);
}

/** Seconds from the first fall to the still last frame (≈ 24 in English). */
export const tetrisEnd = (lang: Lang = 'en') => SCRIPTS[lang].END;
export const TETRIS_END = tetrisEnd('en');

/* ---------- Drawing ---------- */

/** Token roles, as each backend spells them. */
export interface Palette {
  paper: string; // --color-bg
  ink: string; // --color-text
  red: string; // --color-brand
  redInk: string; // --color-brand-dark
  tool: string; // --color-surface-3
  well: string; // --color-border
  faint: string; // --color-faint
  muted: string; // --color-muted
  mono: string; // --font-mono
  disp: string; // --font-display
  body: string; // --font-body
}

const ROLES: Record<keyof Palette, string> = {
  paper: '--color-bg',
  ink: '--color-text',
  red: '--color-brand',
  redInk: '--color-brand-dark',
  tool: '--color-surface-3',
  well: '--color-border',
  faint: '--color-faint',
  muted: '--color-muted',
  mono: '--font-mono',
  disp: '--font-display',
  body: '--font-body',
};

const easeIn = (v: number) => v * v;
const easeOut = (v: number) => 1 - (1 - v) * (1 - v);
const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

/** Paint instant `T` (seconds, clamped to 0..TETRIS_END) on a W × H (400 × 500) board in `ctx`'s current transform. */
export function drawTetris(ctx: Ctx, T: number, P: Palette, lang: Lang = 'en') {
  useLang(lang);
  T = Math.max(0, Math.min(T, SCRIPTS[lang].END));
  const font = (w: number, size: number, fam: string) => `${w} ${size}px ${fam}`;
  const textW = (txt: string, size: number) => {
    ctx.font = font(700, size, P.mono);
    return ctx.measureText(txt).width + 8;
  };

  /** Straight runs of a piece, in cells: [{a, b, k}]. */
  const runs = (cells: Cell[], horiz: boolean) => {
    const by: Record<number, number[]> = {};
    for (const p of cells) (by[horiz ? p[1] : p[0]] ??= []).push(horiz ? p[0] : p[1]);
    const out: { a: number; b: number; k: number }[] = [];
    for (const key of Object.keys(by)) {
      const v = by[+key].sort((a, b) => a - b);
      let a = v[0];
      let prev = v[0];
      for (let i = 1; i <= v.length; i++) {
        if (i < v.length && v[i] === prev + 1) {
          prev = v[i];
          continue;
        }
        out.push({ a, b: prev + 1, k: +key });
        if (i < v.length) a = prev = v[i];
      }
    }
    return out;
  };
  /** Label: inside the piece's longest straight run, with margin; upright if it does not fit lying down. */
  const placeLabel = (cells: Cell[], txt: string) => {
    const mx = cells.reduce((s, p) => s + p[0], 0) / cells.length + 0.5;
    const my = cells.reduce((s, p) => s + p[1], 0) / cells.length + 0.5;
    const sizes = [7.5, 6.8, 6.2];
    const pick = (horiz: boolean) => {
      const rs = runs(cells, horiz).sort((A, B) => {
        const la = A.b - A.a;
        const lb = B.b - B.a;
        if (lb !== la) return lb - la;
        const ca = horiz ? Math.abs(A.k + 0.5 - my) : Math.abs(A.k + 0.5 - mx);
        const cb = horiz ? Math.abs(B.k + 0.5 - my) : Math.abs(B.k + 0.5 - mx);
        return ca - cb;
      });
      for (const size of sizes)
        for (const r of rs)
          if (textW(txt, size) + 6 <= (r.b - r.a) * C)
            return horiz
              ? { cx: (r.a + r.b) / 2, cy: r.k + 0.5, size, rot: false }
              : { cx: r.k + 0.5, cy: (r.a + r.b) / 2, size, rot: true };
      return null;
    };
    return pick(true) || pick(false) || { cx: mx, cy: my, size: 6.2, rot: false };
  };

  /** One piece. Its cells are filled as ONE path, each 0.3 px larger on every side, so neighbours overlap and no seam shows when the board is scaled. */
  const piece = (
    cells: Cell[],
    x: number,
    y: number,
    fills: [string, number][],
    stroke: string | null,
    strokeAlpha: number,
    txt: string | null,
    txtCol: string,
    alpha: number,
    chipBg: string | null,
  ) => {
    const set = new Set(cells.map((p) => `${p[0]},${p[1]}`));
    ctx.beginPath();
    for (const p of cells) if (y + p[1] >= -1) ctx.rect(OX + (x + p[0]) * C - 0.3, OY + (y + p[1]) * C - 0.3, C + 0.6, C + 0.6);
    for (const [fill, a] of fills) {
      ctx.globalAlpha = alpha * a;
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke && strokeAlpha > 0) {
      ctx.globalAlpha = alpha * strokeAlpha;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (const p of cells) {
        const X = OX + (x + p[0]) * C;
        const Y = OY + (y + p[1]) * C;
        if (!set.has(`${p[0]},${p[1] - 1}`)) { ctx.moveTo(X, Y); ctx.lineTo(X + C, Y); }
        if (!set.has(`${p[0]},${p[1] + 1}`)) { ctx.moveTo(X, Y + C); ctx.lineTo(X + C, Y + C); }
        if (!set.has(`${p[0] - 1},${p[1]}`)) { ctx.moveTo(X, Y); ctx.lineTo(X, Y + C); }
        if (!set.has(`${p[0] + 1},${p[1]}`)) { ctx.moveTo(X + C, Y); ctx.lineTo(X + C, Y + C); }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = alpha;
    if (txt) {
      const L = placeLabel(cells, txt);
      ctx.save();
      ctx.translate(OX + (x + L.cx) * C, OY + (y + L.cy) * C);
      if (L.rot) ctx.rotate(-Math.PI / 2);
      ctx.font = font(700, L.size, P.mono);
      const w = ctx.measureText(txt).width + 8;
      const h = L.size + 5;
      if (chipBg) {
        ctx.fillStyle = chipBg;
        ctx.fillRect(-w / 2, -h / 2, w, h);
      }
      ctx.fillStyle = txtCol;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, 0, 0.5);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  /** Over the empty well, after the fade. */
  const message = () => {
    const out = 1 - cl((T - T_MSGOUT) / MSG_FADE);
    const a1 = cl((T - T_MSG) / 0.35) * out;
    const a2 = cl((T - T_MSG2) / 0.35) * out;
    const cx = OX + (COLS * C) / 2;
    const maxw = COLS * C - 28;
    const fit = (txt: string, size: number) => {
      ctx.font = font(900, size, P.disp);
      while (size > 10 && ctx.measureText(txt).width > maxw) ctx.font = font(900, (size -= 0.5), P.disp);
      return size;
    };
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = a1;
    fit(TX.m1, LANG === 'es' ? 20 : 24);
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.m1, cx, OY + 3.8 * C);
    ctx.globalAlpha = a2;
    if (LANG === 'es') {
      // Three lines: the Spanish is longer. «RESUELVE» in red, in the middle of the last one.
      ctx.font = font(900, Math.min(fit(TX.m2a, 20), fit(TX.m2b, 20)), P.disp);
      ctx.fillStyle = P.ink;
      ctx.fillText(TX.m2a, cx, OY + 5.0 * C);
      const [pa, pb] = TX.m2b.split(TX.red);
      const wa = ctx.measureText(pa).width;
      const wr = ctx.measureText(TX.red).width;
      const wb = ctx.measureText(pb).width;
      const x1 = cx - (wa + wr + wb) / 2;
      ctx.textAlign = 'left';
      ctx.fillText(pa, x1, OY + 6.1 * C);
      ctx.fillStyle = P.red;
      ctx.fillText(TX.red, x1 + wa, OY + 6.1 * C);
      ctx.fillStyle = P.ink;
      ctx.fillText(pb, x1 + wa + wr, OY + 6.1 * C);
      ctx.restore();
      return;
    }
    ctx.font = font(900, fit(TX.m2a + TX.m2b, 24), P.disp);
    const w1 = ctx.measureText(TX.m2a).width;
    const w2 = ctx.measureText(TX.m2b).width;
    const x0 = cx - (w1 + w2) / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.m2a, x0, OY + 5.2 * C);
    ctx.fillStyle = P.red;
    ctx.fillText(TX.m2b, x0 + w1, OY + 5.2 * C);
    ctx.restore();
  };

  const hud = (tools: number, met: number) => {
    let hs = 9;
    ctx.font = font(700, hs, P.mono);
    while (hs > 6 && ctx.measureText(`${TX.bought}  00${TX.met}  0/4`).width > COLS * C - 16) ctx.font = font(700, (hs -= 0.25), P.mono);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    if (tools >= 0) {
      ctx.fillStyle = P.faint;
      ctx.fillText(`${TX.bought}  ${tools < 10 ? '0' : ''}${tools}`, OX, OY - 16);
    } else {
      ctx.fillStyle = met > 0 ? P.redInk : P.faint;
      ctx.fillText(`${TX.built}  0${met}`, OX, OY - 16);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = met > 0 ? P.redInk : P.faint;
    ctx.fillText(`${TX.met}  ${met}/4`, OX + COLS * C, OY - 16);
  };

  ctx.globalAlpha = 1;
  ctx.fillStyle = P.paper;
  ctx.fillRect(0, 0, W, H);
  // the well
  ctx.strokeStyle = P.well;
  ctx.lineWidth = 1;
  ctx.strokeRect(OX - 0.5, OY - 0.5, COLS * C + 1, ROWS * C + 1);
  // the company
  const rowsGone = cl((T - T_ROWS) / 0.5);
  ctx.fillStyle = P.ink;
  ctx.fillRect(OX, OY + 12 * C, COLS * C, 2 * C);
  if (T >= T_GHOST) {
    // it shows its real shape
    const rise = easeOut(cl((T - T_GHOST) / 0.6));
    DEPTH.forEach((d, c) => {
      const h = (3 - d) * C * rise;
      if (h > 0) ctx.fillRect(OX + c * C - 0.3, OY + 12 * C - h, C + 0.6, h + 1);
    });
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(OX, OY, COLS * C, ROWS * C);
  ctx.clip(); // nothing shows outside the well
  let tools = 0;
  if (T < T_OVER + FADE) {
    const stackAlpha = 1 - cl((T - T_OVER) / FADE);
    for (const p of before) {
      if (T < p.t0) continue;
      const f = cl((T - p.t0) / p.dur);
      if (f >= 1) tools++;
      piece(p.cells, p.x, -4 + (p.y + 4) * easeIn(f), [[P.tool, 1]], P.ink, 1, p.name, P.paper, stackAlpha, P.ink);
    }
  }
  let met = 0;
  if (T >= T_GHOST) {
    const ga = cl((T - T_GHOST) / 0.5);
    NEEDS.forEach((n, i) => {
      const tf = T_FIT + i * (FIT_DUR + FIT_GAP);
      const f = cl((T - tf) / FIT_DUR);
      const landed = f >= 1;
      if (landed) met++;
      const xs = n.cells.map((p) => p[0]);
      if (!landed) {
        // the gap's ghost
        ctx.globalAlpha = ga * (1 - rowsGone);
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = P.red;
        ctx.lineWidth = 1.5;
        for (const p of n.cells) ctx.strokeRect(OX + p[0] * C + 2, OY + p[1] * C + 2, C - 4, C - 4);
        ctx.setLineDash([]);
        ctx.fillStyle = P.redInk;
        ctx.font = font(700, 7, P.mono);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(n.short, OX + ((Math.min(...xs) + Math.max(...xs) + 1) / 2) * C, OY + 9 * C - 5);
        ctx.globalAlpha = 1;
      }
      if (T >= tf) {
        // the piece made for that gap falls, slow and guided
        const minx = Math.min(...xs);
        const miny = Math.min(...n.cells.map((p) => p[1]));
        const rel = n.cells.map((p): Cell => [p[0] - minx, p[1] - miny]);
        const y = lerp(-3, miny, easeOut(f));
        // rows complete: it becomes part of the company (red → ink), its outline melting away
        const k = landed ? cl((rowsGone - 0.35) / 0.65) : 0;
        const fills: [string, number][] = k <= 0 ? [[P.red, 1]] : k >= 1 ? [[P.ink, 1]] : [[P.ink, 1], [P.red, 1 - k]];
        piece(rel, minx, y, fills, k < 1 ? P.paper : null, 1 - k, null, '', 1, null);
        // «BUILT FOR / <need>», on the top (widest) row
        const cw = (Math.max(...rel.map((q) => q[0])) + 1) * C;
        const lx = OX + minx * C + cw / 2;
        const ly = OY + (y + 0.5) * C;
        ctx.save();
        ctx.fillStyle = P.paper;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fs = 6.4;
        ctx.font = font(700, fs, P.mono);
        while (fs > 4.6 && Math.max(ctx.measureText(n.short).width, ctx.measureText(TX.builtFor).width) > cw - 8) ctx.font = font(700, (fs -= 0.2), P.mono);
        ctx.globalAlpha = 0.8;
        ctx.fillText(TX.builtFor, lx, ly - 4.5);
        ctx.globalAlpha = 1;
        ctx.fillText(n.short, lx, ly + 4.5);
        ctx.restore();
      }
    });
  }
  ctx.restore();

  if (T >= T_MSG && T < T_MSGOUT + MSG_FADE) message();
  // «YOUR COMPANY» stays put: it neither moves nor grows
  ctx.fillStyle = P.paper;
  ctx.font = font(900, 11, P.disp);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(TX.company, OX + (COLS * C) / 2, OY + 13 * C);
  const cx = OX + (COLS * C) / 2;
  if (T >= T_HEAD) {
    ctx.save();
    ctx.globalAlpha = cl((T - T_HEAD) / 0.4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let hz = 22;
    ctx.font = font(900, hz, P.disp);
    while (hz > 12 && Math.max(ctx.measureText(TX.h1).width, ctx.measureText(TX.h2).width) > COLS * C - 20) ctx.font = font(900, (hz -= 0.5), P.disp);
    ctx.fillStyle = P.redInk;
    ctx.fillText(TX.h1, cx, OY + 3.2 * C);
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.h2, cx, OY + 4.25 * C);
    ctx.restore();
  }
  if (T >= T_SUB) {
    ctx.save();
    ctx.globalAlpha = cl((T - T_SUB) / 0.4);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font(500, 10.5, P.body);
    ctx.fillStyle = P.muted;
    ctx.fillText(TX.s1, cx, OY + 5.6 * C);
    ctx.fillText(TX.s2, cx, OY + 6.25 * C);
    ctx.restore();
  }
  hud(T < T_GHOST ? Math.max(tools, T >= T_OVER ? before.length : 0) : -1, met);
}

/* ---------- Server side: the last frame, through ./story-svg-recorder.ts ---------- */

const SERVER_PALETTE = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, `var(${v})`])) as unknown as Palette;

/**
 * The last frame, still, as SVG — the ground floor of pair 1 (≈4.8 KB before
 * compression). `crispEdges`: the overlapping cells hide seams on a canvas, but
 * SVG anti-aliases each edge on its own and two half-covered pixels still let
 * the paper through; the last frame has no slanted edge to lose.
 */
export function tetrisFinalMarkup(lang: Lang = 'en'): string {
  const ctx = new SvgCtx();
  drawTetris(ctx, tetrisEnd(lang), SERVER_PALETTE, lang);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" width="100%" height="100%" shape-rendering="crispEdges" data-pv-tetris-still>${ctx}</svg>`;
}

/* ---------- Browser side: the <canvas> ---------- */

export interface Tetris {
  /** Seconds of the timeline, in the host's language. */
  end: number;
  /** Paint instant `T` (seconds) still. */
  paint(T: number): void;
  /** Play the timeline from 0 to its end, then hold the last frame. */
  play(): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createTetris(host: HTMLElement): Tetris {
  const before = [...host.childNodes];
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.dataset.pvTetris = '';
  // Its box (4:5, contained and centred in the host) is the host's CSS; the bitmap follows it.
  host.replaceChildren(cv);
  const ctx = cv.getContext('2d')!;
  const lang: Lang = host.closest('[lang]')?.getAttribute('lang') === 'es' ? 'es' : 'en';
  cv.dataset.pvLang = lang; // which words it draws, readable from outside
  const END = tetrisEnd(lang);
  const css = getComputedStyle(host);
  const P = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, css.getPropertyValue(v).trim()])) as unknown as Palette;

  let T = 0;
  let raf = 0;
  let scale = 1;
  const render = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawTetris(ctx, T, P, lang);
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
  // Repaint once the canon's faces are in (a canvas does not re-render on its own when a font arrives).
  document.fonts
    ?.load(`700 10px ${P.mono}`)
    .then(() => Promise.all([document.fonts.load(`900 10px ${P.disp}`), document.fonts.load(`500 10px ${P.body}`)]))
    .then(render, () => {});

  return {
    end: END,
    paint(t) {
      cancelAnimationFrame(raf);
      T = t;
      render();
    },
    play() {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const loop = (now: number) => {
        T = Math.min((now - start) / 1000, END);
        render();
        if (T < END) raf = requestAnimationFrame(loop);
      };
      T = 0;
      render();
      raf = requestAnimationFrame(loop);
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.replaceChildren(...before);
    },
  };
}
