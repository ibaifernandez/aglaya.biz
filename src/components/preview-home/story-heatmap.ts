/**
 * T2 · pair 2's drawing — «the heat map of your week». PROVISIONAL, to be
 * replaced by video, like ./story-tetris.ts (pair 1) and ./story-drawing.ts
 * (pairs 3–4).
 *
 * Ported from the reference mock-up `docs/design/portada-nueva/t2-anim2-heatmap.html`
 * (English only; the Spanish is for the video): one deterministic `draw(T)`
 * that paints any instant of a ≈36 s timeline on a 400 × 500 logical board (4:5,
 * the stage).
 *   BEFORE  the monthly AI bill fills line by line, most of it stamped
 *           «UNUSED», while the team's trust in AI drops · fade ·
 *   MESSAGE «A BIGGER BILL EVERY MONTH. / AND NOTHING GOT» + a word that rolls
 *           (FASTER. CHEAPER. SIMPLER. MORE EFFICIENT. BETTER.) · fade ·
 *   AFTER   the week's lost hours by department and day, measured first (a
 *           scan reveals them); one «AI SYSTEM #n» drops on each hot spot, which
 *           cools down, its gain written underneath; unused licences go to zero,
 *           trust rises ·
 *   CLOSE   «START WHERE IT PAYS. / THEN GROW FROM WHAT WORKS.»
 *
 * The composition is aligned to the pixel, as in the mock-up: the counters and
 * the trust bar line up with the bill; the department names start where
 * «THEN» starts and the grid ends where the closing ends (`closingFit`,
 * `layout`); each gain comes in with its «AI SYSTEM» and leaves before the next.
 *
 * Same two backends as the Tetris, through the recorder it shares with it
 * (./story-svg-recorder.ts): a real <canvas> in the browser (`createHeatmap`),
 * on a wide screen with motion allowed; on the server, SVG of the last frame,
 * still (`heatmapFinalMarkup`), for the ground floor, reduced motion and phones.
 * Swapping it for video means rewriting this file behind the same exports.
 *
 * Colours and type are the canon's tokens: on the server written as
 * `var(--color-*)` (the heat as `color-mix()` of two of them), in the browser
 * read off the host's computed style. No brand value is written here.
 */
import { SvgCtx, measure as monoMeasure, type Ctx, type Measure } from './story-svg-recorder';

/** The pair (0-based) this drawing belongs to. */
export const HEATMAP_PAIR = 1;

/* ---------- The words (mock-up `TX.en`) ---------- */

const TX = {
  rows: ['SALES', 'OPS', 'FINANCE', 'SUPPORT'],
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  start: 'START HERE',
  next: 'NEXT',
  bill: 'MONTHLY AI BILL',
  seats: 'SEATS USED',
  perMonth: '$ / MONTH',
  unused: 'UNUSED',
  total: 'TOTAL',
  money: (v: number) => `$${v.toLocaleString('en-US')} / MONTH`,
  price: (v: number) => `$${v}`,
  lic: 'LICENCES PAID',
  saved: 'HOURS SAVED / WEEK',
  built: 'SYSTEMS BUILT',
  trust: 'TEAM TRUST IN AI',
  unusedL: 'UNUSED LICENCES',
  gains: ['Every lead followed up the same day.', 'Orders go through without re-typing.', 'Month-end closes without the scramble.', 'Customers answered in minutes.'],
  m1: 'A BIGGER BILL EVERY MONTH.',
  m2a: 'AND NOTHING GOT',
  words: ['FASTER.', 'CHEAPER.', 'SIMPLER.', 'MORE EFFICIENT.', 'BETTER.'],
  sys: 'AI SYSTEM',
  c1: 'START WHERE IT PAYS.',
  c2: 'THEN GROW FROM WHAT WORKS.',
};

/* ---------- The board and the script (mock-up, unchanged) ---------- */

/** The logical board: 4:5, like the stage it fills; the mock-up's 400-wide composition sits 50 down. */
const W = 400;
const H = 500;
const DY = 50;
const GY = 96;
const CW = 56;
const CH = 40;
/** Hours lost per cell (0–6): rows = departments, columns = days. */
const HEAT = [
  [6, 5, 1, 0.5, 1],
  [1, 0.5, 5, 4, 1],
  [0.5, 1, 0.5, 3, 4],
  [1, 3, 3, 1, 0.5],
];
type Cell = [number, number];
/** Hottest first: the order they are tackled in. */
const CLUSTERS: { cells: Cell[]; hours: number; tag: string }[] = [
  { cells: [[0, 0], [0, 1]], hours: 11, tag: TX.start },
  { cells: [[1, 2], [1, 3]], hours: 9, tag: TX.next },
  { cells: [[2, 3], [2, 4]], hours: 7, tag: TX.next },
  { cells: [[3, 1], [3, 2]], hours: 6, tag: TX.next },
];
/** BEFORE: the monthly bill — [name, seats used, seats paid, $ / month]. Bought without measuring: mostly unused. */
const BILL: [string, number, number, number][] = [
  ['CHATGPT TEAM', 3, 10, 300],
  ['COPILOT', 1, 8, 240],
  ['JASPER', 0, 5, 245],
  ['NOTION AI', 2, 12, 120],
  ['ZAPIER', 1, 1, 70],
  ['GEMINI', 0, 10, 200],
  ['SYNTHESIA', 0, 3, 270],
  ['OTTER', 1, 6, 100],
  ['MIDJOURNEY', 0, 4, 120],
];
const isUnused = (L: (typeof BILL)[number]) => L[1] / L[2] < 0.35;
const UNUSED_COUNT = BILL.filter(isUnused).length;

const before: { t0: number; dur: number }[] = [];
let tb = 0.6;
{
  let dur = 0.6;
  for (let i = 0; i < BILL.length; i++) {
    before.push({ t0: tb, dur });
    tb += dur + 0.12;
    dur = Math.max(0.28, dur * 0.88);
  }
}
const T_B_END = tb + 0.6;
const FADE = 0.8;
const T_MSG = T_B_END + FADE + 0.2;
const L1 = 1.8;
const WORD = 0.7;
const L2 = 0.5 + 5 * 0.7 + 0.9;
const MSG_OUT = T_MSG + L1 + L2;
const MSG_FADE = 0.6;
/** The week comes back, without licences. */
const T_A = MSG_OUT + MSG_FADE + 0.2;
/** Measured first. */
const T_SCAN = T_A + 0.6;
const SCAN_DUR = 1.6;
/** Per hot spot: mark · drop · cool. */
const STEP = 3.2;
const T_K0 = T_SCAN + SCAN_DUR + 0.3;
const T_CAP = T_K0 + CLUSTERS.length * STEP + 1.8;
const CAP2 = 1.8;

/** Seconds from the first bill line to the still last frame (≈ 36). */
export const HEATMAP_END = T_CAP + CAP2 + 3.2;

/* ---------- Drawing ---------- */

/** Token roles, as each backend spells them; `heat(f)` mixes cold → red by f (0..1). */
export interface Palette {
  paper: string; // --color-bg
  ink: string; // --color-text
  red: string; // --color-brand
  redInk: string; // --color-brand-dark
  faint: string; // --color-faint
  cold: string; // --color-surface-2
  track: string; // --color-surface-3
  rowA: string; // --color-surface
  rowB: string; // --color-surface-2
  rowSoft: string; // --color-bg-deep
  mono: string; // --font-mono
  disp: string; // --font-display
  heat(f: number): string;
}

type Role = Exclude<keyof Palette, 'heat'>;
const ROLES: Record<Role, string> = {
  paper: '--color-bg',
  ink: '--color-text',
  red: '--color-brand',
  redInk: '--color-brand-dark',
  faint: '--color-faint',
  cold: '--color-surface-2',
  track: '--color-surface-3',
  rowA: '--color-surface',
  rowB: '--color-surface-2',
  rowSoft: '--color-bg-deep',
  mono: '--font-mono',
  disp: '--font-display',
};

const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

/** 1 = that cell's hot spot has cooled down completely. */
function coolOf(T: number, r: number, c: number) {
  for (let k = 0; k < CLUSTERS.length; k++) {
    const t0 = T_K0 + k * STEP;
    if (CLUSTERS[k].cells.some((q) => q[0] === r && q[1] === c)) return ease(cl((T - (t0 + 1.5)) / 1.0));
  }
  return 0;
}
const savedAt = (T: number) => Math.round(CLUSTERS.reduce((s, k, i) => s + k.hours * ease(cl((T - (T_K0 + i * STEP + 1.5)) / 1.0)), 0));
/** Drops with every licence, rises with every hot spot solved. */
function trustAt(T: number) {
  let v = 0.62;
  for (const b of before) v -= 0.05 * cl((T - b.t0 - b.dur) / 0.3);
  CLUSTERS.forEach((_, i) => (v += 0.22 * ease(cl((T - (T_K0 + i * STEP + 1.6)) / 1.0))));
  return Math.max(0.05, Math.min(0.95, v));
}

/** Paint instant `T` (seconds, clamped to 0..HEATMAP_END) on a W × H (400 × 500) board in `ctx`'s current transform. */
export function drawHeatmap(ctx: Ctx, T: number, P: Palette) {
  T = Math.max(0, Math.min(T, HEATMAP_END));
  const font = (w: number, size: number, fam: string) => `${w} ${size}px ${fam}`;

  /** The closing's size, and where its last (longest) line starts. */
  const closingFit = () => {
    let fz = 22;
    ctx.font = font(900, fz, P.disp);
    while (fz > 12 && Math.max(ctx.measureText(TX.c1).width, ctx.measureText(TX.c2).width) > 360) ctx.font = font(900, (fz -= 0.5), P.disp);
    return { fz, left: 200 - ctx.measureText(TX.c2).width / 2 };
  };
  // The grid ends where the closing ends (mock-up `layout()`).
  const CF = closingFit();
  const GX = CF.left + (200 - CF.left) * 2 - 5 * CW;
  const cellXY = (r: number, c: number) => ({ x: GX + c * CW, y: GY + r * CH });
  const heatCol = (h: number) => (h <= 0.01 ? P.cold : P.heat(Math.pow(h / 6, 1.1)));

  const drawGrid = (alpha: number, scanX: number | null) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    // The departments start where the closing's last line starts.
    ctx.font = font(700, 8, P.mono);
    ctx.fillStyle = P.faint;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    TX.rows.forEach((name, r) => ctx.fillText(name, CF.left, GY + r * CH + CH / 2));
    ctx.textAlign = 'center';
    TX.days.forEach((d, c) => ctx.fillText(d, GX + c * CW + CW / 2, GY - 10));
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 5; c++) {
        const p = cellXY(r, c);
        const h = HEAT[r][c] * (1 - coolOf(T, r, c));
        ctx.fillStyle = heatCol(h);
        ctx.fillRect(p.x + 2, p.y + 2, CW - 4, CH - 4);
        const revealed = scanX === null || p.x + CW / 2 <= scanX;
        if (HEAT[r][c] >= 3 && revealed) {
          ctx.fillStyle = h > 2.5 ? P.paper : P.faint;
          ctx.font = font(700, 9, P.mono);
          ctx.fillText(`${Math.round(h)}H`, p.x + CW / 2, p.y + CH / 2);
        }
      }
    ctx.restore();
  };

  const drawBill = (alpha: number) => {
    const X = 40;
    const BW = 320;
    const Y = GY - 34 + 22;
    const RH = 17;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = P.ink;
    ctx.fillRect(X, Y, BW, 22);
    ctx.fillStyle = P.paper;
    ctx.font = font(700, 9, P.mono);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(TX.bill, X + 8, Y + 11);
    ctx.textAlign = 'right';
    ctx.fillText(TX.seats, X + BW - 70, Y + 11);
    ctx.fillText(TX.perMonth, X + BW - 8, Y + 11);
    // The bill's skeleton is there from the start: empty rows waiting for their lines.
    for (let e = 0; e < BILL.length; e++) {
      const ey = Y + 26 + e * RH;
      ctx.fillStyle = e % 2 ? P.rowSoft : P.rowA;
      ctx.fillRect(X, ey, BW, RH - 1);
      ctx.fillStyle = P.track;
      ctx.fillRect(X + 8, ey + RH / 2 - 1.5, 60, 3);
      ctx.fillRect(X + BW - 100, ey + RH / 2 - 1.5, 28, 3);
      ctx.fillRect(X + BW - 38, ey + RH / 2 - 1.5, 30, 3);
    }
    let total = 0;
    before.forEach((b, i) => {
      if (T < b.t0) return;
      const f = cl((T - b.t0) / b.dur);
      const L = BILL[i];
      const y = Y + 26 + i * RH;
      ctx.globalAlpha = alpha * cl(f * 1.6);
      ctx.fillStyle = i % 2 ? P.rowSoft : P.rowB;
      ctx.fillRect(X, y, BW, RH - 1);
      ctx.fillStyle = P.ink;
      ctx.font = font(700, 8, P.mono);
      ctx.textAlign = 'left';
      ctx.fillText(L[0], X + 8, y + RH / 2);
      ctx.textAlign = 'right';
      ctx.fillText(`${L[1]} / ${L[2]}`, X + BW - 70, y + RH / 2);
      ctx.fillText(TX.price(L[3]), X + BW - 8, y + RH / 2);
      if (f >= 1) total += L[3];
      if (isUnused(L) && f >= 1) {
        // the «UNUSED» stamp, landing
        const st = cl((T - b.t0 - b.dur) / 0.18);
        ctx.save();
        ctx.globalAlpha = alpha * st;
        ctx.translate(X + BW * 0.47, y + RH / 2);
        ctx.rotate(-0.08);
        const sc = 1.6 - 0.6 * st;
        ctx.scale(sc, sc);
        ctx.strokeStyle = P.red;
        ctx.lineWidth = 1.3;
        ctx.strokeRect(-24, -6, 48, 12);
        ctx.fillStyle = P.red;
        ctx.font = font(700, 7.5, P.mono);
        ctx.textAlign = 'center';
        ctx.fillText(TX.unused, 0, 0.5);
        ctx.restore();
      }
    });
    const ty = Y + 26 + BILL.length * RH + 4;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = P.ink;
    ctx.fillRect(X, ty, BW, 2);
    ctx.font = font(900, 13, P.disp);
    ctx.textAlign = 'left';
    ctx.fillText(TX.total, X + 8, ty + 14);
    ctx.textAlign = 'right';
    ctx.fillStyle = total > 0 ? P.redInk : P.ink;
    ctx.fillText(TX.money(total), X + BW - 8, ty + 14);
    ctx.restore();
  };

  const hud = (lic: number, saved: number, phaseAfter: boolean) => {
    // Before, everything lines up with the bill (which starts 40 px in); after, with the grid.
    const LX = phaseAfter ? GX : 40;
    const LW = phaseAfter ? 5 * CW : 320;
    const HY = phaseAfter ? 52 : 52 + 22;
    let hs = 9;
    ctx.font = font(700, hs, P.mono);
    while (hs > 6 && ctx.measureText(`${TX.built}  00${TX.saved}  00`).width > LW - 12) ctx.font = font(700, (hs -= 0.25), P.mono);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    if (!phaseAfter) {
      ctx.fillStyle = P.faint;
      ctx.fillText(`${TX.lic}  ${lic < 10 ? '0' : ''}${lic}`, LX, HY);
    } else {
      ctx.fillStyle = saved > 0 ? P.redInk : P.faint;
      ctx.fillText(`${TX.built}  0${CLUSTERS.filter((_, i) => T >= T_K0 + i * STEP + 1.5).length}`, LX, HY);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = saved > 0 ? P.redInk : P.faint;
    ctx.fillText(`${TX.saved}  ${saved}`, LX + LW, HY);
    // the team's trust
    const tr = trustAt(T);
    const y = T < T_A ? GY + 4 * CH + 52 + 22 : GY + 4 * CH + 22;
    if (!phaseAfter) {
      ctx.textAlign = 'left';
      ctx.fillStyle = P.faint;
      ctx.fillText(TX.trust, LX, y - 6);
      ctx.fillStyle = P.track;
      ctx.fillRect(LX, y, LW, 6);
      ctx.fillStyle = tr < 0.35 ? P.red : P.ink;
      ctx.fillRect(LX, y, LW * tr, 6);
    } else {
      // After: not only hours. Left, the unused licences cancelled (cheaper, simpler); right, trust (better).
      const half = (LW - 16) / 2;
      const done = CLUSTERS.filter((_, i) => T >= T_K0 + i * STEP + 1.6).length;
      const left = Math.max(0, UNUSED_COUNT - Math.round((done * UNUSED_COUNT) / CLUSTERS.length));
      ctx.textAlign = 'left';
      ctx.fillStyle = left < UNUSED_COUNT ? P.redInk : P.faint;
      ctx.fillText(`${TX.unusedL}  ${left}`, LX, y - 6);
      const cw = Math.min(14, (half - (UNUSED_COUNT - 1) * 3) / UNUSED_COUNT);
      for (let u = 0; u < UNUSED_COUNT; u++) {
        const ux = LX + u * (cw + 3);
        const gone = u >= left;
        ctx.fillStyle = gone ? P.track : P.ink;
        ctx.fillRect(ux, y - 1, cw, 8);
        if (gone) {
          ctx.strokeStyle = P.red;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ux - 1, y + 7);
          ctx.lineTo(ux + cw + 1, y - 1);
          ctx.stroke();
        }
      }
      const RX = LX + half + 16;
      ctx.fillStyle = P.faint;
      ctx.save();
      // The trust label shrinks only if it does not fit its half (mock-up; same result, without its parseFloat(ctx.font)).
      let ts = hs;
      while (ts > 5.5 && ctx.measureText(TX.trust).width > half) ctx.font = font(700, (ts -= 0.25), P.mono);
      ctx.fillText(TX.trust, RX, y - 6);
      ctx.restore();
      ctx.fillStyle = P.track;
      ctx.fillRect(RX, y, half, 6);
      ctx.fillStyle = tr < 0.35 ? P.red : P.ink;
      ctx.fillRect(RX, y, half * tr, 6);
    }
  };

  ctx.globalAlpha = 1;
  ctx.fillStyle = P.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.translate(0, DY); // 4:5: the mock-up's 400-wide composition, centred in 500
  let lic = 0;
  for (const b of before) if (T >= b.t0 + b.dur) lic++;

  // BEFORE
  if (T < T_B_END + FADE) drawBill(1 - cl((T - T_B_END) / FADE));

  // MESSAGE
  if (T >= T_MSG && T < MSG_OUT + MSG_FADE) {
    const out = 1 - cl((T - MSG_OUT) / MSG_FADE);
    const a1 = cl((T - T_MSG) / 0.35) * out;
    const a2 = cl((T - T_MSG - L1) / 0.35) * out;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let mz = 21;
    ctx.font = font(900, mz, P.disp);
    while (mz > 11 && ctx.measureText(TX.m1).width > 364) ctx.font = font(900, (mz -= 0.5), P.disp);
    const yb = GY + 1.2 * CH + 7; // centred between the counter above and the bar below
    ctx.globalAlpha = a1;
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.m1, 200, yb);
    ctx.globalAlpha = a2;
    ctx.fillText(TX.m2a, 200, yb + 1.05 * CH);
    // The word that rolls: not only speed, every value — ending on the one that sums them up.
    const e2 = T - T_MSG - L1 - 0.5;
    const wi = Math.max(0, Math.min(TX.words.length - 1, Math.floor(e2 / WORD)));
    const wl = e2 - wi * WORD;
    const roll = wi < TX.words.length - 1 || wl < WORD ? cl(wl / 0.16) : 1;
    if (e2 >= 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, yb + 1.55 * CH, 400, 1.05 * CH);
      ctx.clip();
      const wy = yb + 2.1 * CH;
      ctx.fillStyle = P.red;
      ctx.globalAlpha = a2;
      ctx.fillText(TX.words[wi], 200, wy + (1 - ease(roll)) * CH * 0.9);
      if (wi > 0 && roll < 1) {
        ctx.globalAlpha = a2 * (1 - roll);
        ctx.fillText(TX.words[wi - 1], 200, wy - ease(roll) * CH * 0.9);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // AFTER
  const after = T >= T_A;
  if (after) {
    const a2b = cl((T - T_A) / 0.5);
    const scanX = T < T_SCAN ? GX : T < T_SCAN + SCAN_DUR ? lerp(GX, GX + 5 * CW, cl((T - T_SCAN) / SCAN_DUR)) : null;
    drawGrid(a2b, scanX);
    if (T >= T_SCAN && T < T_SCAN + SCAN_DUR + 0.4) {
      // the scan: we measure first
      const sa = 1 - cl((T - T_SCAN - SCAN_DUR) / 0.4);
      const sx = lerp(GX, GX + 5 * CW, cl((T - T_SCAN) / SCAN_DUR));
      ctx.save();
      ctx.globalAlpha = sa;
      ctx.fillStyle = P.red;
      ctx.fillRect(sx - 1, GY - 2, 2, 4 * CH + 4);
      ctx.restore();
    }
    CLUSTERS.forEach((k, i) => {
      const t0 = T_K0 + i * STEP;
      if (T < t0) return;
      const mark = cl((T - t0) / 0.4);
      const fade = T >= t0 + 2.5 ? 1 - cl((T - t0 - 2.5) / 0.5) : 1;
      const xs = k.cells.map((q) => q[1]);
      const ys = k.cells.map((q) => q[0]);
      const x0 = GX + Math.min(...xs) * CW;
      const y0 = GY + Math.min(...ys) * CH;
      const w = (Math.max(...xs) - Math.min(...xs) + 1) * CW;
      const h = (Math.max(...ys) - Math.min(...ys) + 1) * CH;
      ctx.save();
      ctx.globalAlpha = mark * fade;
      ctx.strokeStyle = P.ink;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(x0, y0, w, h);
      ctx.font = font(700, 8, P.mono);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // the system that is put right there
      const drop = cl((T - t0 - 0.8) / 0.5);
      if (drop > 0) {
        const cy = lerp(y0 - 20, y0 + h / 2, ease(drop));
        ctx.globalAlpha = fade * Math.min(1, drop * 2);
        ctx.fillStyle = P.red;
        const sysL = `${TX.sys} #${i + 1}`;
        const sw = Math.max(60, ctx.measureText(sysL).width + 12);
        const chx = Math.min(Math.max(x0 + w / 2, GX + sw / 2), GX + 5 * CW - sw / 2);
        ctx.fillRect(chx - sw / 2, cy - 8, sw, 16);
        ctx.fillStyle = P.paper;
        ctx.fillText(sysL, chx, cy + 0.5);
      }
      ctx.restore();
    });
  }
  hud(after ? 0 : lic, after ? savedAt(T) : 0, after);

  // Each area's gain: comes in with its «AI SYSTEM», leaves just before the next; the last fades before the close.
  if (after)
    CLUSTERS.forEach((k, i) => {
      const tin = T_K0 + i * STEP + 0.8;
      const tout = i < CLUSTERS.length - 1 ? T_K0 + (i + 1) * STEP + 0.4 : T_CAP - 0.6;
      const fin = cl((T - tin) / 0.4);
      const fout = cl((T - tout) / 0.35);
      const ga = fin * (1 - fout);
      if (ga <= 0) return;
      const dy = (1 - ease(fin)) * 8 - ease(fout) * 8;
      const gy = GY + 4 * CH + 64 + dy;
      const gain = TX.gains[i].toUpperCase();
      ctx.save();
      ctx.globalAlpha = ga;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = font(700, 9, P.mono);
      ctx.fillStyle = P.redInk;
      ctx.fillText(TX.rows[k.cells[0][0]], 200, gy);
      let gz = 16;
      ctx.font = font(900, gz, P.disp);
      while (gz > 10 && ctx.measureText(gain).width > 360) ctx.font = font(900, (gz -= 0.5), P.disp);
      ctx.fillStyle = P.ink;
      ctx.fillText(gain, 200, gy + 18);
      ctx.restore();
    });

  // CLOSE
  if (T >= T_CAP) {
    const c1 = cl((T - T_CAP) / 0.4);
    const c2 = cl((T - T_CAP - CAP2) / 0.4);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font(900, CF.fz, P.disp);
    ctx.globalAlpha = c1;
    ctx.fillStyle = P.redInk;
    ctx.fillText(TX.c1, 200, GY + 4 * CH + 66);
    ctx.globalAlpha = c2;
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.c2, 200, GY + 4 * CH + 66 + CF.fz * 1.15);
    ctx.restore();
  }
  ctx.restore();
}

/* ---------- Server side: the last frame, through ./story-svg-recorder.ts ---------- */

/**
 * The width, in em, of the two closing lines in the canon's display face at
 * 900 (Outfit-Black.ttf of @aglaya/design-tokens, laid out with its kerning).
 * Unlike the Tetris, here a proportional line's width is not only "does it
 * fit?": it decides the closing's size AND where the grid and the department
 * names sit. An estimate would put them a few pixels off the canvas's, so the
 * server takes the face's own measure for the only two lines whose width the
 * last frame depends on. Checked against the real canvas by
 * tests/e2e/preview-home.spec.ts (it fails if the face or the words change).
 */
const DISPLAY_900_EM: Record<string, number> = {
  [TX.c1]: 11.241,
  [TX.c2]: 16.959,
};
const serverMeasure: Measure = (font, text) => {
  const m = /^900 ([\d.]+)px (.+)$/.exec(font);
  if (m && m[2].includes('display') && text in DISPLAY_900_EM) return DISPLAY_900_EM[text] * +m[1];
  return monoMeasure(font, text);
};

const pct = (f: number) => Math.round(f * 10000) / 100;
const SERVER_PALETTE: Palette = {
  ...(Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, `var(${v})`])) as Record<Role, string>),
  heat: (f) => `color-mix(in srgb, var(${ROLES.cold}) ${pct(1 - f)}%, var(${ROLES.red}))`,
};

/** The last frame, still, as SVG — the ground floor of pair 2. */
export function heatmapFinalMarkup(): string {
  const ctx = new SvgCtx({ idPrefix: 'pv-heatmap-clip', measure: serverMeasure });
  drawHeatmap(ctx, HEATMAP_END, SERVER_PALETTE);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" width="100%" height="100%" data-pv-heatmap-still>${ctx}</svg>`;
}

/* ---------- Browser side: the <canvas> ---------- */

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

export interface Heatmap {
  /** Paint instant `T` (seconds) still. */
  paint(T: number): void;
  /** Play the timeline from 0 to its end, then hold the last frame. */
  play(): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createHeatmap(host: HTMLElement): Heatmap {
  const held = [...host.childNodes];
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.dataset.pvHeatmap = '';
  // Its box (4:5, contained and centred in the host) is the host's CSS; the bitmap follows it.
  host.replaceChildren(cv);
  const ctx = cv.getContext('2d')!;
  const css = getComputedStyle(host);
  const tok = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, css.getPropertyValue(v).trim()])) as Record<Role, string>;
  const cold = rgbOf(tok.cold);
  const red = rgbOf(tok.red);
  const P: Palette = {
    ...tok,
    heat: (f) => `rgb(${cold.map((v, i) => Math.round(lerp(v, red[i], f))).join(',')})`,
  };

  let T = 0;
  let raf = 0;
  let scale = 1;
  const render = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawHeatmap(ctx, T, P);
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
    .then(() => document.fonts.load(`900 10px ${P.disp}`))
    .then(render, () => {});

  return {
    paint(t) {
      cancelAnimationFrame(raf);
      T = t;
      render();
    },
    play() {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const loop = (now: number) => {
        T = Math.min((now - start) / 1000, HEATMAP_END);
        render();
        if (T < HEATMAP_END) raf = requestAnimationFrame(loop);
      };
      T = 0;
      render();
      raf = requestAnimationFrame(loop);
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.replaceChildren(...held);
    },
  };
}
