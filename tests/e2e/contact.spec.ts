import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function gotoContact(
  page: Parameters<typeof test>[0]['page'],
  path = '/contact/',
) {
  await page.addInitScript(() => {
    window.localStorage.setItem('aglaya_cookie_consent', 'essential');
  });
  await page.goto(path);
}

async function setRangeValue(
  page: Parameters<typeof test>[0]['page'],
  selector: string,
  value: string,
) {
  await page.locator(selector).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement;
    input.value = nextValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function checkHiddenOption(
  page: Parameters<typeof test>[0]['page'],
  selector: string,
) {
  await page.locator(selector).check({ force: true });
}

test.describe('Contact Page', () => {
  test('should switch language from contact page without breaking', async ({ page }) => {
    await gotoContact(page);

    // Toggle to ES (should navigate to /es/contact or /es/contact/)
    await page.click('.lang-switcher');
    await page.waitForURL(/\/es\/contact\/?$/);

    // Toggle back to EN
    await page.click('.lang-switcher');
    await page.waitForURL(/\/contact\/?$/);
  });

  test('should render the contact page with ICP filter', async ({ page }) => {
    await gotoContact(page);

    // Check page title
    await expect(page).toHaveTitle('Request Proposal — AGLAYA');

    // Check that the ICP filter is present
    await expect(page.locator('#icp-container')).toBeVisible();

    // Check that initial inputs are present
    await expect(page.locator('#icp-manual')).toBeVisible();
    await expect(page.locator('#icp-data-none')).toBeAttached();
    await expect(page.locator('#icp-investment-0')).toBeAttached();

    // Check that the live audit and evaluate button are present
    await expect(page.locator('#icp-audit-panel')).toBeVisible();
    await expect(page.locator('#icp-evaluate')).toBeVisible();
    await expect(page.locator('#icp-evaluate')).toContainText(/complete signal input/i);
    await expect(page.locator('#qualified-form #q-privacy-consent')).toBeAttached();
    await expect(page.locator('#borderline-form #b-privacy-consent')).toBeAttached();
    await expect(page.locator('#open-channel-form #oc-privacy-consent')).toBeAttached();
  });

  test('should surface a blocked state and keep an open contact channel for weak signals', async ({ page }) => {
    await gotoContact(page);

    await setRangeValue(page, '#icp-manual', '20');
    await checkHiddenOption(page, '#icp-data-none');
    await checkHiddenOption(page, '#icp-investment-0');

    await expect(page.locator('#icp-evaluate')).toContainText(/critical mass not reached/i);

    await page.locator('#icp-evaluate').click();

    await expect(page.locator('#icp-disqualified')).toBeVisible();
    await expect(page.locator('#open-channel-form input[name="name"]')).toBeVisible();
    await expect(page.locator('#open-channel-form textarea[name="message"]')).toBeVisible();
    await expect(page.locator('#open-channel-form input[name="icp_primary_state"]')).toHaveValue('blocked_investment');
    await expect(page.locator('#open-channel-form input[name="inquiry_type"]')).toHaveValue('BLOCKED_INVESTMENT_LEAD');
  });

  test('should show qualified form for strong operational signals', async ({ page }) => {
    await gotoContact(page);

    await setRangeValue(page, '#icp-manual', '80');
    await checkHiddenOption(page, '#icp-data-crm');
    await checkHiddenOption(page, '#icp-investment-2');

    await expect(page.locator('#icp-evaluate')).toContainText(/execute stress test/i);
    await page.locator('#icp-evaluate').click();

    await expect(page.locator('#icp-qualified')).toBeVisible();

    await expect(page.locator('#qualified-form input[name="name"]')).toBeVisible();
    await expect(page.locator('#qualified-form input[name="email"]')).toBeVisible();
    await expect(page.locator('#qualified-form input[name="company"]')).toBeVisible();
    await expect(page.locator('#qualified-form input[name="inquiry_type"]')).toBeHidden();
    await expect(page.locator('#qualified-form input[name="manual_execution"]')).toHaveValue('80');
    await expect(page.locator('#qualified-form input[name="data_infrastructure"]')).toHaveValue('crm');
  });

  test('should preserve ROI audit context through the qualification flow', async ({ page }) => {
    await gotoContact(
      page,
      '/contact/?type=roi-audit&entry_point=roi_audit&service_interest=roi_audit',
    );

    await expect(page.locator('main h1')).toContainText(/request the roi audit/i);

    await setRangeValue(page, '#icp-manual', '80');
    await checkHiddenOption(page, '#icp-data-crm');
    await checkHiddenOption(page, '#icp-investment-2');
    await page.locator('#icp-evaluate').click();

    await expect(page.locator('#icp-qualified')).toBeVisible();
    await expect(page.locator('#qualified-form input[name="inquiry_type"]')).toHaveValue('ROI_AUDIT_LEAD');
    await expect(page.locator('#qualified-form input[name="entry_point"]')).toHaveValue('roi_audit');
    await expect(page.locator('#qualified-form input[name="service_interest"]')).toHaveValue('roi_audit');
  });

  test('should push analytics events for ICP evaluation and qualified-form success', async ({ page }) => {
    await page.route('**/.netlify/functions/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await gotoContact(page);

    await setRangeValue(page, '#icp-manual', '80');
    await checkHiddenOption(page, '#icp-data-crm');
    await checkHiddenOption(page, '#icp-investment-2');
    await page.locator('#icp-evaluate').click();

    await expect(page.locator('#icp-qualified')).toBeVisible();

    await page.locator('#q-name').fill('Aglaya Signal');
    await page.locator('#q-email').fill('signal@example.com');
    await page.locator('#q-company').fill('AGLAYA');
    await page.locator('#q-message').fill('Audit the current operating system.');
    await page.locator('#q-privacy-consent').check({ force: true });
    await page.evaluate(() => {
      (window as any).onHCaptchaSuccessQualified('test_token');
    });
    await page.locator('#q-submit').click();

    await expect(page.locator('#q-success')).toBeVisible();

    const events = await page.evaluate(() =>
      (window as any).dataLayer
        .filter((entry: any) =>
          [
            'icp_evaluated',
            'icp_branch_viewed',
            'contact_form_submit_attempted',
            'contact_form_submit_succeeded',
          ].includes(entry.event),
        )
        .map((entry: any) => ({
          event: entry.event,
          icp_state: entry.icp_state ?? entry.icp_primary_state,
          form_type: entry.form_type ?? null,
        })),
    );

    expect(events).toEqual([
      {
        event: 'icp_evaluated',
        icp_state: 'qualified',
        form_type: null,
      },
      {
        event: 'icp_branch_viewed',
        icp_state: 'qualified',
        form_type: null,
      },
      {
        event: 'contact_form_submit_attempted',
        icp_state: 'qualified',
        form_type: 'qualified',
      },
      {
        event: 'contact_form_submit_succeeded',
        icp_state: 'qualified',
        form_type: 'qualified',
      },
    ]);
  });

  test('should show borderline form for transitional cases', async ({ page }) => {
    await gotoContact(page);

    await setRangeValue(page, '#icp-manual', '55');
    await checkHiddenOption(page, '#icp-data-sheet');
    await checkHiddenOption(page, '#icp-investment-1');

    await expect(page.locator('#icp-evaluate')).toContainText(/review transitional state/i);
    await page.locator('#icp-evaluate').click();

    await expect(page.locator('#icp-borderline')).toBeVisible();

    await expect(page.locator('#borderline-form input[name="name"]')).toBeVisible();
    await expect(page.locator('#borderline-form input[name="email"]')).toBeVisible();
    await expect(page.locator('#borderline-form textarea[name="message"]')).toBeVisible();
    await expect(page.locator('#borderline-form input[name="growth_investment"]')).toHaveValue('between_5_15');
  });

  test('should pass axe-core accessibility checks', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoContact(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .exclude('.h-captcha')         // hCaptcha has low-contrast warning in non-prod
      .exclude('.marquee-container') // decorative scrolling text, aria-hidden
      .exclude('.icp-watermark')     // opacity-10 design watermark, aria-hidden
      .exclude('.deco-text')         // opacity-based decorative labels, aria-hidden
      .analyze();

    expect(results.violations).toHaveLength(0);
  });
});
