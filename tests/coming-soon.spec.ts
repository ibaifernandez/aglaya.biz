import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// ──────────────────────────────────────────────
//  E2E + Accessibility Tests (v2)
// ──────────────────────────────────────────────

test.describe('Coming Soon Page (Bilingual + A11y)', () => {

  test('EN Page: Full Audit', async ({ page }) => {
    await page.goto('/');

    // 1. Basic Content
    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toContainText(/uncomfortable/i);
    await expect(page.locator('h1')).toContainText(/agency/i);

    // 2. Logo & Branding
    const logo = page.locator('img[alt="AGLAYA"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', /.*aglaya-logo-white.*/);
    const tagline = page.locator('header span:has-text("THE UNCOMFORTABLE AGENCY")');
    await expect(tagline).toBeVisible();

    // 3. Language Switcher (Native Icon + Text)
    const langLink = page.locator('a[hreflang="es"]');
    await expect(langLink).toBeVisible();
    await expect(langLink).toContainText('ES');
    await expect(page.locator('a[hreflang="es"] svg')).toBeVisible(); // Check for native SVG icon

    // 4. Form Components (Contact Form)
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('.cf-turnstile')).toBeVisible();

    // 5. Contact Links
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();

    // 6. Accessibility (axe-core)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('ES Page: Full Audit', async ({ page }) => {
    await page.goto('/es/');

    // 1. Content Translation
    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toContainText(/agencia/i);
    await expect(page.locator('h1')).toContainText(/incómoda/i);

    // 2. Logo & Branding
    const logo = page.locator('img[alt="AGLAYA"]').first();
    await expect(logo).toBeVisible();
    const tagline = page.locator('header span:has-text("LA AGENCIA INCÓMODA")');
    await expect(tagline).toBeVisible();

    // 3. Language Switcher (Native Icon + Text)
    const langLink = page.locator('a[hreflang="en"]');
    await expect(langLink).toBeVisible();
    await expect(langLink).toContainText('EN');
    await expect(page.locator('a[hreflang="en"] svg')).toBeVisible();

    // 4. Accessibility (axe-core)
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('SEO & Meta Parity', async ({ page }) => {
    await page.goto('/');

    // Check Open Graph
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.*og-default\.png/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');

    // Check Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    // Check Manifest
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');

    // Check LD+JSON
    const ldJson = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(ldJson || '{}');
    expect(data['@type']).toBe('Organization');
    expect(data['name']).toBe('AGLAYA');
  });

});
