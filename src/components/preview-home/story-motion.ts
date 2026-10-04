/**
 * T2 · the drawing's motion: on choosing a pair, its scene holds its chaos for a
 * moment, then settles into order and stays there. Nothing moves on by itself.
 * Timings are the mock-up's (docs/design/portada-nueva/t2-selector.html).
 *
 * Its own chunk, imported by ./story-selector.ts only on a wide screen
 * (> 860px) with motion allowed. On a phone, or with reduced motion, it is
 * never downloaded and the stage shows the still final frames instead.
 *
 * Talks to the drawing only through ./story-drawing.ts's public interface.
 */
import { createStoryDrawing } from './story-drawing';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seconds of chaos before the scene starts to settle, and how long settling takes. */
const HOLD = 0.9;
const SETTLE = 1.8;

export interface StoryMotion {
  /** Paint pair `i` still, at morph `m` (0 chaos → 1 order). */
  still(i: number, m: number): void;
  /** Play pair `i` from chaos to order. */
  play(i: number): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createStoryMotion(host: HTMLElement): StoryMotion {
  const drawing = createStoryDrawing(host);
  let raf = 0;
  return {
    still(i, m) {
      cancelAnimationFrame(raf);
      drawing.paint(i, m, i);
    },
    play(i) {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const loop = (now: number) => {
        const e = (now - start) / 1000;
        const m = clamp((e - HOLD) / SETTLE);
        drawing.paint(i, m, e / 40 + i);
        if (m < 1) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    destroy() {
      cancelAnimationFrame(raf);
      drawing.destroy();
    },
  };
}
