import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Quote Calculator', () => {
  test('should render the EN quote page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/quote/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.quote-calculator')).toBeVisible();
  });

  test('should render the ES quote page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/es/quote/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.quote-calculator')).toBeVisible();
  });

  test('should render the PT quote page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pt/quote/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.quote-calculator')).toBeVisible();
  });

  test('should have all 4 base product options', async ({ page }) => {
    await page.goto('/quote/');

    const products = page.locator('input[name="base_product"]');
    await expect(products).toHaveCount(4);
  });

  test('should pass axe-core accessibility checks on EN quote page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/quote/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe('ROI Audit', () => {
  test('should render the EN roi-audit page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/roi-audit/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/automated/i);
  });

  test('should render the ES roi-audit page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/es/roi-audit/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/automatizado/i);
  });

  test('should render the PT roi-audit page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pt/roi-audit/');

    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/automatizado/i);
  });

  test('should pass axe-core accessibility checks on EN roi-audit page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/roi-audit/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .exclude('.marquee-container')
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
