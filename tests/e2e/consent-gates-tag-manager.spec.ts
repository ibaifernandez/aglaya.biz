import { test, expect, type Page } from '@playwright/test';

/**
 * THE COOKIE BANNER'S PROMISE: NO TAG MANAGER UNTIL "ACCEPT ALL".
 *
 * `src/layouts/BaseLayout.astro` injects Google Tag Manager only when
 * `localStorage.aglaya_cookie_consent === 'all'`, or when the banner fires
 * `aglaya:consent-update` with `consent: 'all'`. That condition is the whole
 * legal content of the banner, and until this file nothing failed if someone
 * moved it: the page looks identical with or without the request, so the
 * breach is invisible from the browser window. The site has leaked a
 * visitor's IP to a US server before the banner decided once already.
 *
 * What this guard asserts, on the two home pages (EN/ES):
 *
 *   1. NO DECISION, "essential", "rejected" → not a single request to the tag
 *      manager or to a known analytics endpoint, and no third-party origin
 *      outside the short list of essential services the cookie policy declares.
 *   2. "all" (stored, or chosen by clicking the banner) → the tag manager IS
 *      requested. Without this half the guard would pass in a vacuum the day
 *      the loader, the container id or the domain changes.
 *
 * Every non-local request is fulfilled with an empty 204: nothing here depends
 * on a third party answering, and CI has no guaranteed network.
 */

const HOMES = ['/', '/es/'] as const;
const CONSENT_KEY = 'aglaya_cookie_consent';

const TAG_MANAGER = /^https:\/\/www\.googletagmanager\.com\/gtm\.js/;

/** Tag managers and analytics collectors that must never fire before consent. */
const TRACKERS = [
  /googletagmanager\.com/,
  /google-analytics\.com/,
  /analytics\.google\.com/,
  /doubleclick\.net/,
  /googleadservices\.com/,
  /connect\.facebook\.net/,
  /facebook\.com\/tr/,
  /clarity\.ms/,
  /hotjar\.(com|io)/,
  /sentry\.io/,
];

/**
 * Third-party hosts allowed before consent — each one declared as essential in
 * `src/pages/cookies.astro`. Adding a host here is a legal decision, not a
 * test fix: it means the site talks to that company before the visitor chose.
 */
const ESSENTIAL_THIRD_PARTY_HOSTS = [/(^|\.)hcaptcha\.com$/];

/** Records every non-local request and answers it with an empty 204. */
async function observeThirdParties(page: Page): Promise<string[]> {
  const seen: string[] = [];
  await page.route(/^https?:\/\/(?!localhost[:/]|127\.0\.0\.1[:/])/, (route) => {
    seen.push(route.request().url());
    return route.fulfill({ status: 204, body: '' });
  });
  return seen;
}

async function presetConsent(page: Page, value: string) {
  await page.addInitScript(
    ([key, v]) => window.localStorage.setItem(key, v),
    [CONSENT_KEY, value] as const,
  );
}

function expectNoTracking(seen: string[]) {
  const tracked = seen.filter((url) => TRACKERS.some((re) => re.test(url)));
  expect(tracked, 'tracker requested before "accept all"').toEqual([]);

  const undeclared = seen.filter((url) => {
    const host = new URL(url).hostname;
    return !ESSENTIAL_THIRD_PARTY_HOSTS.some((re) => re.test(host));
  });
  expect(undeclared, 'third party contacted before "accept all"').toEqual([]);
}

test.describe('Cookie consent gates the tag manager', () => {
  for (const path of HOMES) {
    test(`${path} — no decision yet: no tag manager, no analytics`, async ({ page }) => {
      const seen = await observeThirdParties(page);
      await page.goto(path);
      await expect(page.locator('#cookie-banner')).toBeVisible();
      await page.waitForLoadState('networkidle');
      expectNoTracking(seen);
    });

    for (const choice of ['essential', 'rejected']) {
      test(`${path} — stored "${choice}": no tag manager, no analytics`, async ({ page }) => {
        const seen = await observeThirdParties(page);
        await presetConsent(page, choice);
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        expectNoTracking(seen);
      });
    }

    test(`${path} — stored "all": the tag manager is requested`, async ({ page }) => {
      await observeThirdParties(page);
      await presetConsent(page, 'all');
      const gtm = page.waitForRequest(TAG_MANAGER, { timeout: 10_000 });
      await page.goto(path);
      await gtm;
    });
  }

  test('clicking "essential" in the banner does not load the tag manager', async ({ page }) => {
    const seen = await observeThirdParties(page);
    await page.goto('/');
    await page.locator('#cookie-essential').click();
    await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), CONSENT_KEY)).toBe('essential');
    await page.waitForLoadState('networkidle');
    expectNoTracking(seen);
  });

  test('clicking "accept all" in the banner loads the tag manager without a reload', async ({ page }) => {
    const seen = await observeThirdParties(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expectNoTracking(seen);

    const gtm = page.waitForRequest(TAG_MANAGER, { timeout: 10_000 });
    await page.locator('#cookie-accept').click();
    await gtm;
  });
});
