import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('PT-BR Pages', () => {
  test('should render the PT homepage', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pt/');

    await expect(page).toHaveTitle('AGLAYA — A Agência Desconfortável');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should render the PT proof index (redirects to /pt/#proof)', async ({ page }) => {
    await page.goto('/pt/proof/');

    await expect(page).toHaveTitle('AGLAYA — A Agência Desconfortável');
    await expect(page.locator('a[href="/pt/proof/pocuro/"]')).toBeVisible();
  });

  test('should render a PT proof detail page', async ({ page }) => {
    await page.goto('/pt/proof/pocuro/');

    await expect(page).toHaveTitle(
      'Orquestação de IA & Scoring de Leads — AGLAYA Evidência'
    );

    await expect(page.locator('h1')).toContainText('Orquestação de IA & Scoring de Leads');

    await expect(page.locator('text=/INTEGRIDADE_SISTEMA/')).toBeVisible();

    const metric = page.locator('span.text-corporate-green').filter({ hasText: '90%' }).first();
    await expect(metric).toHaveCSS('color', 'rgb(159, 194, 67)');

    await expect(page.locator('h2').filter({ hasText: 'O Que Construímos' })).toBeVisible();
  });

  test('should pass axe-core accessibility checks on PT homepage', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/pt/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .exclude('.marquee-container')
      .exclude('.deco-text')
      .exclude('.icp-watermark')
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should pass axe-core accessibility checks on PT proof detail', async ({ page }) => {
    await page.goto('/pt/proof/pocuro/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('.h-captcha')
      .exclude('.marquee-container')
      .exclude('.deco-text')
      .exclude('.proof-meta')
      .disableRules(['color-contrast'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
