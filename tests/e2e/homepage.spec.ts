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
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('#dispatch-form')).toBeVisible();
    await expect(page.locator('#dispatch-email')).toBeVisible();
    await expect(page.locator('#dispatch-form .h-captcha')).toBeVisible();
    await expect(page.locator('#dispatch-privacy-consent')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');

    // Desktop nav has anchor links to homepage sections
    // .first() because mobile nav also has the same links (hidden at desktop width)
    await expect(page.locator('a[href="/#systems"]').first()).toBeVisible();
    await expect(page.locator('a[href="/#proof"]').first()).toBeVisible();
    await expect(page.locator('a[href="/#economics"]').first()).toBeVisible();
  });

  test('should move keyboard users to the main landmark via the skip link', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('main#main-content')).toBeFocused();
    await expect(page).toHaveURL(/#main-content$/);
  });

  test('should push dispatch analytics events on successful footer signup', async ({ page }) => {
    await page.route('**/.netlify/functions/dispatch-subscribe', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/');
    await page.locator('#dispatch-email').fill('signal@example.com');
    await page.locator('#dispatch-privacy-consent').check({ force: true });
    await page.evaluate(() => {
      (window as any).onHCaptchaSuccessDispatch('test_token');
    });
    await page.locator('#dispatch-submit').click();
    await expect(page.locator('#dispatch-success')).toBeVisible();

    const events = await page.evaluate(() =>
      (window as any).dataLayer
        .filter((entry: any) =>
          entry.event === 'dispatch_signup_attempted' || entry.event === 'dispatch_signup_succeeded',
        )
        .map((entry: any) => ({
          event: entry.event,
          form_type: entry.form_type,
          form_location: entry.form_location,
        })),
    );

    expect(events).toEqual([
      {
        event: 'dispatch_signup_attempted',
        form_type: 'dispatch',
        form_location: 'footer',
      },
      {
        event: 'dispatch_signup_succeeded',
        form_type: 'dispatch',
        form_location: 'footer',
      },
    ]);
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
