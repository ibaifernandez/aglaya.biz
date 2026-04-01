import { test, expect } from '@playwright/test';
import AxeBuilder from 'axe-core';

test.describe('Proof Pages', () => {
  test('should render the proof index page', async ({ page }) => {
    await page.goto('/proof/');

    // Check page title
    await expect(page).toHaveTitle('Proof — AGLAYA');

    // Check that proof grid is visible
    await expect(page.locator('section#proof')).toBeVisible();

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/proof/pocuro/"]')).toBeVisible();
  });

  test('should render a proof detail page', async ({ page }) => {
    await page.goto('/proof/pocuro/');

    // Check page title
    await expect(page).toHaveTitle('POCuro Case Study — AGLAYA');

    // Check that the detail page content is visible
    await expect(page.locator('h1')).toContainText('POCuro Case Study');
    await expect(page.locator('h2')).toContainText('THE_CHALLENGE');
    await expect(page.locator('h2')).toContainText('SYSTEMS_DEPLOYED');
    await expect(page.locator('h2')).toContainText('SOVEREIGNTY_CHECK');
  });

  test('should render the Spanish proof index page', async ({ page }) => {
    await page.goto('/es/proof/');

    // Check page title
    await expect(page).toHaveTitle('Evidencia — AGLAYA');

    // Check that proof grid is visible
    await expect(page.locator('section#proof')).toBeVisible();

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/es/proof/pocuro/"]')).toBeVisible();
  });

  test('should render a Spanish proof detail page', async ({ page }) => {
    await page.goto('/es/proof/pocuro/');

    // Check page title
    await expect(page).toHaveTitle('Estudio de Caso POCuro — AGLAYA');

    // Check that the detail page content is visible
    await expect(page.locator('h1')).toContainText('Estudio de Caso POCuro');
    await expect(page.locator('h2')).toContainText('EL_RETO');
    await expect(page.locator('h2')).toContainText('SISTEMAS_DESPLEGADOS');
    await expect(page.locator('h2')).toContainText('CONTROL_DE_SOBERANÍA');
  });

  test('should pass axe-core accessibility checks on proof index', async ({ page }) => {
    await page.goto('/proof/');

    // Run axe-core accessibility tests
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')    // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-wrap')  // decorative, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('should pass axe-core accessibility checks on proof detail', async ({ page }) => {
    await page.goto('/proof/pocuro/');

    // Run axe-core accessibility tests
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')    // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-wrap')  // decorative, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});