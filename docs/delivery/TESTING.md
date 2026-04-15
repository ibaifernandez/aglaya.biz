# AGLAYA — Testing Strategy

This document defines the current automated and manual validation model for `aglaya.biz`.

## 1. Automated Checks

### Build

Used to validate Astro compilation, routing, content collections, and production bundling.

- **Command**: `npm run build`
- **Use before**:
  - every production push
  - any layout/component refactor
  - any observability/CSP/security-header change

### Unit Testing (Vitest)

Used for logic that does not require a browser.

- **Command**: `npm run test:unit`
- **Current coverage includes**:
  - Netlify Function validation and branching logic
  - MailerLite routing
  - dispatch/contact email orchestration guards
  - i18n-critical logic where applicable

### E2E Testing (Playwright + axe-core)

Used to validate real user behavior in a browser.

- **Command**: `npm run test:e2e`
- **Current coverage includes**:
  - homepage rendering
  - contact/ICP flow transitions
  - proof page routing/content assertions
  - accessibility scans on key routes
  - metadata/SEO checks
  - dispatch/contact success states where practical

### Full local suite

- **Command**: `npm test`

This runs:

1. `npm run test:unit`
2. `npm run test:e2e`

## 2. Cookie Consent Behavior In Tests

Many E2E tests pre-seed consent to keep the cookie banner from interfering with assertions unrelated to analytics or consent itself.

Example:

```js
await page.addInitScript(() => {
  localStorage.setItem('aglaya_cookie_consent', 'all');
});
```

This is intentional. Consent-specific behavior must still be tested manually in production and/or in dedicated scenarios.

## 3. Accessibility Strategy

Axe-core is integrated into the Playwright suite.

Automated accessibility checks cover:

- semantic roles
- landmark structure
- heading order
- contrast issues detectable by axe
- common ARIA misuse

To reduce false positives caused by entrance animations, tests that depend on stable visual states should emulate reduced motion before navigation when required.

## 4. Production Smoke Tests

The authoritative smoke-test protocol now lives in:

- `docs/ops/PRODUCTION-VALIDATION.md`

That document defines:

- release blockers
- accepted non-blocking console noise
- browser Sentry smoke test
- GTM/cookie-consent smoke test
- dispatch/contact/ROI-Audit live checks

## 5. Manual Release Certification

Before calling a production deploy healthy, manually verify:

### Routing and localization

- `/`, `/es/`, `/pt/`
- `/contact/`, `/es/contact/`, `/pt/contact/`
- `/roi-audit/`, `/es/roi-audit/`, `/pt/roi-audit/`

### Consent and analytics

- banner appears when `aglaya_cookie_consent` is absent
- GTM does not load before consent
- GTM loads after `Accept all`
- Tag Assistant detects the live container

### Forms

- footer dispatch
- qualified contact branch
- borderline contact branch
- open channel / blocked branch
- ROI Audit entry into contact

### Emails

- immediate user-facing confirmation
- BCC copy to `info@aglaya.biz`
- correct locale
- correct contextual copy

### Observability

- browser Sentry smoke test lands in the production project
- no critical fresh issues after deploy

## 6. Console Policy

The following are **blockers**:

- CSP violations
- unresolved module-import errors
- failed Sentry bootstrap
- asset 404s on key journeys
- GTM/consent runtime failures

The following are **not blockers by default**:

- `non-passive event listener` warnings with no observable user-impact

If those warnings become correlated with real jank, they should be promoted to a performance issue and investigated.
