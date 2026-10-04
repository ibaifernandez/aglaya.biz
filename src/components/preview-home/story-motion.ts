/**
 * T2 · the drawing's motion. Two pieces share the stage:
 *   - pair 1: ./story-tetris.ts, a <canvas> timeline of ≈24 s that starts from
 *     0 every time the pair is chosen — chosen again while on screen too;
 *   - pairs 2–4: ./story-drawing.ts, whose scene holds its chaos for a moment,
 *     then settles into order and stays there (timings of
 *     docs/design/portada-nueva/t2-selector.html).
 * Nothing moves on by itself.
 *
 * Its own chunk, imported by ./story-selector.ts only on a wide screen
 * (> 860px) with motion allowed. On a phone, or with reduced motion, it is
 * never downloaded and the stage shows the still final frames instead.
 *
 * Talks to each drawing only through its public interface; whichever is not on
 * screen is unmounted, so the host holds one of them at a time.
 */
import { createStoryDrawing, type StoryDrawing } from './story-drawing';
import { createTetris, TETRIS_END, TETRIS_PAIR, type Tetris } from './story-tetris';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seconds of chaos before the scene starts to settle, and how long settling takes. */
const HOLD = 0.9;
const SETTLE = 1.8;

export interface StoryMotion {
  /** Paint pair `i` still, at progress `m` (0 start → 1 its last frame). */
  still(i: number, m: number): void;
  /** Play pair `i` from its start. */
  play(i: number): void;
  /** Pair `i`, already on screen, was chosen again: a timeline starts over; a scene that settles stays settled. */
  replay(i: number): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createStoryMotion(host: HTMLElement): StoryMotion {
  let drawing: StoryDrawing | null = null;
  let tetris: Tetris | null = null;
  let raf = 0;

  /** Mount the piece pair `i` needs; returns the timeline if it is pair 1's. */
  const mount = (i: number): Tetris | null => {
    if (i === TETRIS_PAIR) {
      if (!tetris) {
        drawing?.destroy();
        drawing = null;
        tetris = createTetris(host);
      }
      return tetris;
    }
    if (!drawing) {
      tetris?.destroy();
      tetris = null;
      drawing = createStoryDrawing(host);
    }
    return null;
  };

  return {
    still(i, m) {
      cancelAnimationFrame(raf);
      const t = mount(i);
      if (t) t.paint(clamp(m) * TETRIS_END);
      else drawing!.paint(i, m, i);
    },
    play(i) {
      cancelAnimationFrame(raf);
      const t = mount(i);
      if (t) return t.play();
      const start = performance.now();
      const loop = (now: number) => {
        const e = (now - start) / 1000;
        const m = clamp((e - HOLD) / SETTLE);
        drawing!.paint(i, m, e / 40 + i);
        if (m < 1) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    replay(i) {
      if (i === TETRIS_PAIR) this.play(i);
    },
    destroy() {
      cancelAnimationFrame(raf);
      tetris?.destroy();
      drawing?.destroy();
      tetris = drawing = null;
    },
  };
}
