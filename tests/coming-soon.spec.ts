import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

// ──────────────────────────────────────────────
//  E2E + Accessibility Tests — AGLAYA Coming Soon
//  Updated for AI·gency / Agenc·IA branding
// ──────────────────────────────────────────────

test.describe('Coming Soon Page (Bilingual + A11y)', () => {

  test('EN Page: Full Audit', async ({ page }) => {
    // Emulate reduced-motion so animated elements start at opacity:1
    // (otherwise axe scans them mid-transition and fails color-contrast)
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // 1. Basic Content
    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toContainText(/uncomfortable/i);
    await expect(page.locator('h1')).toContainText(/ai/i);

    // 2. Logo & Branding
    const logo = page.locator('img[alt="AGLAYA"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', /.*aglaya-logo-blanco.*/);

    // 3. Header tagline
    const tagline = page.locator('header .header-tagline');
    await expect(tagline).toBeAttached();
    const taglineText = await tagline.textContent();
    expect(taglineText?.toLowerCase()).toContain('uncomfortable');

    // 4. Language Switcher
    const langLink = page.locator('a[hreflang="es"]');
    await expect(langLink).toBeVisible();
    await expect(page.locator('a[hreflang="es"] img')).toBeVisible();

    // 5. Skip link (a11y)
    await expect(page.locator('.skip-link')).toBeAttached();

    // 6. main#main-content (a11y skip target)
    await expect(page.locator('#main-content')).toBeAttached();

    // 7. Form Components
    await expect(page.locator('#contact-form')).toBeVisible();
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    await expect(page.locator('.h-captcha')).toBeAttached();

    // 8. Form labels present (a11y)
    await expect(page.locator('label[for="contact-name"]')).toBeAttached();
    await expect(page.locator('label[for="contact-email"]')).toBeAttached();
    await expect(page.locator('label[for="contact-message"]')).toBeAttached();

    // 9. WhatsApp CTA
    await expect(page.locator('a[href*="wa.me"]').first()).toBeVisible();

    // 10. Accessibility (axe-core WCAG 2AA)
    // .marquee-wrap is decorative animation (aria-hidden="true") — axe 4.11
    // still checks color-contrast on aria-hidden children, so exclude explicitly.
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.marquee-wrap')
      .exclude('.h-captcha')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('ES Page: Full Audit', async ({ page }) => {
    // Emulate reduced-motion so animated elements start at opacity:1
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/es/');

    // 1. Content Translation
    await expect(page).toHaveTitle(/AGLAYA/);
    await expect(page.locator('h1')).toContainText(/inc.moda/i);
    await expect(page.locator('h1')).toContainText(/agenc/i);

    // 2. Logo
    await expect(page.locator('img[alt="AGLAYA"]').first()).toBeVisible();

    // 3. Header tagline
    const tagline = page.locator('header .header-tagline');
    await expect(tagline).toBeAttached();

    // 4. Language Switcher
    await expect(page.locator('a[hreflang="en"]')).toBeVisible();

    // 5. main#main-content
    await expect(page.locator('#main-content')).toBeAttached();

    // 6. Accessibility (axe-core WCAG 2AA)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.marquee-wrap')
      .exclude('.h-captcha')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('SEO & Meta Parity — EN', async ({ page }) => {
    await page.goto('/');

    // Open Graph
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /.*og-default\.png/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');

    // Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');

    // hreflang — no SEO cannibalism
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://aglaya.biz/');
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', 'https://aglaya.biz/es/');
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://aglaya.biz/');

    // Canonical
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://aglaya.biz/');

    // LD+JSON
    const ldJson = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(ldJson || '{}');
    expect(data['@type']).toBe('Organization');
    expect(data['name']).toBe('AGLAYA');

    // Manifest
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
  });

  test('SEO & Meta Parity — ES', async ({ page }) => {
    await page.goto('/es/');

    // hreflang parity
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', 'https://aglaya.biz/es/');
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://aglaya.biz/');
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://aglaya.biz/');

    // Canonical
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://aglaya.biz/es/');

    // Spanish meta
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc?.toLowerCase()).toContain('agenc');
    const title = await page.locator('title').textContent();
    expect(title?.toLowerCase()).toContain('aglaya');
  });

  test('404 Page', async ({ page }) => {
    const response = await page.goto('/esta-pagina-no-existe');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
  });

});
