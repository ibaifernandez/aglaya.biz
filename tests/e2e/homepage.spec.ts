import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage', () => {
  test('should render the homepage with all sections', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle('AGLAYA — The Uncomfortable Agency');

    // Check that all main sections are present
    await expect(page.locator('section#hero')).toBeVisible();
    await expect(page.locator('section#problem')).toBeVisible();
    await expect(page.locator('section#systems')).toBeVisible();
    await expect(page.locator('section#how-it-works')).toBeVisible();
    await expect(page.locator('section#proof')).toBeVisible();
    await expect(page.locator('section#anti-client')).toBeVisible();
    await expect(page.locator('section#economics')).toBeVisible();
    await expect(page.locator('section#contact')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Desktop nav has anchor links to homepage sections
    // .first() because mobile nav also has the same links (hidden at desktop width)
    await expect(page.locator('a[href="/#systems"]').first()).toBeVisible();
    await expect(page.locator('a[href="/#proof"]').first()).toBeVisible();
    await expect(page.locator('a[href="/#economics"]').first()).toBeVisible();
  });

  test('should pass axe-core accessibility checks', async ({ page }) => {
    // Emulate reduced-motion to avoid false-positive contrast failures on animated elements
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')        // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-container') // decorative scrolling text, aria-hidden
      .exclude('.icp-watermark')    // opacity-10 design watermark, aria-hidden
      .exclude('.deco-text')        // opacity-based decorative labels, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});
