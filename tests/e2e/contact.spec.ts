import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-core';

test.describe('Contact Page', () => {
  test('should render the contact page with ICP filter', async ({ page }) => {
    await page.goto('/contact/');

    // Check page title and heading
    await expect(page).toHaveTitle('Request Proposal — AGLAYA');

    // Check that the ICP filter is present
    await expect(page.locator('#icp-container')).toBeVisible();

    // Check that initial inputs are present
    await expect(page.locator('#icp-employees')).toBeVisible();
    await expect(page.locator('#icp-spend')).toBeVisible();

    // Check that the evaluate button is present
    await expect(page.locator('#icp-evaluate')).toBeVisible();
  });

  test('should show disqualified message for small teams', async ({ page }) => {
    await page.goto('/contact/');

    // Set employees to 10 (less than 20) and spend to $2000 (less than $5K)
    await page.locator('#icp-employees').fill('10');
    await page.locator('#icp-spend').fill('2000');

    // Click evaluate
    await page.locator('#icp-evaluate').click();

    // Check that disqualified message is shown
    await expect(page.locator('#icp-disqualified')).toBeVisible();
  });

  test('should show qualified form for large teams', async ({ page }) => {
    await page.goto('/contact/');

    // Set employees to 50 (more than 20) and spend to $20000 (more than $15K)
    await page.locator('#icp-employees').fill('50');
    await page.locator('#icp-spend').fill('20000');

    // Click evaluate
    await page.locator('#icp-evaluate').click();

    // Check that qualified form is shown
    await expect(page.locator('#icp-qualified')).toBeVisible();

    // Check that form has required fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('input[name="inquiry_type"]')).toBeVisible();
  });

  test('should show borderline form for borderline cases', async ({ page }) => {
    await page.goto('/contact/');

    // Set employees to 250 (more than 20) and spend to $10000 (between $5K and $15K)
    await page.locator('#icp-employees').fill('250');
    await page.locator('#icp-spend').fill('10000');

    // Click evaluate
    await page.locator('#icp-evaluate').click();

    // Check that borderline form is shown
    await expect(page.locator('#icp-borderline')).toBeVisible();

    // Check that form has basic fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should pass axe-core accessibility checks', async ({ page }) => {
    await page.goto('/contact/');

    // Run axe-core accessibility tests
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')    // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-wrap')  // decorative, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});