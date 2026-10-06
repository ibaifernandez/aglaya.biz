/**
 * T2 · the drawing's motion. Three timelines share the stage, one per pair:
 *   - pair 1: ./story-tetris.ts, a <canvas> timeline of ≈24 s;
 *   - pair 2: ./story-heatmap.ts, a <canvas> timeline of ≈36 s;
 *   - pair 3: ./story-plugs.ts, a <canvas> timeline of ≈35 s.
 * Each starts from 0 every time its pair is chosen — chosen again while on
 * screen too. Nothing moves on by itself.
 *
 * Its own chunk, imported by ./story-selector.ts only on a wide screen
 * (> 860px) with motion allowed. On a phone, or with reduced motion, it is
 * never downloaded and the stage shows the still final frames instead.
 *
 * Talks to each drawing only through its public interface; whichever is not on
 * screen is unmounted, so the host holds one of them at a time.
 */
import { createTetris, TETRIS_END, TETRIS_PAIR } from './story-tetris';
import { createHeatmap, HEATMAP_END, HEATMAP_PAIR } from './story-heatmap';
import { createPlugs, PLUGS_END, PLUGS_PAIR } from './story-plugs';

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** What a timeline drawing offers (./story-tetris.ts, ./story-heatmap.ts, ./story-plugs.ts). */
interface Timeline {
  paint(T: number): void;
  play(): void;
  destroy(): void;
}

/** Each pair's drawing: how to mount it, and how long it lasts. */
const TIMELINES: Record<number, { create: (host: HTMLElement) => Timeline; end: number }> = {
  [TETRIS_PAIR]: { create: createTetris, end: TETRIS_END },
  [HEATMAP_PAIR]: { create: createHeatmap, end: HEATMAP_END },
  [PLUGS_PAIR]: { create: createPlugs, end: PLUGS_END },
};

export interface StoryMotion {
  /** Paint pair `i` still, at progress `m` (0 start → 1 its last frame). */
  still(i: number, m: number): void;
  /** Play pair `i` from its start. */
  play(i: number): void;
  /** Pair `i`, already on screen, was chosen again: its timeline starts over. */
  replay(i: number): void;
  /** Stop and give the host back what it held. */
  destroy(): void;
}

export function createStoryMotion(host: HTMLElement): StoryMotion {
  let timeline: { pair: number; t: Timeline } | null = null;

  /** Mount the piece pair `i` needs. */
  const mount = (i: number): Timeline => {
    if (timeline?.pair !== i) {
      timeline?.t.destroy();
      timeline = { pair: i, t: TIMELINES[i].create(host) };
    }
    return timeline.t;
  };

  return {
    still(i, m) {
      mount(i).paint(clamp(m) * TIMELINES[i].end);
    },
    play(i) {
      mount(i).play();
    },
    replay(i) {
      this.play(i);
    },
    destroy() {
      timeline?.t.destroy();
      timeline = null;
    },
  };
}
