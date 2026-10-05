/**
 * T2 · the drawing's motion. Three pieces share the stage:
 *   - pair 1: ./story-tetris.ts, a <canvas> timeline of ≈24 s;
 *   - pair 2: ./story-heatmap.ts, a <canvas> timeline of ≈36 s;
 *     each starts from 0 every time its pair is chosen — chosen again while on
 *     screen too;
 *   - pairs 3–4: ./story-drawing.ts, whose scene holds its chaos for a moment,
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
import { createTetris, TETRIS_END, TETRIS_PAIR } from './story-tetris';
import { createHeatmap, HEATMAP_END, HEATMAP_PAIR } from './story-heatmap';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seconds of chaos before the scene starts to settle, and how long settling takes. */
const HOLD = 0.9;
const SETTLE = 1.8;

/** What a timeline drawing offers (./story-tetris.ts, ./story-heatmap.ts). */
interface Timeline {
  paint(T: number): void;
  play(): void;
  destroy(): void;
}

/** The pairs whose drawing is a timeline: how to mount it, and how long it lasts. */
const TIMELINES: Record<number, { create: (host: HTMLElement) => Timeline; end: number }> = {
  [TETRIS_PAIR]: { create: createTetris, end: TETRIS_END },
  [HEATMAP_PAIR]: { create: createHeatmap, end: HEATMAP_END },
};

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
  let timeline: { pair: number; t: Timeline } | null = null;
  let raf = 0;

  /** Mount the piece pair `i` needs; returns its timeline if it has one. */
  const mount = (i: number): Timeline | null => {
    const spec = TIMELINES[i];
    if (spec) {
      if (timeline?.pair !== i) {
        drawing?.destroy();
        drawing = null;
        timeline?.t.destroy();
        timeline = { pair: i, t: spec.create(host) };
      }
      return timeline.t;
    }
    if (!drawing) {
      timeline?.t.destroy();
      timeline = null;
      drawing = createStoryDrawing(host);
    }
    return null;
  };

  return {
    still(i, m) {
      cancelAnimationFrame(raf);
      const t = mount(i);
      if (t) t.paint(clamp(m) * TIMELINES[i].end);
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
      if (TIMELINES[i]) this.play(i);
    },
    destroy() {
      cancelAnimationFrame(raf);
      timeline?.t.destroy();
      drawing?.destroy();
      timeline = null;
      drawing = null;
    },
  };
}
