/**
 * T2 · the drawings — PROVISIONAL, to be replaced by video.
 *
 * The whole visual of the four problem → way-out pairs lives in this one module
 * and talks to the rest of the page through two entry points only:
 *
 *   storyDrawingMarkup(pair?, m?)  → static markup for the ground floor (SSR,
 *                                    no JavaScript): pair `pair` at morph `m`.
 *   createStoryDrawing(host)       → a live drawing mounted in `host`, with
 *                                    `paint(pair, m, t)` and `destroy()`.
 *
 *   pair  0..3  which pair is on screen
 *   m     0..1  0 = the chaos of the problem, 1 = the order of the way out
 *   t     0..1  a free-running clock (the scroll progress) for the jitter
 *
 * The text, the pin and the scroll know nothing else about it. Swapping it for
 * video means rewriting this file behind the same two functions — e.g. four
 * <video>s, `paint` showing video `pair` and seeking it to `m * duration`, the
 * markup being a poster frame — and touching nothing outside it.
 *
 * Ported from the mock-up (docs/design/portada-nueva/portada-aglaya.html, "T2 ·
 * Cuatro parejas"). Colours and type are the canon's tokens, written as inline
 * `style` so the module carries no stylesheet of its own.
 */

/** The little of the DOM the scenes use — real SVG elements, or the SSR stand-in below. */
interface El {
  setAttribute(name: string, value: string | number): void;
  appendChild(child: El): unknown;
  textContent: string | null;
  style: { setProperty(name: string, value: string): void };
}
type Make = (tag: string, attrs?: Record<string, string | number>, parent?: El) => El;
type Scene = (m: number, t: number) => void;

export const STORY_PAIRS = 4;

/* Token roles. Names, never values. */
const INK = 'var(--color-text)';
const PAPER = 'var(--color-bg)';
const PAPER_2 = 'var(--color-surface-3)';
const SOFT = 'var(--color-border-strong)';
const FAINT = 'var(--color-faint)';
const RED = 'var(--color-brand)';
const RED_INK = 'var(--color-brand-dark)';
const MONO = 'var(--font-mono)';
const DISP = 'var(--font-display)';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const tr = (el: El, x: number, y: number, extra = '') =>
  el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${extra}`);
const paint = (el: El, props: Record<string, string>) => {
  for (const k in props) el.style.setProperty(k, props[k]);
};

/** Builds the four scenes into `svg`. Deterministic: same positions on the server and in the browser. */
function build(mk: Make, svg: El) {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const text = (parent: El, attrs: Record<string, string | number>, font: string, fill: string, content: string) => {
    const t = mk('text', attrs, parent);
    paint(t, { 'font-family': font, fill });
    t.textContent = content;
    return t;
  };
  const core = (parent: El) => {
    const g = mk('g', {}, parent);
    paint(mk('rect', { x: -40, y: -32, width: 80, height: 64 }, g), { fill: INK });
    text(g, { y: -3, 'text-anchor': 'middle', 'font-weight': 900, 'font-size': 12 }, DISP, PAPER, 'YOUR');
    text(g, { y: 12, 'text-anchor': 'middle', 'font-weight': 900, 'font-size': 12 }, DISP, PAPER, 'COMPANY');
    return g;
  };

  const groups = [0, 1, 2, 3].map(() => {
    const g = mk('g', {}, svg);
    paint(g, { opacity: '0', transition: 'opacity .45s' });
    return g;
  });

  /* V0 · noise → the ones that matter */
  const v0: Scene = (() => {
    const G = groups[0];
    const words = ['CHATGPT', 'COPILOT', 'AGENTS', 'RAG', 'AUTOMATION', 'GEMINI', 'CHATBOTS', 'N8N', 'LLM', 'PROMPTS', 'ZAPIER', 'AI CRM', 'VECTOR DB', 'MIDJOURNEY', 'ASSISTANTS', 'PLUGINS'];
    const keep: Record<number, number> = { 1: 0, 2: 1, 4: 2 };
    const items = words.map((w, i) => {
      let x: number, y: number;
      do {
        x = 45 + rnd() * 310;
        y = 30 + rnd() * 340;
      } while (Math.abs(x - 200) < 80 && Math.abs(y - 200) < 52);
      const g = mk('g', {}, G);
      const w0 = w.length * 6.6 + 14;
      const box = mk('rect', { y: -11, height: 22 }, g);
      paint(box, { fill: PAPER });
      text(g, { y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 }, MONO, INK, w);
      const ok = text(g, { x: -72, y: 4, 'font-size': 11, 'font-weight': 700, opacity: 0 }, MONO, RED, 'OK');
      return { g, box, ok, w0, x, y, ph: rnd() * 6.28, k: keep[i] as number | undefined };
    });
    const c = core(G);
    const cap = text(G, { x: 200, y: 372, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, 'letter-spacing': 1.5, opacity: 0 }, MONO, RED_INK, '3 THAT FIT HOW YOU WORK');
    return (m, P) => {
      tr(c, 200, lerp(200, 90, m));
      for (const it of items) {
        const j = 1 - m;
        const jx = Math.sin(P * 70 + it.ph) * 7 * j;
        const jy = Math.cos(P * 60 + it.ph) * 6 * j;
        if (it.k !== undefined) {
          const w = lerp(it.w0, 170, m);
          tr(it.g, lerp(it.x, 200, m) + jx, lerp(it.y, 175 + it.k * 58, m) + jy);
          it.box.setAttribute('x', -w / 2);
          it.box.setAttribute('width', w);
          paint(it.box, { stroke: m > 0.5 ? RED : SOFT, 'stroke-width': m > 0.5 ? '2' : '1' });
          it.ok.setAttribute('opacity', clamp((m - 0.6) / 0.4));
          it.g.setAttribute('opacity', 1);
        } else {
          tr(it.g, it.x + jx + (it.x - 200) * m * 0.3, it.y + jy + (it.y - 200) * m * 0.3, ` scale(${(1 - m * 0.4).toFixed(3)})`);
          it.box.setAttribute('x', -it.w0 / 2);
          it.box.setAttribute('width', it.w0);
          paint(it.box, { stroke: SOFT, 'stroke-width': '1' });
          it.g.setAttribute('opacity', (1 - m).toFixed(3));
        }
      }
      cap.setAttribute('opacity', clamp((m - 0.6) / 0.4));
    };
  })();

  /* V1 · buying at random → start where it pays */
  const v1: Scene = (() => {
    const G = groups[1];
    const H = [40, 62, 30, 200, 52, 34, 74, 46];
    const base = 330;
    const baseLine = mk('line', { x1: 50, y1: base, x2: 350, y2: base, 'stroke-width': 1.5, opacity: 0 }, G);
    paint(baseLine, { stroke: INK });
    const bars = H.map((h, i) => {
      const red = i === 3;
      const g = mk('g', {}, G);
      const r = mk('rect', { 'stroke-width': 1.5 }, g);
      paint(r, { stroke: red ? RED : INK });
      const t = text(g, { 'text-anchor': 'middle', 'font-size': 9, 'font-weight': 700 }, MONO, red ? PAPER : INK, '$ LICENCE');
      const u = text(g, { 'text-anchor': 'middle', 'font-size': 8, 'letter-spacing': 1 }, MONO, FAINT, 'UNUSED');
      return { r, t, u, h, red, sx: 50 + rnd() * 240, sy: 40 + rnd() * 250, rot: (rnd() - 0.5) * 40, ph: rnd() * 6.28, bx: 62 + i * 36 };
    });
    const here = text(G, { x: 62 + 3 * 36 + 14, y: base - 210, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, 'letter-spacing': 1.5, opacity: 0 }, MONO, RED_INK, 'START HERE');
    const cap = text(G, { x: 200, y: 360, 'text-anchor': 'middle', 'font-size': 10, 'letter-spacing': 1.5, opacity: 0 }, MONO, FAINT, 'HOURS SAVED PER WEEK, BY TASK');
    return (m, P) => {
      baseLine.setAttribute('opacity', m);
      here.setAttribute('opacity', clamp((m - 0.6) / 0.4));
      cap.setAttribute('opacity', clamp((m - 0.6) / 0.4));
      for (const b of bars) {
        const j = 1 - m;
        const jx = Math.sin(P * 50 + b.ph) * 5 * j;
        const jy = Math.cos(P * 44 + b.ph) * 5 * j;
        const w = lerp(76, 28, m);
        const h = lerp(30, b.h, m);
        const cx = lerp(b.sx + 38, b.bx + 14, m) + jx;
        const bottom = lerp(b.sy + 30, base, m) + jy;
        const rot = `rotate(${(b.rot * (1 - m)).toFixed(1)} ${cx.toFixed(1)} ${(bottom - h / 2).toFixed(1)})`;
        b.r.setAttribute('x', (cx - w / 2).toFixed(1));
        b.r.setAttribute('y', (bottom - h).toFixed(1));
        b.r.setAttribute('width', w.toFixed(1));
        b.r.setAttribute('height', h.toFixed(1));
        b.r.setAttribute('transform', rot);
        paint(b.r, { fill: b.red ? RED : m > 0.5 ? PAPER_2 : PAPER });
        b.t.setAttribute('x', cx.toFixed(1));
        b.t.setAttribute('y', (bottom - 12).toFixed(1));
        b.t.setAttribute('opacity', (1 - m).toFixed(3));
        b.t.setAttribute('transform', rot);
        b.u.setAttribute('x', cx.toFixed(1));
        b.u.setAttribute('y', (bottom + 14).toFixed(1));
        b.u.setAttribute('opacity', ((1 - m) * (b.red ? 0 : 1)).toFixed(3));
      }
    };
  })();

  /* V2 · rented → yours */
  const v2: Scene = (() => {
    const G = groups[2];
    const frame = mk('rect', { x: 78, y: 78, width: 244, height: 244, 'stroke-width': 3, opacity: 0 }, G);
    paint(frame, { fill: 'none', stroke: RED });
    const lbl = text(G, { x: 84, y: 72, 'font-size': 9, 'letter-spacing': 2, opacity: 0 }, MONO, RED_INK, 'OWNED BY YOU');
    const linesG = mk('g', {}, G);
    const toolsG = mk('g', {}, G);
    const c = core(G);
    tr(c, 200, 200);
    const tools = ['CRM', 'EMAIL', 'SALES', 'DATA', 'AI'].map((n, i) => {
      const line = mk('line', { x1: 200, y1: 200, 'stroke-width': 1.5 }, linesG);
      const g = mk('g', {}, toolsG);
      const box = mk('rect', { x: -30, y: -16, width: 60, height: 32, 'stroke-width': 1.5 }, g);
      paint(box, { stroke: INK });
      const t = text(g, { y: 4, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700 }, MONO, INK, n);
      const tag = text(g, { y: 30, 'text-anchor': 'middle', 'font-size': 8, 'letter-spacing': 1.5 }, MONO, FAINT, '');
      return { a: ((-90 + i * 72) * Math.PI) / 180, line, g, box, t, tag };
    });
    return (m, P) => {
      const r = 160 - 70 * m;
      const owned = m > 0.5;
      const spin = P * 2.2 * (1 - m);
      frame.setAttribute('opacity', m);
      lbl.setAttribute('opacity', m);
      for (const o of tools) {
        const a = o.a + spin;
        const x = 200 + Math.cos(a) * r;
        const y = 200 + Math.sin(a) * r;
        tr(o.g, x, y);
        o.line.setAttribute('x2', x.toFixed(1));
        o.line.setAttribute('y2', y.toFixed(1));
        paint(o.line, { stroke: owned ? RED : SOFT, 'stroke-dasharray': owned ? '0' : '5 5' });
        paint(o.box, { fill: owned ? INK : PAPER });
        paint(o.t, { fill: owned ? PAPER : INK });
        o.tag.textContent = owned ? 'YOURS' : 'RENTED';
        paint(o.tag, { fill: owned ? RED_INK : FAINT });
      }
    };
  })();

  /* V3 · your data teaches them → your data stays home */
  const v3: Scene = (() => {
    const G = groups[3];
    const home = mk('rect', { x: 95, y: 95, width: 210, height: 210, 'stroke-width': 3, opacity: 0 }, G);
    paint(home, { fill: 'none', stroke: RED });
    const homeL = text(G, { x: 101, y: 89, 'font-size': 9, 'letter-spacing': 2, opacity: 0 }, MONO, RED_INK, 'YOUR SERVERS');
    const clouds = [[325, 80], [345, 200], [325, 320]].map(([x, y]) => {
      const line = mk('line', { x1: 200, y1: 200, x2: x, y2: y }, G);
      paint(line, { stroke: SOFT, 'stroke-dasharray': '4 4' });
      const g = mk('g', {}, G);
      tr(g, x, y);
      paint(mk('rect', { x: -38, y: -15, width: 76, height: 30, 'stroke-width': 1.5 }, g), { fill: PAPER, stroke: INK });
      text(g, { y: 4, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, 'letter-spacing': 1 }, MONO, INK, 'THEIR CLOUD');
      return { line, g, x, y };
    });
    const dots: El[] = [];
    for (let k = 0; k < 15; k++) {
      const d = mk('rect', { width: 7, height: 7 }, G);
      paint(d, { fill: RED });
      dots.push(d);
    }
    const c = core(G);
    tr(c, 200, 200);
    return (m, P) => {
      home.setAttribute('opacity', m);
      homeL.setAttribute('opacity', m);
      for (const cl of clouds) {
        cl.g.setAttribute('opacity', (1 - m * 0.85).toFixed(3));
        cl.line.setAttribute('opacity', (1 - m).toFixed(3));
      }
      dots.forEach((d, k) => {
        const cl = clouds[k % 3];
        const f = (P * 14 + k / 15) % 1;
        const fx = lerp(200, cl.x, f);
        const fy = lerp(200, cl.y, f);
        const a = (k / 15) * Math.PI * 2 + P * 5;
        const ox = 200 + Math.cos(a) * 72;
        const oy = 200 + Math.sin(a) * 72;
        d.setAttribute('x', (lerp(fx, ox, m) - 3.5).toFixed(1));
        d.setAttribute('y', (lerp(fy, oy, m) - 3.5).toFixed(1));
      });
    };
  })();

  const scenes = [v0, v1, v2, v3];
  return (pair: number, m: number, t: number) => {
    const i = Math.max(0, Math.min(STORY_PAIRS - 1, Math.floor(pair)));
    groups.forEach((g, k) => paint(g, { opacity: k === i ? '1' : '0' }));
    scenes[i](ease(clamp(m)), t);
  };
}

/* ---------- Server side: a stand-in DOM that prints itself ---------- */

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

class StaticEl implements El {
  private attrs = new Map<string, string>();
  private css = new Map<string, string>();
  private kids: StaticEl[] = [];
  textContent: string | null = null;
  style = { setProperty: (k: string, v: string) => void this.css.set(k, v) };
  constructor(private tag: string) {}
  setAttribute(k: string, v: string | number) {
    this.attrs.set(k, String(v));
  }
  appendChild(child: El) {
    this.kids.push(child as StaticEl);
    return child;
  }
  toString(): string {
    const attrs = [...this.attrs].map(([k, v]) => ` ${k}="${escape(v)}"`).join('');
    const css = this.css.size ? ` style="${escape([...this.css].map(([k, v]) => `${k}:${v}`).join(';'))}"` : '';
    const inner = this.textContent != null ? escape(this.textContent) : this.kids.join('');
    return `<${this.tag}${attrs}${css}>${inner}</${this.tag}>`;
  }
}

// Square scenes on the 4:5 stage: centred in the extra height, never stretched.
const SVG_ATTRS = { viewBox: '0 0 400 400', preserveAspectRatio: 'xMidYMid meet', 'aria-hidden': 'true', focusable: 'false', width: '100%', height: '100%' };

/**
 * Static SVG of pair `pair` at morph `m` — the ground floor. Defaults to the
 * mock-up's still frame: the last pair, in order. Every scene is painted at
 * `m` too, as the mock-up does, so a scene switched on later is not blank.
 */
export function storyDrawingMarkup(pair = STORY_PAIRS - 1, m = 1): string {
  const mk: Make = (tag, attrs = {}, parent) => {
    const el = new StaticEl(tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    parent?.appendChild(el);
    return el;
  };
  const svg = mk('svg', { xmlns: 'http://www.w3.org/2000/svg', ...SVG_ATTRS });
  const draw = build(mk, svg);
  for (let i = 0; i < STORY_PAIRS; i++) draw(i, m, 0);
  draw(pair, m, 0);
  return String(svg);
}

/* ---------- Browser side ---------- */

export interface StoryDrawing {
  /** Paint pair `pair` (0..3) at morph `m` (0 chaos → 1 order); `t` (0..1) drives the jitter. */
  paint(pair: number, m: number, t?: number): void;
  /** Put back whatever `host` held before (the ground-floor frame). */
  destroy(): void;
}

export function createStoryDrawing(host: HTMLElement): StoryDrawing {
  const before = [...host.childNodes];
  const NS = 'http://www.w3.org/2000/svg';
  const mk: Make = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag) as unknown as El;
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    parent?.appendChild(el);
    return el;
  };
  const svg = mk('svg', SVG_ATTRS);
  const draw = build(mk, svg);
  host.replaceChildren(svg as unknown as Node);
  return {
    paint: (pair, m, t = 0) => draw(pair, m, t),
    destroy: () => host.replaceChildren(...before),
  };
}
