/**
 * T2 · the recorder shared by the canvas drawings of the stage (./story-tetris.ts,
 * ./story-heatmap.ts). Each drawing is one deterministic `draw(ctx, T)` that only
 * talks to `Ctx` — a small subset of the Canvas 2D API — so the same code paints
 * a real <canvas> in the browser and, on the server, this recorder, which writes
 * what it is told as SVG: the drawing's last frame, still, for the ground floor
 * (no JavaScript), reduced motion and phones.
 *
 * Moved here unchanged from ./story-tetris.ts when pair 2 got its own canvas
 * drawing; the Tetris's still frame is byte-for-byte what it was. Two things can
 * now be chosen per drawing, both defaulting to what the Tetris always used:
 * the prefix of the clip ids (two drawings' frames share one page), and how text
 * is measured (`measure` below, or a better one where a drawing's layout hangs
 * on the width of a proportional line).
 *
 * Server-side only in practice: the browser imports the drawings' canvas half,
 * never this class.
 */

/** The part of CanvasRenderingContext2D the drawings use — a real canvas, or the SVG recorder below. */
export interface Ctx {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  globalAlpha: number;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  rotate(a: number): void;
  scale(x: number, y: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  beginPath(): void;
  rect(x: number, y: number, w: number, h: number): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  fill(): void;
  stroke(): void;
  clip(): void;
  setLineDash(d: number[]): void;
  fillText(t: string, x: number, y: number): void;
  measureText(t: string): { width: number };
}

/** A text width for a canvas `font` string («<weight> <size>px <family>»). */
export type Measure = (font: string, text: string) => number;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v: number) => String(Math.round(v * 100) / 100);

/**
 * Text widths without a browser. Space Mono is monospaced (advance 0.612 em), so
 * its widths are exact; the other two families only ever ask "does it fit?" on
 * the Tetris's last frame, where an estimate on the generous side gives the
 * canvas's answer (checked by tests/e2e/preview-home.spec.ts against the real canvas).
 */
export const measure: Measure = (font, text) => {
  const m = /^\S+ ([\d.]+)px (.+)$/.exec(font);
  const size = m ? +m[1] : 10;
  const per = m && m[2].includes('mono') ? 0.612 : 0.62;
  return text.length * per * size;
};

export class SvgCtx implements Ctx {
  fillStyle = '';
  strokeStyle = '';
  lineWidth = 1;
  globalAlpha = 1;
  font = '10px sans-serif';
  textAlign: CanvasTextAlign = 'start';
  textBaseline: CanvasTextBaseline = 'alphabetic';
  private out: string[] = [];
  private path: string[] = [];
  private dash: number[] = [];
  private m = [1, 0, 0, 1, 0, 0];
  private stack: { m: number[]; groups: number; state: Record<string, unknown> }[] = [];
  private groups = 0;
  private clips = 0;
  private defs: string[] = [];
  private readonly idPrefix: string;
  private readonly measureWith: Measure;

  constructor(opts: { idPrefix?: string; measure?: Measure } = {}) {
    this.idPrefix = opts.idPrefix ?? 'pv-tetris-clip';
    this.measureWith = opts.measure ?? measure;
  }

  private tf() {
    const [a, b, c, d, e, f] = this.m;
    return a === 1 && b === 0 && c === 0 && d === 1 && e === 0 && f === 0 ? '' : ` transform="matrix(${[a, b, c, d, e, f].map(n).join(' ')})"`;
  }
  private alpha() {
    return this.globalAlpha < 1 ? ` opacity="${n(this.globalAlpha)}"` : '';
  }
  private paintStyle(kind: 'fill' | 'stroke') {
    if (kind === 'fill') return ` style="fill:${this.fillStyle}"`;
    const dash = this.dash.length ? `;stroke-dasharray:${this.dash.join(' ')}` : '';
    return ` style="fill:none;stroke:${this.strokeStyle};stroke-width:${n(this.lineWidth)}${dash}"`;
  }
  save() {
    this.stack.push({
      m: [...this.m],
      groups: this.groups,
      state: { fillStyle: this.fillStyle, strokeStyle: this.strokeStyle, lineWidth: this.lineWidth, globalAlpha: this.globalAlpha, font: this.font, textAlign: this.textAlign, textBaseline: this.textBaseline, dash: this.dash },
    });
    this.groups = 0;
  }
  restore() {
    const s = this.stack.pop();
    if (!s) return;
    for (; this.groups > 0; this.groups--) this.out.push('</g>');
    this.groups = s.groups;
    this.m = s.m;
    Object.assign(this, s.state);
  }
  translate(x: number, y: number) {
    const [a, b, c, d, e, f] = this.m;
    this.m = [a, b, c, d, a * x + c * y + e, b * x + d * y + f];
  }
  rotate(r: number) {
    const [a, b, c, d, e, f] = this.m;
    const cs = Math.cos(r);
    const sn = Math.sin(r);
    this.m = [a * cs + c * sn, b * cs + d * sn, c * cs - a * sn, d * cs - b * sn, e, f];
  }
  scale(x: number, y: number) {
    const [a, b, c, d, e, f] = this.m;
    this.m = [a * x, b * x, c * y, d * y, e, f];
  }
  fillRect(x: number, y: number, w: number, h: number) {
    if (this.globalAlpha <= 0) return;
    this.out.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${this.tf()}${this.alpha()}${this.paintStyle('fill')}/>`);
  }
  strokeRect(x: number, y: number, w: number, h: number) {
    if (this.globalAlpha <= 0) return;
    this.out.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${this.tf()}${this.alpha()}${this.paintStyle('stroke')}/>`);
  }
  beginPath() {
    this.path = [];
  }
  rect(x: number, y: number, w: number, h: number) {
    this.path.push(`M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`);
  }
  moveTo(x: number, y: number) {
    this.path.push(`M${n(x)} ${n(y)}`);
  }
  lineTo(x: number, y: number) {
    this.path.push(`L${n(x)} ${n(y)}`);
  }
  fill() {
    if (this.globalAlpha <= 0 || !this.path.length) return;
    this.out.push(`<path d="${this.path.join('')}"${this.tf()}${this.alpha()}${this.paintStyle('fill')}/>`);
  }
  stroke() {
    if (this.globalAlpha <= 0 || !this.path.length) return;
    this.out.push(`<path d="${this.path.join('')}"${this.tf()}${this.alpha()}${this.paintStyle('stroke')}/>`);
  }
  clip() {
    const id = `${this.idPrefix}-${this.clips++}`;
    this.defs.push(`<clipPath id="${id}"><path d="${this.path.join('')}"${this.tf()}/></clipPath>`);
    this.out.push(`<g clip-path="url(#${id})">`);
    this.groups++;
  }
  setLineDash(d: number[]) {
    this.dash = d;
  }
  fillText(t: string, x: number, y: number) {
    if (this.globalAlpha <= 0) return;
    const m = /^(\S+) ([\d.]+)px (.+)$/.exec(this.font);
    const anchor = this.textAlign === 'center' ? 'middle' : this.textAlign === 'right' || this.textAlign === 'end' ? 'end' : 'start';
    const base = this.textBaseline === 'middle' ? ' dominant-baseline="central"' : '';
    const style = m ? `fill:${this.fillStyle};font-family:${m[3]};font-weight:${m[1]};font-size:${m[2]}px;white-space:pre` : `fill:${this.fillStyle}`;
    this.out.push(`<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}"${base}${this.tf()}${this.alpha()} style="${esc(style)}">${esc(t)}</text>`);
  }
  measureText(t: string) {
    return { width: this.measureWith(this.font, t) };
  }
  toString() {
    while (this.stack.length) this.restore();
    for (; this.groups > 0; this.groups--) this.out.push('</g>');
    return (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') + this.out.join('');
  }
}
