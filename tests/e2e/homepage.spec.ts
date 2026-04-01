import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-core';

test.describe('Homepage', () => {
  test('should render the homepage with all sections', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('AGLAYA — The Uncomfortable Agency');

    // Check that all main sections are present
    await expect(page.locator('section#hero')).toBeVisible();
    await expect(page.locator('section#problem')).toBeVisible();
    await expect(page.locator('section#systems')).toBeVisible();
    await expect(page.locator('section#how')).toBeVisible();
    await expect(page.locator('section#proof')).toBeVisible();
    await expect(page.locator('section#anti-client')).toBeVisible();
    await expect(page.locator('section#economics')).toBeVisible();
    await expect(page.locator('section#cta')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Check that navigation links work
    await expect(page.locator('a[href="/proof/"]')).toBeVisible();
    await expect(page.locator('a[href="/systems/"]')).toBeVisible();
    await expect(page.locator('a[href="/contact/"]')).toBeVisible();
  });

  test('should pass axe-core accessibility checks', async ({ page }) => {
    await page.goto('/');

    // Run axe-core accessibility tests
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')    // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-wrap')  // decorative, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});