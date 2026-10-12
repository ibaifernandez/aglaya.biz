/**
 * T4 · the stage's motion: the Orchestrator's drawing (./story-orchestrator.ts)
 * as a loop on a <canvas>, only on a wide screen (> 860px) with motion allowed,
 * and only while the stage is on screen — off screen the loop stops where it is.
 *
 * Everywhere else (no JavaScript, reduced motion, phones) the stage keeps the
 * still frame it was served with, and the drawing's code is never downloaded:
 * it arrives by dynamic import, its own chunk.
 *
 * BaseLayout mounts ClientRouter, so this (re)starts on `astro:page-load` and
 * tears down on `astro:before-swap`.
 */
type Cleanup = () => void;
let cleanup: Cleanup | null = null;

function teardown() {
  cleanup?.();
  cleanup = null;
}

function start() {
  teardown();
  const host = document.querySelector<HTMLElement>('[data-pv-orch-stage]');
  if (!host) return;
  const wide = window.matchMedia('(min-width: 861px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!wide.matches || calm.matches) return;

  let alive = true;
  let off: Cleanup = () => {};
  cleanup = () => {
    alive = false;
    off();
  };
  import('./story-orchestrator').then(({ createOrchestrator }) => {
    if (!alive || !host.isConnected) return;
    const drawing = createOrchestrator(host);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? drawing.play() : drawing.stop()));
    io.observe(host);
    off = () => {
      io.disconnect();
      drawing.destroy();
    };
  }, () => {}); // if the chunk fails, the still frame stays
}

document.addEventListener('astro:page-load', start);
document.addEventListener('astro:before-swap', teardown);

// A module, not a global script: its names must not meet ./effects.ts's.
export {};
