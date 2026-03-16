import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────
//  AGLAYA Coming Soon — Test Suite
//  Covers: EN (/) and ES (/es/) pages
// ─────────────────────────────────────────────

test.describe('EN page (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('html[lang] is "en"', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('<title> contains "AGLAYA"', async ({ page }) => {
    await expect(page).toHaveTitle(/AGLAYA/i);
  });

  test('<meta name="description"> is present and non-empty', async ({ page }) => {
    const desc = await page.getAttribute('meta[name="description"]', 'content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
  });

  test('og:title is present', async ({ page }) => {
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    expect(ogTitle).toBeTruthy();
  });

  test('og:image is present', async ({ page }) => {
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
    expect(ogImage).toBeTruthy();
  });

  test('hreflang alternate links are present', async ({ page }) => {
    const enHreflang = await page.getAttribute('link[hreflang="en"]', 'href');
    const esHreflang = await page.getAttribute('link[hreflang="es"]', 'href');
    const xDefault  = await page.getAttribute('link[hreflang="x-default"]', 'href');
    expect(enHreflang).toBeTruthy();
    expect(esHreflang).toBeTruthy();
    expect(xDefault).toBeTruthy();
  });

  test('No Tailwind CDN script in source', async ({ page }) => {
    const cdnScript = page.locator('script[src*="cdn.tailwindcss.com"]');
    await expect(cdnScript).toHaveCount(0);
  });

  test('AGLAYA logo wordmark visible', async ({ page }) => {
    await expect(page.getByText('AGLAYA').first()).toBeVisible();
  });

  test('"COMING SOON" label visible', async ({ page }) => {
    await expect(page.getByText(/coming soon/i)).toBeVisible();
  });

  test('H1 heading visible and contains key text', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text.toLowerCase()).toContain('uncomfortable');
  });

  test('Email input field is present', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('Submit button is present', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('Email CTA link is present', async ({ page }) => {
    const emailLink = page.locator('a[href="mailto:hola@aglaya.biz"]').first();
    await expect(emailLink).toBeVisible();
  });

  test('WhatsApp CTA link is present', async ({ page }) => {
    const waLink = page.locator('a[href*="wa.me"]').first();
    await expect(waLink).toBeVisible();
  });

  test('Marquee section is present and has service text', async ({ page }) => {
    const marquee = page.locator('[aria-label="Services"]');
    await expect(marquee).toBeVisible();
    const text = await marquee.innerText();
    expect(text.toLowerCase()).toContain('brand strategy');
  });

  test('Language switcher link to /es/ is present', async ({ page }) => {
    const esLink = page.locator('a[hreflang="es"]').first();
    await expect(esLink).toBeVisible();
  });
});

// ─────────────────────────────────────────────
//  ES page (/es/)
// ─────────────────────────────────────────────

test.describe('ES page (/es/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es/');
  });

  test('html[lang] is "es"', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('es');
  });

  test('<title> contains "AGLAYA"', async ({ page }) => {
    await expect(page).toHaveTitle(/AGLAYA/i);
  });

  test('<meta name="description"> is present and non-empty', async ({ page }) => {
    const desc = await page.getAttribute('meta[name="description"]', 'content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(20);
  });

  test('"PRÓXIMAMENTE" label visible', async ({ page }) => {
    await expect(page.getByText(/próximamente/i)).toBeVisible();
  });

  test('H1 heading in Spanish visible', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(text.toLowerCase()).toContain('agencia');
  });

  test('Email input field is present', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('Submit button is present', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Marquee section is present', async ({ page }) => {
    const marquee = page.locator('[aria-label="Servicios"]');
    await expect(marquee).toBeVisible();
  });

  test('Language switcher link to / is present', async ({ page }) => {
    const enLink = page.locator('a[hreflang="en"]').first();
    await expect(enLink).toBeVisible();
  });
});
