import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function gotoWithConsent(
  page: Parameters<typeof test>[0]['page'],
  path: string,
) {
  await page.addInitScript(() => {
    window.localStorage.setItem('aglaya_cookie_consent', 'essential');
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
}

const axe = (page: Parameters<typeof test>[0]['page']) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
    .exclude('.h-captcha') // Footer dispatch widget; low-contrast warning in non-prod
    .exclude('.marquee-container')
    .exclude('.deco-text');

// Answer all 6 questions (fork → depth → gates). Email gate comes AFTER, at the
// payoff — qualified-leaning answers.
async function answerAllQuestions(page: Parameters<typeof test>[0]['page']) {
  await page.click('[data-action="start"]');
  await expect(page.locator('[data-step="pain"]')).toBeVisible();
  await page.click('[data-step="pain"] .diag-opt[data-value="reports"]');

  await expect(page.locator('[data-step="people"]')).toBeVisible();
  await page.click('[data-step="people"] .diag-opt[data-value="p4_10"]');

  await expect(page.locator('[data-step="hours"]')).toBeVisible();
  await page.click('[data-step="hours"] .diag-opt[data-value="h15_40"]');

  await expect(page.locator('[data-step="tool"]')).toBeVisible();
  await page.click('[data-step="tool"] .diag-opt[data-value="patchwork"]');

  await expect(page.locator('[data-step="team"]')).toBeVisible();
  await page.click('[data-step="team"] .diag-opt[data-value="t11_50"]');

  await expect(page.locator('[data-step="spend"]')).toBeVisible();
  await page.click('[data-step="spend"] .diag-opt[data-value="s2kplus"]');

  // Email gate is the LAST step before the number.
  await expect(page.locator('[data-step="email"]')).toBeVisible();
}

// Walk the full flow to the report (qualified path).
async function runQualifiedFlow(page: Parameters<typeof test>[0]['page']) {
  await answerAllQuestions(page);
  await page.fill('#diag-email', 'founder@acme.com');
  await page.click('[data-action="email-continue"]');
}

test.describe('ROI Diagnostic', () => {
  test('renders the intro and passes accessibility', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');

    await expect(page.locator('#roi-diag')).toBeVisible();
    await expect(page.locator('[data-action="start"]')).toBeVisible();

    const results = await axe(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('completes the flow and shows a personalized number', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');
    await runQualifiedFlow(page);

    const report = page.locator('[data-step="report"]');
    await expect(report).toBeVisible();

    // Headline number rendered as currency.
    await expect(page.locator('#diag-number')).toHaveText(/\$[\d.,]+/);
    // Qualified tier branch + its CTA revealed; other tiers hidden.
    await expect(page.locator('[data-tier="qualified"]')).toBeVisible();
    await expect(page.locator('[data-tier="not_yet"]')).toBeHidden();
    // Patchwork wedge line shown (tool = patchwork).
    await expect(page.locator('#diag-sticky-patchwork')).toBeVisible();
    // Reports prescription revealed.
    await expect(page.locator('[data-pres="reports"]')).toBeVisible();

    const results = await axe(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('email gate blocks an invalid address', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');
    await answerAllQuestions(page);

    await page.fill('#diag-email', 'not-an-email');
    await page.click('[data-action="email-continue"]');

    // Error shown; we did not advance to the number.
    await expect(page.locator('#diag-email-error')).toBeVisible();
    await expect(page.locator('[data-step="report"]')).toBeHidden();
  });
});
