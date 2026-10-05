import { test, expect, type Page } from '@playwright/test';

/**
 * THE FOCUS RING SITS ON THE ELEMENT'S EDGE, AND ONLY FOR THE KEYBOARD.
 *
 * Every ring on the site used to float 2–3 px outside the element
 * (`outline-offset: 3px` in global.css, re-declared in four components), so it
 * read as "misplaced". It is now drawn on the edge: `outline-offset: 0`, 2 px,
 * brand red (green on the ICP filter, as before).
 *
 * Each target below is reached with the real Tab key, never with `.focus()`, so
 * the ring is checked the way a keyboard user meets it. The last test proves the
 * other half: a mouse click on a T2 pair shows no ring at all.
 *
 * What this guard does NOT decide: after a click, ANY key press (Space, Page
 * Down, an arrow) makes the browser treat the user as a keyboard user and the
 * ring appears. That is the platform's `:focus-visible` heuristic and WCAG
 * 2.4.7 — keyboard users must always see where they are — so it is left alone.
 */

async function open(page: Page, path: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem('aglaya_cookie_consent', 'essential');
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
}

/** Press Tab until the focused element matches `selector` (or give up). */
async function tabTo(page: Page, selector: string, max = 120): Promise<void> {
  for (let i = 0; i < max; i += 1) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate((sel) => document.activeElement?.matches(sel) ?? false, selector);
    if (hit) return;
  }
  throw new Error(`Tab never reached ${selector}`);
}

/** Outline of `ringSelector` (defaults to the focused element). */
async function ring(page: Page, ringSelector?: string) {
  return page.evaluate(async (sel) => {
    const el = (sel ? document.querySelector(sel) : document.activeElement) as HTMLElement;
    // Elements with `transition` animate the outline in from its initial width
    // (`medium` = 3px); measure the settled ring, not a frame mid-transition.
    await Promise.all(el.getAnimations().map((a) => a.finished.catch(() => undefined)));
    const cs = getComputedStyle(el);
    return {
      focusVisible: document.activeElement?.matches(':focus-visible') ?? false,
      style: cs.outlineStyle,
      width: cs.outlineWidth,
      offset: cs.outlineOffset,
    };
  }, ringSelector ?? null);
}

function expectOnEdge(r: Awaited<ReturnType<typeof ring>>) {
  expect(r.focusVisible, 'reached by keyboard, so :focus-visible must match').toBe(true);
  expect(r.style).toBe('solid');
  expect(r.width).toBe('2px');
  expect(r.offset).toBe('0px');
}

test.describe('focus ring on the edge, keyboard only (1440)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('header link', async ({ page }) => {
    await open(page, '/');
    await tabTo(page, 'header a');
    expectOnEdge(await ring(page));
  });

  test('a link in the page body', async ({ page }) => {
    await open(page, '/');
    await tabTo(page, 'main a');
    expectOnEdge(await ring(page));
  });

  test('T2 selector on /preview/home/: the tab and the open card', async ({ page }) => {
    await open(page, '/preview/home/');
    await tabTo(page, '[role="tab"]');
    expectOnEdge(await ring(page));
    await tabTo(page, '[role="tabpanel"]', 3);
    expectOnEdge(await ring(page));
  });

  test('a field on /contact', async ({ page }) => {
    await open(page, '/contact/');
    await tabTo(page, '.cf-input');
    expectOnEdge(await ring(page));
  });

  test('an option of the filter on /roi-audit', async ({ page }) => {
    await open(page, '/roi-audit/');
    await tabTo(page, '.icp-choice');
    const id = await page.evaluate(() => (document.activeElement as HTMLElement).id);
    // The radio is visually hidden; its ring is drawn on the card next to it.
    expectOnEdge(await ring(page, `label[for="${id}"]`));
  });

  test('a mouse click on a T2 pair shows no ring', async ({ page }) => {
    await open(page, '/preview/home/');
    for (const sel of ['#pv-tab-2', '#pv-panel-2', '#pv-tab-0']) {
      await page.locator(sel).click();
      const r = await ring(page);
      expect(r.focusVisible, `${sel}: a click is not keyboard focus`).toBe(false);
      expect(r.style, `${sel}: no outline after a click`).toBe('none');
    }
  });
});
