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
    .exclude('.h-captcha')
    .exclude('.marquee-container')
    .exclude('.deco-text');

// Answer all 10 questions (multi-area → worst → depth → gates → tried → volume).
// Qualified-leaning, two areas, worst = reports.
async function answerAllQuestions(page: Parameters<typeof test>[0]['page']) {
  await page.click('[data-action="start"]');

  await expect(page.locator('[data-step="areas"]')).toBeVisible();
  await page.click('[data-step="areas"] .diag-opt-multi[data-value="reports"]');
  await page.click('[data-step="areas"] .diag-opt-multi[data-value="invoices"]');
  await page.click('[data-action="areas-continue"]');

  await expect(page.locator('[data-step="worst"]')).toBeVisible();
  // only the two selected options are shown
  await expect(page.locator('[data-step="worst"] .diag-opt-worst[data-pain="reports"]')).toBeVisible();
  await expect(page.locator('[data-step="worst"] .diag-opt-worst[data-pain="leads"]')).toBeHidden();
  await page.click('[data-step="worst"] .diag-opt-worst[data-pain="reports"]');

  await expect(page.locator('[data-step="people"]')).toBeVisible();
  await page.click('[data-step="people"] .diag-opt[data-value="p4_10"]');

  await expect(page.locator('[data-step="hours"]')).toBeVisible();
  await page.click('[data-step="hours"] .diag-opt[data-value="h15_40"]');

  await expect(page.locator('[data-step="tool"]')).toBeVisible();
  await page.click('[data-step="tool"] .diag-opt[data-value="patchwork"]');

  await expect(page.locator('[data-step="frequency"]')).toBeVisible();
  await page.click('[data-step="frequency"] .diag-opt[data-value="weekly"]');

  await expect(page.locator('[data-step="team"]')).toBeVisible();
  await page.click('[data-step="team"] .diag-opt[data-value="t11_50"]');

  await expect(page.locator('[data-step="spend"]')).toBeVisible();
  await page.click('[data-step="spend"] .diag-opt[data-value="s2kplus"]');

  await expect(page.locator('[data-step="tried"]')).toBeVisible();
  await page.click('[data-step="tried"] .diag-opt[data-value="zapier"]');

  await expect(page.locator('[data-step="volume"]')).toBeVisible();
  // the worst area's (reports) unit group is the visible one
  await page.click('[data-vol-pain="reports"] .diag-vol-opt[data-value="v3"]');

  await expect(page.locator('[data-step="email"]')).toBeVisible();
}

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

  test('completes the multi-area flow and shows a personalized report', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');
    await runQualifiedFlow(page);

    await expect(page.locator('[data-step="report"]')).toBeVisible();
    await expect(page.locator('#diag-number')).toHaveText(/\$[\d.,]+/);
    await expect(page.locator('[data-tier="qualified"]')).toBeVisible();
    await expect(page.locator('[data-tier="not_yet"]')).toBeHidden();
    // patchwork wedge (tool=patchwork / tried=zapier)
    await expect(page.locator('#diag-sticky-patchwork')).toBeVisible();
    // worst-area prescription
    await expect(page.locator('[data-pres="reports"]')).toBeVisible();
    // per-area split has both selected areas
    await expect(page.locator('#diag-splits li')).toHaveCount(2);
    // headcount/hours equivalence rendered
    await expect(page.locator('#diag-equiv')).not.toBeEmpty();

    const results = await axe(page).analyze();
    expect(results.violations).toEqual([]);
  });

  test('single area auto-skips the "worst" question', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');
    await page.click('[data-action="start"]');
    await page.click('[data-step="areas"] .diag-opt-multi[data-value="leads"]');
    await page.click('[data-action="areas-continue"]');
    // worst step is skipped; we land straight on people
    await expect(page.locator('[data-step="people"]')).toBeVisible();
    await expect(page.locator('[data-step="worst"]')).toBeHidden();
  });

  test('email gate blocks an invalid address', async ({ page }) => {
    await gotoWithConsent(page, '/diagnostic/');
    await answerAllQuestions(page);
    await page.fill('#diag-email', 'not-an-email');
    await page.click('[data-action="email-continue"]');
    await expect(page.locator('#diag-email-error')).toBeVisible();
    await expect(page.locator('[data-step="report"]')).toBeHidden();
  });
});
