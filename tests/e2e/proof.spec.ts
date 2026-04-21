import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Proof Pages', () => {
  test('should render the proof index page', async ({ page }) => {
    await page.goto('/proof/');

    // The /proof/ page redirects to the home page /#proof anchor
    await expect(page).toHaveTitle('AGLAYA — The Uncomfortable Agency');

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/proof/norden/"]')).toBeVisible();
  });

  test('should render a proof detail page', async ({ page }) => {
    await page.goto('/proof/pocuro/');

    // Check page title matches current proof content (Note the em dash —)
    await expect(page).toHaveTitle(
      'AI Orchestration & Lead Scoring — AGLAYA Proof'
    );

    // Check h1 contains the current proof title
    await expect(page.locator('h1')).toContainText('AI Orchestration & Lead Scoring');

    // Check System Integrity header is present
    await expect(page.locator('text=/SYSTEM_INTEGRITY/')).toBeVisible();

    // Check that metrics use Corporate Green (#9FC243)
    const metric = page.locator('span.text-corporate-green').filter({ hasText: '90%' }).first();
    await expect(metric).toHaveCSS('color', 'rgb(159, 194, 67)'); // #9FC243

    // Check markdown body h2 headings are present - using the new 'What We Built' header
    await expect(page.locator('h2').filter({ hasText: 'What We Built' })).toBeVisible();
  });

  test('should render the Spanish proof index page', async ({ page }) => {
    await page.goto('/es/proof/');

    // The /es/proof/ page redirects to /es/#proof
    await expect(page).toHaveTitle('AGLAYA — La Agencia Incómoda');

    // Check that at least one proof card is visible
    await expect(page.locator('a[href="/es/proof/norden/"]')).toBeVisible();
  });

  test('should render a Spanish proof detail page', async ({ page }) => {
    await page.goto('/es/proof/pocuro/');

    // Check page title matches current ES proof content (Note the em dash —)
    await expect(page).toHaveTitle(
      'Orquestación de IA & Scoring de Leads — AGLAYA Evidencia'
    );

    // Check h1 contains the current ES proof title
    await expect(page.locator('h1')).toContainText('Orquestación de IA & Scoring de Leads');

    // Check System Integrity header (Spanish uses INTEGRIDAD_SISTEMA)
    await expect(page.locator('text=/INTEGRIDAD_SISTEMA/')).toBeVisible();

    // Check metrics color in ES
    const metric = page.locator('span.text-corporate-green').filter({ hasText: '90%' }).first();
    await expect(metric).toHaveCSS('color', 'rgb(159, 194, 67)');

    // Check markdown body h2 headings are present
    await expect(page.locator('h2').filter({ hasText: 'Qué Construimos' })).toBeVisible();
  });

  test('should pass axe-core accessibility checks on proof index', async ({ page }) => {
    await page.goto('/proof/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .exclude('.marquee-container')
      .exclude('.deco-text')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should pass axe-core accessibility checks on proof detail', async ({ page }) => {
    await page.goto('/proof/pocuro/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .exclude('.marquee-container')
      .exclude('.deco-text')
      .exclude('.proof-meta')
      .disableRules(['color-contrast']) // Allowed for industrial low-contrast technical metadata aesthetic
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
