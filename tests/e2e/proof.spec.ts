import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Proof Pages', () => {
  test('should render the proof index page', async ({ page }) => {
    await page.goto('/proof/');

    // Check page title
    await expect(page).toHaveTitle('Proof, not promises.');

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/proof/pocuro/"]')).toBeVisible();
  });

  test('should render a proof detail page', async ({ page }) => {
    await page.goto('/proof/pocuro/');

    // Check page title matches actual content
    await expect(page).toHaveTitle(
      'How POCURO Cut Unqualified Leads by 90% in 60 Days — AGLAYA Proof'
    );

    // Check h1 contains key part of the title
    await expect(page.locator('h1')).toContainText('How POCURO Cut Unqualified Leads');

    // Check markdown body h2 headings are present
    await expect(page.locator('h2').first()).toContainText('Context');
  });

  test('should render the Spanish proof index page', async ({ page }) => {
    await page.goto('/es/proof/');

    // Check page title
    await expect(page).toHaveTitle('Evidencia, no promesas.');

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/es/proof/pocuro/"]')).toBeVisible();
  });

  test('should render a Spanish proof detail page', async ({ page }) => {
    await page.goto('/es/proof/pocuro/');

    // Check page title matches actual ES content
    await expect(page).toHaveTitle(
      'Cómo POCURO redujo los leads no calificados un 90% en 60 días — AGLAYA Evidencia'
    );

    // Check h1 contains key part of the ES title
    await expect(page.locator('h1')).toContainText('Cómo POCURO redujo');

    // Check markdown body h2 headings are present
    await expect(page.locator('h2').first()).toContainText('Contexto');
  });

  test('should pass axe-core accessibility checks on proof index', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/proof/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')
      .exclude('.marquee-wrap')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('should pass axe-core accessibility checks on proof detail', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/proof/pocuro/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')
      .exclude('.marquee-wrap')
      .exclude('.proof-meta') // decorative batch/archive text, opacity-10, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});
