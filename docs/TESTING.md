# AGLAYA v2 — Testing Strategy

We maintain 100% test coverage for critical paths to ensure "open-heart surgery" precision.

## 1. Unit Testing (Vitest)
Used for logic that doesn't require a browser.
- **Coverage**: i18n translation keys, serverless function validation logic.
- **Run**: `npm run test:unit`

## 2. E2E Testing (Playwright)
Simulates real user behavior in a headless browser.
- **Coverage**:
  - Visual consistency across EN/ES.
  - Link integrity (Contact, WhatsApp).
  - SEO tagging (Meta, OG, Twitter).
  - Accessibility (axe-core audit).
  - Form rendering (hCaptcha widget + disabled button state).
- **Run**: `npm run test:e2e`

### Cookie Banner in E2E
E2E tests pre-set cookie consent via `localStorage` before page navigation to avoid banner interference with other test assertions:

```js
await page.addInitScript(() => {
  localStorage.setItem('aglaya_cookie_consent', 'all');
});
```

The `#cookie-banner` element is excluded from axe-core scans in tests that focus on other page areas, since the banner's own a11y is tested separately.

## 3. Accessibility (A11y)
Automated WCAG compliance checks integrated into the Playwright suite.
- **Checks**: Color contrast, ARIA labels, semantic roles, heading order.
- `page.emulateMedia({ reducedMotion: 'reduce' })` is called before `page.goto()` to prevent animated elements being scanned at `opacity:0`, which would cause false color-contrast failures.

## 4. Manual Verification
Always perform these checks before a major release:
- Language toggle behavior and state persistence.
- Form responsive layout on mobile vs desktop.
- Confirmation email formatting (live test — check EN and ES versions).
- Cookie banner appears on first visit (incognito), dismissed state persists in `localStorage` (`aglaya_cookie_consent`).
- Cookie banner does not reappear after a decision (reload test).
- Cookie banner ES version shows correct Spanish strings on `/es/`.
