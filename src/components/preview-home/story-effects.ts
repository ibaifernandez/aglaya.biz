/**
 * T2 · the motion of the four pairs (upper floor of ./Problem.astro).
 *
 * Called by ./effects.ts INSIDE its gsap.context(), so the ScrollTrigger made
 * here dies with that context's revert(). What GSAP does not own — the class
 * that switches the layout, the typed text, the strike, the drawing — is put
 * back by the cleanup this returns, leaving the section exactly as served.
 *
 * One pinned stage, 4.8 screens of scroll. Each quarter of it is one pair:
 *   the problem is struck through → the way out types itself → its paragraph
 *   fades in, while the drawing goes from chaos (m = 0) to order (m = 1).
 * Timings are the mock-up's.
 *
 * No Lenis: the pin and the scrub work on native scrolling, and smooth
 * scrolling is not something this tramo needs.
 */
import { createStoryDrawing, STORY_PAIRS } from './story-drawing';

type Gsap = typeof import('gsap').gsap;
type ScrollTriggerT = typeof import('gsap/ScrollTrigger').ScrollTrigger;

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export function storyEffects(_gsap: Gsap, ScrollTrigger: ScrollTriggerT): (() => void) | null {
  const section = document.querySelector<HTMLElement>('.pv-story');
  const stage = section?.querySelector<HTMLElement>('[data-pv-story-stage]');
  const host = section?.querySelector<HTMLElement>('[data-pv-story-drawing]');
  if (!section || !stage || !host) return null;

  const steps = [...section.querySelectorAll<HTMLElement>('[data-pv-step]')];
  const bars = [...section.querySelectorAll<HTMLElement>('.pv-progress i')];
  if (steps.length !== STORY_PAIRS) return null;

  const pairs = steps.map((step) => {
    const sol = step.querySelector<HTMLElement>('.pv-sol-h')!;
    return {
      strike: step.querySelector<HTMLElement>('.pv-prob-h')!,
      done: sol.querySelector<HTMLElement>('.pv-done')!,
      rest: sol.querySelector<HTMLElement>('.pv-rest')!,
      full: sol.getAttribute('aria-label') ?? '',
      text: step.querySelector<HTMLElement>('.pv-sol-p')!,
    };
  });

  section.classList.add('is-fx');
  const drawing = createStoryDrawing(host);

  const render = (P: number) => {
    const idx = Math.min(STORY_PAIRS - 1, Math.floor(P * STORY_PAIRS));
    const local = clamp(P * STORY_PAIRS - idx);
    steps.forEach((s, i) => s.classList.toggle('is-on', i === idx));
    bars.forEach((b, i) => b.classList.toggle('is-on', i <= idx));

    // Pairs already passed stay finished, pairs ahead stay unstarted, so a fast
    // scroll never leaves one half-typed behind the visible one.
    pairs.forEach((p, i) => {
      const at = i < idx ? 1 : i > idx ? 0 : local;
      const strike = clamp((at - 0.3) / 0.15);
      const write = clamp((at - 0.45) / 0.3);
      p.strike.style.setProperty('--strike', String(strike));
      p.strike.classList.toggle('is-struck', strike > 0.99);
      const n = Math.round(p.full.length * write);
      p.done.textContent = p.full.slice(0, n);
      p.rest.textContent = p.full.slice(n);
      p.text.style.opacity = String(clamp((at - 0.72) / 0.12));
    });
    drawing.paint(idx, clamp((local - 0.42) / 0.4), P);
  };

  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: '+=480%',
    pin: true,
    scrub: true,
    onUpdate: (self) => render(self.progress),
    onRefresh: (self) => render(self.progress),
  });
  render(0);

  return () => {
    drawing.destroy();
    section.classList.remove('is-fx');
    steps.forEach((s) => s.classList.remove('is-on'));
    bars.forEach((b) => b.classList.remove('is-on'));
    for (const p of pairs) {
      p.strike.style.removeProperty('--strike');
      p.strike.classList.remove('is-struck');
      p.done.textContent = p.full;
      p.rest.textContent = '';
      p.text.style.removeProperty('opacity');
    }
  };
}
