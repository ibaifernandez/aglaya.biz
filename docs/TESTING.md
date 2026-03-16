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
  - Form rendering (Turnstile presence).
- **Run**: `npm run test:e2e`

## 3. Accessibility (A11y)
Automated WCAG compliance checks integrated into the Playwright suite.
- **Checks**: Color contrast, ARIA labels, semantic roles, heading order.

## 4. Manual Verification
Always perform these checks before a major release:
- Language toggle behavior and state persistence.
- Form responsive layout on mobile vs desktop.
- Confirmation email formatting (live test in sandbox).
