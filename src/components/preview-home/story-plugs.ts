/**
 * T2 · pair 3's drawing — «the plugs». PROVISIONAL, to be replaced by video,
 * like ./story-tetris.ts (pair 1) and ./story-heatmap.ts (pair 2).
 *
 * Ported from the reference mock-up `docs/design/portada-nueva/t2-anim3-plugs.html`
 * (English only; the Spanish is for the video): one deterministic `draw(T)` that
 * paints any instant of a ≈35 s timeline on a 400 × 500 logical board (4:5, the
 * stage).
 *   BEFORE  each of the company's four processes runs plugged into a vendor it
 *           rents from; one notice at a time (ACQUIRED, SHUTDOWN, NEW TERMS,
 *           PLAN CHANGE) and that vendor pulls its plug: the process stops ·
 *           fade ·
 *   MESSAGE «IT ONLY WORKS / WHILE YOU PAY / IF NOT ACQUIRED / …» · fade ·
 *   AFTER   the company's wall moves out to take them in; one system per
 *           process, «YOUR ASSET»; the same notices drop onto the roof, bounce,
 *           settle about 9 px above it and stay until just before the close ·
 *   CLOSE   «BUILT FOR YOU. / YOURS TO KEEP.» + «No more rent. What we build /
 *           becomes your company's asset.»
 *
 * Same two backends as the other two pieces, through the shared recorder
 * (./story-svg-recorder.ts): a real <canvas> in the browser (`createPlugs`), on a
 * wide screen with motion allowed; on the server, SVG of the last frame, still
 * (`plugsFinalMarkup`), for the ground floor, reduced motion and phones.
 * Swapping it for video means rewriting this file behind the same exports.
 *
 * Colours and type are the canon's tokens: on the server written as
 * `var(--color-*)` (the red → ink blend as `color-mix()` of two of them), in the
 * browser read off the host's computed style. No brand value is written here.
 */
import { SvgCtx, type Ctx } from './story-svg-recorder';

/** The pair (0-based) this drawing belongs to. */
export const PLUGS_PAIR = 2;

/* ---------- The words (mock-up `TX.en` / `TX.es`) ---------- */

export type Lang = 'en' | 'es';

const EN = {
  procs: ['LEADS', 'ORDERS', 'REPORTS', 'SUPPORT'],
  vendors: ['CRM', 'ORDER APP', 'BI TOOL', 'HELPDESK'],
  rented: 'RENTED',
  running: 'RUNNING',
  stopped: 'STOPPED',
  notices: ['ACQUIRED', 'PLAN CHANGE', 'SHUTDOWN', 'NEW TERMS'],
  owned: 'DIGITAL ASSETS',
  live: 'STILL RUNNING',
  company: 'YOUR COMPANY',
  rentMonths: 'MONTHS OF RENT',
  month: 'MONTH',
  rent0: 'RENT',
  sys: 'SYSTEM',
  yours: 'YOUR ASSET',
  msg: ['IT ONLY WORKS', 'WHILE YOU PAY', 'IF NOT ACQUIRED', 'IF NOT SHUT DOWN', "IF TERMS DON'T CHANGE", "IF PLANS DON'T CHANGE"],
  c1: 'BUILT FOR YOU.',
  c2: 'YOURS TO KEEP.',
  c3: ['No more rent. What we build', "becomes your company's asset."],
};
const WORDS: Record<Lang, typeof EN> = {
  en: EN,
  es: {
    procs: ['LEADS', 'PEDIDOS', 'INFORMES', 'SOPORTE'],
    vendors: ['CRM', 'APP PEDIDOS', 'BI', 'HELPDESK'],
    rented: 'ALQUILADO',
    running: 'FUNCIONA',
    stopped: 'PARADO',
    notices: ['COMPRADA', 'CAMBIO DE PLAN', 'CIERRE', 'NUEVAS CONDICIONES'],
    owned: 'ACTIVOS DIGITALES',
    live: 'FUNCIONANDO',
    company: 'TU EMPRESA',
    rentMonths: 'MESES DE ALQUILER',
    month: 'MES',
    rent0: 'ALQUILER',
    sys: 'SISTEMA',
    yours: 'TU ACTIVO',
    msg: ['SOLO FUNCIONA', 'MIENTRAS PAGUES', 'SI NO LA COMPRAN', 'SI NO CIERRA', 'SI NO CAMBIAN LAS CONDICIONES', 'SI NO CAMBIAN LOS PLANES'],
    c1: 'HECHO PARA TI.',
    c2: 'Y ES TUYO.',
    c3: ['Se acabó el alquiler: lo que construimos', 'pasa a ser un activo de tu empresa.'],
  },
};
/** The words of the language being drawn — set at the top of every draw. The timeline is the same in both. */
let TX = EN;

/* ---------- The board and the script (mock-up, unchanged) ---------- */

const W = 400;
const H = 500;
const FX = 40;
const FY = 75;
const FH = 270;
const WALL0 = 230;
const WALL1 = 360;
const PITCH = 62;
const CARD_X = 52;
const CARD_W = 98;
const CARD_H = 42;
const VX = 280;
const VW = 80;
const VH = 30;
const HUDY = FY + FH + 24;
const STRIPY = FY + FH + 48;
const rowC = (i: number) => FY + 18 + i * PITCH + CARD_H / 2;

/** BEFORE: the notices, in this order (process index). */
const ORDER = [0, 2, 3, 1];
const EV0 = 2.2;
const EVS = 1.7;
const PULL_AT = 1.0;
const PULL = 0.45;
const evT = (i: number) => EV0 + ORDER.indexOf(i) * EVS;
const stopT = (i: number) => evT(i) + PULL_AT + PULL;
const T_B_END = EV0 + 3 * EVS + PULL_AT + PULL + 1.0;
const FADE = 0.8;
/** Seconds per month on the rent strip. */
const MPM = 0.35;
const T_MSG = T_B_END + FADE + 0.2;
const MSG_AT = [0, 0.9, 2.1, 3.0, 3.9, 4.8];
const MSG_DUR = 7.6;
const MSG_OUT = T_MSG + MSG_DUR;
const MSG_FADE = 0.6;
const T_A = MSG_OUT + MSG_FADE + 0.2;
const T_WALL = T_A + 0.5;
const WALL_DUR = 0.9;
const T_K0 = T_WALL + WALL_DUR + 0.3;
const STEP = 1.1;
const T_N0 = T_K0 + 4 * STEP + 0.2;
const NST = 0.8;
const T_CAP = T_N0 + 3 * NST + 0.45 + 3.2;
const CAP2 = 1.4;

/** Seconds from the first frame to the still last frame (≈ 35). */
export const PLUGS_END = T_CAP + 2 * CAP2 + 4.0;
const BMONTHS = Math.floor(T_B_END / MPM);

/* ---------- Drawing ---------- */

/** Token roles, as each backend spells them; `mix(f)` blends red → ink by f (0..1). */
export interface Palette {
  paper: string; // --color-bg
  ink: string; // --color-text
  red: string; // --color-brand
  redInk: string; // --color-brand-dark
  faint: string; // --color-faint
  dead: string; // --color-border-strong
  off: string; // --color-surface-2
  track: string; // --color-surface-3
  muted: string; // --color-muted
  mono: string; // --font-mono
  disp: string; // --font-display
  body: string; // --font-body
  mix(f: number): string;
}

type Role = Exclude<keyof Palette, 'mix'>;
const ROLES: Record<Role, string> = {
  paper: '--color-bg',
  ink: '--color-text',
  red: '--color-brand',
  redInk: '--color-brand-dark',
  faint: '--color-faint',
  dead: '--color-border-strong',
  off: '--color-surface-2',
  track: '--color-surface-3',
  muted: '--color-muted',
  mono: '--font-mono',
  disp: '--font-display',
  body: '--font-body',
};

const cl = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const builtT = (i: number) => T_K0 + i * STEP;
const isRunning = (T: number, i: number) => (T < T_A ? T < stopT(i) : T >= builtT(i) + 0.5);

/** Paint instant `T` (seconds, clamped to 0..PLUGS_END) on a W × H (400 × 500) board in `ctx`'s current transform. */
export function drawPlugs(ctx: Ctx, T: number, P: Palette, lang: Lang = 'en') {
  TX = WORDS[lang];
  T = Math.max(0, Math.min(T, PLUGS_END));
  const fam = (w: string) => (w === '900' ? P.disp : P.mono);
  const fitFont = (txt: string, max: number, start: number, min: number, w: string) => {
    let z = start;
    ctx.font = `${w} ${z}px ${fam(w)}`;
    while (z > min && ctx.measureText(txt).width > max) {
      z -= 0.25;
      ctx.font = `${w} ${z}px ${fam(w)}`;
    }
    return z;
  };

  const pulseLine = (x0: number, x1: number, y: number, on: boolean, a: number) => {
    ctx.save();
    ctx.globalAlpha = a;
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = on ? P.red : P.dead;
    ctx.beginPath();
    for (let x = x0; x <= x1; x += 1) {
      let dy = 0;
      if (on) {
        const ph = (x - x0 + T * 40) % 34;
        dy = ph > 14 && ph < 17 ? -8 : ph >= 17 && ph < 20 ? 5 : 0;
      }
      if (x === x0) ctx.moveTo(x, y + dy);
      else ctx.lineTo(x, y + dy);
    }
    ctx.stroke();
    ctx.restore();
  };

  const drawCard = (i: number, a: number) => {
    const on = isRunning(T, i);
    const y = rowC(i) - CARD_H / 2;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = on ? P.paper : P.off;
    ctx.fillRect(CARD_X, y, CARD_W, CARD_H);
    ctx.strokeStyle = on ? P.ink : P.dead;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(CARD_X, y, CARD_W, CARD_H);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 9px ${P.mono}`;
    ctx.fillStyle = on ? P.ink : P.faint;
    ctx.fillText(TX.procs[i], CARD_X + 8, y + 14);
    ctx.font = `700 7px ${P.mono}`;
    ctx.fillStyle = on ? P.faint : P.red;
    ctx.fillText(on ? TX.running : TX.stopped, CARD_X + 8, y + 29);
    ctx.restore();
    pulseLine(CARD_X + 58, CARD_X + CARD_W - 8, y + 22, on, a);
  };

  const drawBefore = (a: number) => {
    ctx.save();
    ctx.globalAlpha = a;
    // the company
    ctx.strokeStyle = P.ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(FX, FY, WALL0 - FX, FH);
    ctx.font = `700 7px ${P.mono}`;
    ctx.fillStyle = P.faint;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(TX.company, (FX + WALL0) / 2, FY + FH - 11);
    for (let i = 0; i < 4; i++) {
      const cy = rowC(i);
      const pull = ease(cl((T - evT(i) - PULL_AT) / PULL));
      const on = isRunning(T, i);
      // inside cable (card → the socket in the wall)
      ctx.strokeStyle = on ? P.ink : P.dead;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CARD_X + CARD_W, cy);
      ctx.lineTo(WALL0, cy);
      ctx.stroke();
      ctx.fillStyle = P.ink;
      ctx.fillRect(WALL0 - 3, cy - 7, 6, 14); // the socket
      // the vendor
      ctx.fillStyle = P.paper;
      ctx.fillRect(VX, cy - VH / 2, VW, VH);
      ctx.strokeStyle = P.faint;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(VX, cy - VH / 2, VW, VH);
      ctx.setLineDash([]);
      ctx.fillStyle = P.ink;
      ctx.font = `700 8px ${P.mono}`;
      ctx.fillText(TX.vendors[i], VX + VW / 2, cy - 4);
      ctx.fillStyle = P.faint;
      ctx.font = `700 6px ${P.mono}`;
      ctx.fillText(TX.rented, VX + VW / 2, cy + 7);
      // outside cable: the vendor pulls, the plug leaves the socket
      const px = lerp(WALL0 + 3, VX, pull);
      if (px < VX - 0.5) {
        ctx.strokeStyle = P.ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, cy);
        ctx.lineTo(VX, cy);
        ctx.stroke();
        ctx.fillStyle = P.ink;
        ctx.fillRect(px, cy - 4, 7, 8);
      }
      if (pull > 0 && pull < 1) {
        ctx.save();
        ctx.globalAlpha = a * (1 - pull);
        ctx.strokeStyle = P.red;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(WALL0 + 6, cy - 6);
        ctx.lineTo(WALL0 + 12, cy - 10);
        ctx.moveTo(WALL0 + 6, cy + 6);
        ctx.lineTo(WALL0 + 12, cy + 10);
        ctx.stroke();
        ctx.restore();
      }
      // the notice
      const na = cl((T - evT(i)) / 0.25) * (1 - cl((T - stopT(i) - 0.3) / 0.4));
      if (na > 0) {
        ctx.save();
        ctx.globalAlpha = a * na;
        const s = 0.8 + 0.2 * ease(cl((T - evT(i)) / 0.25));
        ctx.translate(VX + VW / 2, cy - VH / 2 - 9);
        ctx.scale(s, s);
        ctx.font = `700 6.5px ${P.mono}`;
        const nw = Math.min(ctx.measureText(TX.notices[i]).width + 10, 118);
        ctx.fillStyle = P.red;
        ctx.fillRect(-nw / 2, -6, nw, 12);
        ctx.fillStyle = P.paper;
        ctx.textAlign = 'center';
        ctx.fillText(TX.notices[i], 0, 0.5);
        ctx.restore();
      }
    }
    ctx.restore();
    for (let k = 0; k < 4; k++) drawCard(k, a);
  };

  const drawAfter = (a: number) => {
    const wall = lerp(WALL0, WALL1, ease(cl((T - T_WALL) / WALL_DUR)));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.strokeStyle = P.ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(FX, FY, wall - FX, FH);
    ctx.font = `700 7px ${P.mono}`;
    ctx.fillStyle = P.faint;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(TX.company, (FX + wall) / 2, FY + FH - 11);
    for (let i = 0; i < 4; i++) {
      const cy = rowC(i);
      const t0 = builtT(i);
      const d = ease(cl((T - t0) / 0.5));
      const g = cl((T - t0 - 0.5) / 0.4);
      const on = isRunning(T, i);
      if (T < t0) continue;
      const BX = 176;
      const BW = 106;
      const bx = lerp(BX + 60, BX, d);
      ctx.save();
      ctx.globalAlpha = a * Math.min(1, d * 2);
      ctx.strokeStyle = on ? P.ink : P.dead;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(CARD_X + CARD_W, cy);
      ctx.lineTo(bx, cy);
      ctx.stroke();
      ctx.fillStyle = P.mix(g);
      ctx.fillRect(bx, cy - 15, BW, 30);
      ctx.fillStyle = P.paper;
      ctx.font = `700 7.5px ${P.mono}`;
      ctx.textAlign = 'center';
      ctx.fillText(`${TX.sys} · ${TX.procs[i]}`, bx + BW / 2, cy + 0.5);
      // its own socket
      const tagA = cl((T - t0 - 0.6) / 0.3);
      ctx.globalAlpha = a * tagA;
      ctx.strokeStyle = P.red;
      ctx.lineWidth = 1.2;
      const tw = WALL1 - 12 - (BX + BW + 10);
      const tx = bx + BW + 10;
      ctx.strokeRect(tx, cy - 7, tw, 14);
      ctx.fillStyle = P.redInk;
      const yz = fitFont(TX.yours, tw - 8, 7, 5, '700');
      ctx.font = `700 ${yz}px ${P.mono}`;
      ctx.textAlign = 'center';
      ctx.fillText(TX.yours, tx + tw / 2, cy + 0.5);
      ctx.restore();
    }
    // the notices drop and bounce on the company's roof, in the message's order;
    // they settle on the roof and clear just before the close
    ctx.font = `700 6.5px ${P.mono}`;
    const NW = ORDER.map((p) => ctx.measureText(TX.notices[p]).width + 10);
    const GAPN = (WALL1 - FX - NW.reduce((x, y) => x + y, 0)) / 5;
    const NX: number[] = [];
    let acc = FX + GAPN;
    NW.forEach((w) => {
      NX.push(acc + w / 2);
      acc += w + GAPN;
    });
    const nOut = 1 - cl((T - (T_CAP - 0.8)) / 0.4);
    for (let n = 0; n < 4; n++) {
      const t = T - (T_N0 + n * NST);
      if (t < 0) continue;
      const al = nOut;
      const txt = TX.notices[ORDER[n]];
      let y: number;
      if (t < 0.45) y = lerp(-12, FY - 15, ease(t / 0.45));
      else {
        const b = t - 0.45;
        y = FY - 15 - 16 * Math.abs(Math.sin((b * Math.PI) / 0.4)) * Math.exp(-b * 5);
      }
      if (al <= 0) continue;
      ctx.save();
      ctx.globalAlpha = a * al;
      ctx.font = `700 6.5px ${P.mono}`;
      const nw = NW[n];
      ctx.fillStyle = P.paper;
      ctx.fillRect(NX[n] - nw / 2, y - 6, nw, 12);
      ctx.strokeStyle = P.red;
      ctx.lineWidth = 1;
      ctx.strokeRect(NX[n] - nw / 2, y - 6, nw, 12);
      ctx.fillStyle = P.redInk;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, NX[n], y + 0.5);
      ctx.restore();
    }
    ctx.restore();
    for (let k = 0; k < 4; k++) drawCard(k, a);
  };

  const hud = (a: number) => {
    let owned = 0;
    let live = 0;
    for (let i = 0; i < 4; i++) {
      if (isRunning(T, i)) live++;
      if (T >= T_A && T >= builtT(i) + 0.5) owned++;
    }
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textBaseline = 'alphabetic';
    const hs = fitFont(`${TX.owned}  0/4${TX.live}  0/4`, 320 - 24, 9, 6, '700');
    ctx.font = `700 ${hs}px ${P.mono}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = owned > 0 ? P.redInk : P.faint;
    ctx.fillText(`${TX.owned}  ${owned}/4`, FX, HUDY);
    ctx.textAlign = 'right';
    ctx.fillStyle = live < 4 ? P.red : T >= T_A ? P.redInk : P.faint;
    ctx.fillText(`${TX.live}  ${live}/4`, WALL1, HUDY);
    ctx.restore();
  };

  const strip = (a: number) => {
    const N = 60;
    const cw = (WALL1 - FX) / N;
    const after = T >= T_A;
    const m = after ? BMONTHS + Math.max(0, Math.floor((T - T_A) / MPM)) : Math.min(BMONTHS, Math.floor(T / MPM) + 1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textBaseline = 'alphabetic';
    ctx.font = `700 8px ${P.mono}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = after ? P.faint : P.redInk;
    ctx.fillText(after ? `${TX.month}  ${m}` : `${TX.rentMonths}  ${m < 10 ? '0' : ''}${m}`, FX, STRIPY - 6);
    if (after) {
      ctx.textAlign = 'right';
      ctx.fillStyle = P.redInk;
      ctx.fillText(`${TX.rent0}  0`, WALL1, STRIPY - 6);
    }
    for (let k = 0; k < N; k++) {
      const x = FX + k * cw;
      ctx.fillStyle = k < Math.min(m, BMONTHS) ? P.red : k < m ? P.ink : P.track;
      ctx.fillRect(x + 0.5, STRIPY, cw - 1, 8);
    }
    ctx.restore();
  };

  ctx.save();
  ctx.fillStyle = P.paper;
  ctx.fillRect(0, 0, W, H);
  if (T < T_B_END + FADE) {
    const a = (1 - cl((T - T_B_END) / FADE)) * cl(T / 0.3);
    drawBefore(a);
    hud(a);
    strip(a);
  }
  if (T >= T_MSG && T < MSG_OUT + MSG_FADE) {
    const out = 1 - cl((T - MSG_OUT) / MSG_FADE);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const longest = TX.msg.reduce((x, y) => (y.length > x.length ? y : x));
    const mz = fitFont(longest, 340, 26, 12, '900');
    ctx.font = `900 ${mz}px ${P.disp}`;
    const LH = mz * 1.12;
    const GAP = mz * 0.5;
    const y0 = 250 - (TX.msg.length * LH + GAP) / 2 + LH / 2;
    TX.msg.forEach((line, k) => {
      const ai = cl((T - T_MSG - MSG_AT[k]) / 0.35) * out;
      const dy = (1 - ease(cl((T - T_MSG - MSG_AT[k]) / 0.35))) * 6;
      ctx.globalAlpha = ai;
      ctx.fillStyle = k < 2 ? P.ink : P.red;
      ctx.fillText(line, 200, y0 + k * LH + (k >= 2 ? GAP : 0) + dy);
    });
    ctx.restore();
  }
  if (T >= T_A) {
    const b = cl((T - T_A) / 0.5);
    const so = 1 - cl((T - T_CAP + 0.4) / 0.4);
    drawAfter(b);
    hud(b);
    strip(b * so);
  }
  if (T >= T_CAP) {
    const c1 = cl((T - T_CAP) / 0.4);
    const c2 = cl((T - T_CAP - CAP2) / 0.4);
    const c3 = cl((T - T_CAP - 2 * CAP2) / 0.4);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fz = fitFont(TX.c1.length > TX.c2.length ? TX.c1 : TX.c2, 320, 22, 12, '900');
    ctx.font = `900 ${fz}px ${P.disp}`;
    ctx.globalAlpha = c1;
    ctx.fillStyle = P.redInk;
    ctx.fillText(TX.c1, 200, STRIPY + 2);
    ctx.globalAlpha = c2;
    ctx.fillStyle = P.ink;
    ctx.fillText(TX.c2, 200, STRIPY + 2 + fz * 1.15);
    ctx.globalAlpha = c3;
    ctx.fillStyle = P.muted;
    ctx.font = `400 10px ${P.body}`;
    TX.c3.forEach((l, k) => ctx.fillText(l, 200, STRIPY + 2 + fz * 1.15 + fz * 0.95 + k * 14));
    ctx.restore();
  }
  ctx.restore();
}

/* ---------- Server side: the last frame, through ./story-svg-recorder.ts ---------- */

const pct = (f: number) => Math.round(f * 10000) / 100;
const SERVER_PALETTE: Palette = {
  ...(Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, `var(${v})`])) as Record<Role, string>),
  mix: (f) =>
    f <= 0 ? `var(${ROLES.red})` : f >= 1 ? `var(${ROLES.ink})` : `color-mix(in srgb, var(${ROLES.red}) ${pct(1 - f)}%, var(${ROLES.ink}))`,
};

/** The last frame, still, as SVG — the ground floor of pair 3. */
export function plugsFinalMarkup(lang: Lang = 'en'): string {
  const ctx = new SvgCtx({ idPrefix: 'pv-plugs-clip' });
  drawPlugs(ctx, PLUGS_END, SERVER_PALETTE, lang);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false" width="100%" height="100%" data-pv-plugs-still>${ctx}</svg>`;
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

export interface Plugs {
  /** Seconds of the timeline (the same in both languages). */
  end: number;
  /** Paint instant `T` (seconds) still. */
  paint(T: number): void;
  /** Play the timeline from 0 to its end, then hold the last frame. */
  play(): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createPlugs(host: HTMLElement): Plugs {
  const held = [...host.childNodes];
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.dataset.pvPlugs = '';
  // Its box (4:5, contained and centred in the host) is the host's CSS; the bitmap follows it.
  host.replaceChildren(cv);
  const ctx = cv.getContext('2d')!;
  const lang: Lang = host.closest('[lang]')?.getAttribute('lang') === 'es' ? 'es' : 'en';
  cv.dataset.pvLang = lang; // which words it draws, readable from outside
  const css = getComputedStyle(host);
  const tok = Object.fromEntries(Object.entries(ROLES).map(([k, v]) => [k, css.getPropertyValue(v).trim()])) as Record<Role, string>;
  const red = rgbOf(tok.red);
  const ink = rgbOf(tok.ink);
  const P: Palette = {
    ...tok,
    mix: (f) => `rgb(${red.map((v, i) => Math.round(lerp(v, ink[i], f))).join(',')})`,
  };

  let T = 0;
  let raf = 0;
  let scale = 1;
  const render = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawPlugs(ctx, T, P, lang);
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
    .then(() => document.fonts.load(`400 10px ${P.body}`))
    .then(render, () => {});

  return {
    end: PLUGS_END,
    paint(t) {
      cancelAnimationFrame(raf);
      T = t;
      render();
    },
    play() {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const loop = (now: number) => {
        T = Math.min((now - start) / 1000, PLUGS_END);
        render();
        if (T < PLUGS_END) raf = requestAnimationFrame(loop);
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
