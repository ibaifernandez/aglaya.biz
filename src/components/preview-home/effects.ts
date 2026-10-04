/**
 * Upper floor of the new home page preview: the motion.
 *
 * The ground floor (the HTML) is complete without this file. Here:
 *   - With `prefers-reduced-motion: reduce`, nothing runs and GSAP is never
 *     downloaded: the page stays whole and still.
 *   - Otherwise GSAP + ScrollTrigger arrive by dynamic import, served from this
 *     site (npm, bundled into /_astro/), never from a CDN — the CSP in
 *     public/_headers allows neither cdnjs nor jsdelivr.
 *   - Every tween animates FROM a state it sets itself, TO the state the CSS
 *     already shows. While GSAP is on its way, the pieces that are about to
 *     enter are held invisible by one class (`pv-fx-wait`, set only by this
 *     script) so they do not flash in and then jump out. If the import fails
 *     or takes longer than WAIT_MS, the class goes and the page is as served.
 *
 * BaseLayout mounts ClientRouter, so this (re)starts on `astro:page-load` and
 * tears everything down on `astro:before-swap`.
 *
 * T1 (and the header's button) move here; T2's pinned story lives in its
 * sibling ./story-effects.ts and runs inside the same context, so one revert
 * tears both down. Lenis smooth scrolling from the mock-up is page-wide and no
 * tramo built so far needs it, so it is not loaded.
 */
import { storyEffects } from './story-effects';

type Gsap = typeof import('gsap').gsap;
type Cleanup = () => void;

const WAIT_CLASS = 'pv-fx-wait';
const WAIT_MS = 2500;

let cleanup: Cleanup | null = null;

function teardown() {
  cleanup?.();
  cleanup = null;
}

async function start() {
  teardown();

  const hook = document.querySelector<HTMLElement>('.pv-hook');
  const story = document.querySelector<HTMLElement>('.pv-story');
  if (!hook && !story) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const root = document.documentElement;
  root.classList.add(WAIT_CLASS);

  let gsap: Gsap;
  let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  let timer = 0;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new Error('GSAP took too long')), WAIT_MS);
    });
    [{ gsap }, { ScrollTrigger }] = await Promise.race([
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')]),
      timeout,
    ]);
  } catch {
    root.classList.remove(WAIT_CLASS);
    return; // Ground floor stays exactly as served.
  } finally {
    window.clearTimeout(timer);
  }
  // The visitor may have navigated away while the import was in flight.
  if (!(hook ?? story)!.isConnected) {
    root.classList.remove(WAIT_CLASS);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const listeners: Cleanup[] = [];
  let storyCleanup: Cleanup | null = null;

  const ctx = gsap.context(() => {
    if (hook) {
      // T1 · entrance — values from the mock-up.
      gsap.from('.pv-hook-line > span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.pv-hook-rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.2, delay: 0.55, ease: 'power3.inOut' });
      gsap.from('.pv-hook-sub, .pv-hook-ctas', { y: 24, opacity: 0, duration: 0.9, delay: 0.8, stagger: 0.12, ease: 'power3.out' });

      // T1 · the title shrinks and fades as the hook scrolls away.
      gsap.to('.pv-hook-title', {
        yPercent: -10,
        scale: 0.92,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: { trigger: hook, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    // T2 · the four pairs, pinned.
    storyCleanup = storyEffects(gsap, ScrollTrigger);

    // Magnetic buttons, only where there is a real pointer.
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll<HTMLElement>('[data-pv-magnet]').forEach((button) => {
        const label = button.querySelector('span');
        const move = (e: PointerEvent) => {
          const r = button.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          gsap.to(button, { x: dx * 0.3, y: dy * 0.4, duration: 0.5, ease: 'power3.out' });
          if (label) gsap.to(label, { x: dx * 0.15, y: dy * 0.2, duration: 0.5, ease: 'power3.out' });
        };
        const leave = () => {
          gsap.to(label ? [button, label] : button, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' });
        };
        button.addEventListener('pointermove', move);
        button.addEventListener('pointerleave', leave);
        listeners.push(() => {
          button.removeEventListener('pointermove', move);
          button.removeEventListener('pointerleave', leave);
        });
      });
    }
  });
  // The from-states are set now; the hold is no longer needed.
  root.classList.remove(WAIT_CLASS);

  // Webfonts change line heights; measure again once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  cleanup = () => {
    root.classList.remove(WAIT_CLASS);
    listeners.forEach((off) => off());
    ctx.revert(); // kills every tween and ScrollTrigger made above, restores inline styles
    storyCleanup?.(); // what GSAP does not own: T2's layout class, typed text, drawing
  };
}

document.addEventListener('astro:page-load', start);
document.addEventListener('astro:before-swap', teardown);
