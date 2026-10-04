/**
 * T2 · the text motion: the problem is struck through, the way out types itself,
 * its paragraph fades in. Timings are the mock-up's
 * (docs/design/portada-nueva/t2-selector.html).
 *
 * Its own chunk, imported by ./story-selector.ts only when motion is allowed —
 * on every width, phone included. It knows nothing of the drawing.
 *
 * Adds `is-fx` to the section; every style that switches lives under that class
 * in ./Problem.astro, so `restore()` (or the chunk never arriving) leaves the
 * ground floor exactly as served.
 */

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seconds into a selection. */
const STRIKE_FROM = 0.5;
const STRIKE_FOR = 0.45;
const TYPE_FROM = 0.95;
const TYPE_FOR = 1.1;

interface Pair {
  strike: HTMLElement;
  sol: HTMLElement;
  done: HTMLElement;
  rest: HTMLElement;
  full: string;
  text: HTMLElement;
}

export interface TextMotion {
  /** Pair `i` not started yet: problem whole, way out a ghost, paragraph hidden. */
  unstarted(i: number): void;
  /** Pair `i` seen and left: problem struck, way out written. */
  finished(i: number): void;
  /** Play pair `i` from the start. */
  play(i: number): void;
  /** Stop and put the served text back. */
  restore(): void;
}

export function createTextMotion(section: HTMLElement): TextMotion {
  const pairs: Pair[] = [...section.querySelectorAll<HTMLElement>('[data-pv-tab]')].map((tab, i) => {
    const panel = section.querySelector<HTMLElement>(`#pv-panel-${i}`)!;
    const sol = panel.querySelector<HTMLElement>('.pv-sol-h')!;
    return {
      strike: tab.querySelector<HTMLElement>('.pv-prob-h')!,
      sol,
      done: sol.querySelector<HTMLElement>('.pv-done')!,
      rest: sol.querySelector<HTMLElement>('.pv-rest')!,
      full: sol.getAttribute('aria-label') ?? '',
      text: panel.querySelector<HTMLElement>('.pv-sol-p')!,
    };
  });
  let raf = 0;

  const set = (p: Pair, strike: number, write: number) => {
    p.strike.style.setProperty('--strike', String(strike));
    p.strike.classList.toggle('is-struck', strike >= 1);
    const n = Math.round(p.full.length * write);
    p.done.textContent = p.full.slice(0, n);
    p.rest.textContent = p.full.slice(n);
    p.sol.classList.toggle('is-typing', write < 1);
    p.text.classList.toggle('is-on', write >= 1);
  };

  section.classList.add('is-fx');
  pairs.forEach((p) => set(p, 0, 0));

  return {
    unstarted: (i) => set(pairs[i], 0, 0),
    finished: (i) => set(pairs[i], 1, 1),
    play(i) {
      cancelAnimationFrame(raf);
      const p = pairs[i];
      set(p, 0, 0);
      const start = performance.now();
      const loop = (now: number) => {
        const e = (now - start) / 1000;
        const write = clamp((e - TYPE_FROM) / TYPE_FOR);
        set(p, clamp((e - STRIKE_FROM) / STRIKE_FOR), write);
        if (write < 1) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    restore() {
      cancelAnimationFrame(raf);
      section.classList.remove('is-fx');
      for (const p of pairs) {
        p.strike.style.removeProperty('--strike');
        p.strike.classList.remove('is-struck');
        p.done.textContent = p.full;
        p.rest.textContent = '';
        p.sol.classList.remove('is-typing');
        p.text.classList.remove('is-on');
      }
    },
  };
}
