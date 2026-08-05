import { test, expect } from '@playwright/test';

/**
 * THE WHATSAPP BUTTON IN THE HEADER.
 *
 * It is a phone number written by hand in `src/components/Header.astro`, twice
 * — once for the desktop bar, once inside the mobile panel. Nothing derives it
 * and nothing checked it: a typo in the digits, a dropped `target`/`rel`, or a
 * Tailwind breakpoint edit that hides the button at every width would all ship
 * green. The failure is silent by construction — the header still renders, the
 * link still looks like a link, and the conversation just never arrives.
 *
 * So this guard asserts the three things that can actually break:
 *
 *   1. THE NUMBER. Exact, and identical in both copies and in all three
 *      locales. `wa.me` accepts any digits; a wrong one opens a chat with
 *      nobody.
 *   2. THE BUTTON IS REACHABLE. Visible in the desktop bar at desktop width,
 *      and reachable through the hamburger below the `xl` breakpoint. One
 *      viewport alone cannot prove this: the two copies are mutually exclusive
 *      by CSS.
 *   3. THE EXTERNAL-LINK CONTRACT. `target="_blank"` plus
 *      `rel="noopener noreferrer"`, and an accessible name — the desktop copy
 *      is icon-only, so its `aria-label` is the whole name a screen reader gets.
 *
 * NOT asserted: that the number belongs to AGLAYA, which no test can know. If
 * the number changes on purpose, this file changes with it, deliberately.
 */

const WHATSAPP_URL = 'https://wa.me/573224288532';

/** The `xl` breakpoint (1280px) is what switches the header between its two copies. */
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.describe('Header WhatsApp button', () => {
  test('should show the desktop button with the right number and link contract', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    // First in DOM order is the desktop copy; the mobile one lives in #mobile-menu.
    const button = page.locator(`#site-header a[href="${WHATSAPP_URL}"]`).first();

    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('target', '_blank');
    await expect(button).toHaveAttribute('rel', 'noopener noreferrer');
    // Icon-only button: the aria-label IS its accessible name.
    await expect(button).toHaveAttribute('aria-label', 'Chat on WhatsApp');
  });

  test('should reach the same number through the mobile menu', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    const button = page.locator(`#mobile-menu a[href="${WHATSAPP_URL}"]`);

    // Hidden until the hamburger is pressed — otherwise this would pass on a
    // panel that never opens.
    await expect(button).toBeHidden();

    await page.locator('#mobile-menu-toggle').click();

    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('target', '_blank');
    await expect(button).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(button).toContainText('WhatsApp');
  });

  test('should carry exactly two copies of the number, and no other wa.me link', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    // Desktop + mobile. A third copy, or a copy pointing somewhere else, means
    // the number stopped having a single source in the header.
    await expect(page.locator('#site-header a[href^="https://wa.me/"]')).toHaveCount(2);
    await expect(page.locator(`#site-header a[href="${WHATSAPP_URL}"]`)).toHaveCount(2);
  });

  test('should keep the same number in every locale', async ({ page }) => {
    await page.setViewportSize(DESKTOP);

    // The label is translated; the number is not. Both copies checked per locale.
    const labels: Array<[string, string]> = [
      ['/', 'Chat on WhatsApp'],
      ['/es/', 'Escríbenos por WhatsApp'],
      ['/pt/', 'Fale conosco pelo WhatsApp'],
    ];

    for (const [path, label] of labels) {
      await page.goto(path);
      await expect(
        page.locator(`#site-header a[href="${WHATSAPP_URL}"]`),
        `wrong or missing WhatsApp number at ${path}`,
      ).toHaveCount(2);
      await expect(page.locator(`#site-header a[aria-label="${label}"]`)).toHaveCount(1);
    }
  });
});
