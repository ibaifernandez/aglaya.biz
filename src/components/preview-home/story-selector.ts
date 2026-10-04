/**
 * T2 · the selector (first floor of ./Problem.astro): the four pairs become
 * tabs, the WAI-ARIA tabs pattern — tablist / tab / tabpanel, arrows, Home and
 * End, a roving tabindex, selection follows focus.
 *
 * What runs where:
 *   - Always (with JavaScript): this file. Choosing a pair opens its panel and
 *     puts that pair's final frame on the stage (cloned from a <template>).
 *   - Reduced motion: nothing else is downloaded. All four pairs stay open and
 *     resolved, as served; the selector only changes the still drawing.
 *   - Motion allowed, any width: ./story-text-motion.ts (strike + typing).
 *   - Motion allowed and wider than 860px: ./story-motion.ts too (the drawing
 *     going from chaos to order). Below that the stage stays still.
 *   - Pair 1 starts when the stage comes into view. Nothing moves on by
 *     itself; pairs already seen stay struck through.
 *   - Choosing the pair already on screen starts its drawing over if it is a
 *     timeline (pair 1's, ./story-tetris.ts); the text stays as it is.
 *   - Each frame <template> carries its own `data-pv-label`: the stage's
 *     accessible name follows the pair on it.
 *
 * BaseLayout mounts ClientRouter, so this (re)starts on `astro:page-load` and
 * puts the section back as served on `astro:before-swap`.
 */
import { stageCaption } from './copy';
import type { TextMotion } from './story-text-motion';
import type { StoryMotion } from './story-motion';

const CALM = '(prefers-reduced-motion: reduce)';
const WIDE = '(min-width: 861px)';
const WAIT_MS = 2500;

let cleanup: (() => void) | null = null;

function teardown() {
  cleanup?.();
  cleanup = null;
}

function start() {
  teardown();
  const section = document.querySelector<HTMLElement>('[data-pv-story]');
  if (!section) return;
  const tablist = section.querySelector<HTMLElement>('[data-pv-tabs]')!;
  const tabs = [...section.querySelectorAll<HTMLElement>('[data-pv-tab]')];
  const panels = [...section.querySelectorAll<HTMLElement>('[data-pv-panel]')];
  const host = section.querySelector<HTMLElement>('[data-pv-story-drawing]')!;
  const stage = section.querySelector<HTMLElement>('[data-pv-stage]')!;
  const cap = section.querySelector<HTMLElement>('[data-pv-cap]')!;
  const frames = [...section.querySelectorAll<HTMLTemplateElement>('template[data-pv-frame]')];
  if (!tabs.length || tabs.length !== panels.length || frames.length !== tabs.length) return;

  const calm = window.matchMedia(CALM).matches;
  const wide = window.matchMedia(WIDE);
  let alive = true;
  let cur = -1;
  let started = false;
  /** Whether the pair on screen has been played (or shown resolved). */
  let played = false;
  const seen = new Set<number>();
  let text: TextMotion | null = null;
  let motion: StoryMotion | null = null;
  let io: IntersectionObserver | null = null;
  const offs: (() => void)[] = [];

  const labels = frames.map((f) => f.dataset.pvLabel ?? '');
  const showFrame = (i: number) => host.replaceChildren(frames[i].content.cloneNode(true));

  /* ---------- ARIA ---------- */
  section.classList.add('is-sel');
  section.classList.toggle('is-calm', calm);
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', tablist.dataset.pvLabel ?? '');
  tablist.setAttribute('aria-orientation', 'vertical');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    panels[i].tabIndex = 0;
  });

  function select(i: number, focus = false) {
    if (i === cur) {
      if (!started) return;
      if (!played) {
        // Chosen before its stage came into view: it starts now.
        played = true;
        text?.play(i);
        motion?.play(i);
      } else motion?.replay(i);
      return;
    }
    const prev = cur;
    cur = i;
    tabs.forEach((tab, k) => {
      tab.setAttribute('aria-selected', String(k === i));
      tab.tabIndex = k === i ? 0 : -1;
      panels[k].classList.toggle('is-on', k === i);
    });
    if (focus) tabs[i].focus();
    cap.textContent = stageCaption(i + 1, tabs.length);
    host.setAttribute('aria-label', labels[i]);

    if (prev >= 0 && played) seen.add(prev);
    if (prev >= 0) (seen.has(prev) ? text?.finished(prev) : text?.unstarted(prev));
    played = started;
    if (text) (started ? text.play(i) : text.unstarted(i));
    if (motion) (started ? motion.play(i) : motion.still(i, 0));
    else showFrame(i);
  }

  const onClick = (e: Event) => {
    const i = tabs.indexOf(e.currentTarget as HTMLElement);
    started = true;
    select(i);
  };
  const onKey = (e: KeyboardEvent) => {
    const i = tabs.indexOf(e.currentTarget as HTMLElement);
    const n = tabs.length;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i + n - 1) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === 'Enter' || e.key === ' ') next = i;
    if (next === null) return;
    e.preventDefault();
    started = true;
    select(next, true);
  };
  tabs.forEach((tab) => {
    tab.addEventListener('click', onClick);
    tab.addEventListener('keydown', onKey);
    offs.push(() => {
      tab.removeEventListener('click', onClick);
      tab.removeEventListener('keydown', onKey);
    });
  });

  select(0);

  /* ---------- Motion: downloaded only where it runs ---------- */
  const loadMotion = () =>
    import('./story-motion').then(({ createStoryMotion }) => {
      if (!alive || motion || !wide.matches) return;
      motion = createStoryMotion(host);
      // Already playing or played: the scene of the chosen pair, settled.
      motion.still(cur, started ? 1 : 0);
    });

  if (!calm) {
    const timeout = new Promise((resolve) => window.setTimeout(resolve, WAIT_MS));
    const loads = [
      import('./story-text-motion').then(({ createTextMotion }) => {
        if (!alive) return;
        text = createTextMotion(section);
        // If the import lost the race and the pair already started, show it resolved.
        tabs.forEach((_, k) => (seen.has(k) || (k === cur && played) ? text!.finished(k) : text!.unstarted(k)));
      }),
    ];
    if (wide.matches) loads.push(loadMotion());
    Promise.race([Promise.allSettled(loads), timeout]).then(() => {
      if (!alive) return;
      // Pair 1 starts when the stage is on screen — before that it would finish unseen.
      io = new IntersectionObserver(
        (entries) => {
          if (started || !entries.some((en) => en.isIntersecting)) return;
          started = true;
          played = true;
          io?.disconnect();
          text?.play(cur);
          motion?.play(cur);
        },
        { threshold: 0.4 },
      );
      if (!started) io.observe(stage);
    });

    // Crossing the 860px line: the drawing's motion comes or goes; the text stays.
    const onWide = () => {
      if (wide.matches) loadMotion().catch(() => {});
      else if (motion) {
        motion.destroy();
        motion = null;
        showFrame(cur);
      }
    };
    wide.addEventListener('change', onWide);
    offs.push(() => wide.removeEventListener('change', onWide));
  }

  cleanup = () => {
    alive = false;
    io?.disconnect();
    offs.forEach((off) => off());
    text?.restore();
    motion?.destroy();
    showFrame(0);
    section.classList.remove('is-sel', 'is-calm');
    cap.textContent = stageCaption(1, tabs.length);
    host.setAttribute('aria-label', labels[0]);
    for (const a of ['role', 'aria-label', 'aria-orientation']) tablist.removeAttribute(a);
    tabs.forEach((tab, k) => {
      for (const a of ['role', 'aria-controls', 'aria-selected', 'tabindex']) tab.removeAttribute(a);
      for (const a of ['role', 'aria-labelledby', 'tabindex']) panels[k].removeAttribute(a);
      panels[k].classList.remove('is-on');
    });
  };
}

document.addEventListener('astro:page-load', start);
document.addEventListener('astro:before-swap', teardown);
