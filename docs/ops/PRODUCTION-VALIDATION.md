---
status: active
domain: operations
owner: operations
source_of_truth: true
supersedes: []
superseded_by: []
last_reviewed: 2026-07-15
consumable_by_agents: true
---

# Production Validation — AGLAYA.BIZ

This document is the operational source of truth for production-readiness checks, smoke tests, and residual-risk classification after the April 2026 stabilization pass.

## Executive Verdict

`aglaya.biz` is production-viable.

The blocking regressions that affected the live site during the observability hardening pass have been resolved:

- CSP was adjusted so Astro runtime, cookie-consent gating, GTM, hCaptcha callbacks, and Cloudflare Insights can execute in production.
- Browser Sentry bootstrap no longer ships as a raw `.ts` asset or unresolved bare import.
- Proof logos no longer resolve to broken `src/assets/...` URLs on localized routes.
- Cookie consent gating again controls GTM correctly.
- Tag Assistant detects the live GTM container after consent is granted.

At the time of this review, the remaining browser-console noise is limited to `non-passive event listener` warnings. Those are treated as **non-blocking** unless they correlate with real scroll/input lag.

## Live-State Expectations

The current production implementation is expected to behave as follows:

- EN, ES, and PT routes are all published with parallel metadata and route structure.
- GTM only loads when `localStorage['aglaya_cookie_consent'] === 'all'`.
- The cookie banner is shown only when the consent key does not yet exist.
- Footer dispatch requires first name, email, privacy consent, and hCaptcha.
- `/contact` is a simple `ContactForm` (name/email/message + consent → `icp_status=OPEN_CHANNEL`); the ICP qualification funnel (qualified/borderline/open-channel branches) is embedded in `/roi-audit` (post PR #83).
- ROI Audit leads are marked with:
  - `inquiry_type = ROI_AUDIT_LEAD`
  - `entry_point = roi_audit`
  - `service_interest = roi_audit`
- Resend sends immediate user-facing confirmation emails for contact and dispatch flows.
- MailerLite groups are used for dispatch plus tier-based contact segmentation when configured.
- Sentry captures browser runtime, Astro SSR, and Netlify Function failures when DSN configuration is present.

## Resolved Production Blockers

### 1. CSP/runtime regression

**Symptom**

- Cookie banner logic failed.
- GTM could not be conditionally loaded.
- hCaptcha/GTM/Cloudflare scripts were blocked.
- Console showed multiple CSP violations.

**Resolution**

- `public/_headers` now contains the active CSP policy.
- `script-src`, `connect-src`, and related directives were aligned with the actual production runtime.
- `static.cloudflareinsights.com` and relevant analytics endpoints were explicitly allowed.

### 2. Browser Sentry bootstrap failure

**Symptom**

- Sentry browser bootstrap failed first with a MIME-type mismatch and later with `Failed to resolve module specifier "@sentry/browser"`.

**Resolution**

- Browser Sentry initialization now ships as an Astro-bundled component instead of a raw asset URL.
- The browser-side bootstrap is rendered through `src/components/SentryBrowser.astro`.

### 3. Proof asset 404s

**Symptom**

- `leben.png`, `norden.png`, and `pocuro.png` returned `404` on localized routes.

**Resolution**

- Proof logos are mapped through imported asset URLs inside `ProofCard.astro`.
- Frontmatter references are normalized instead of relying on broken source-relative URLs.

## Accepted Non-Blocking Warnings

### `non-passive event listener` warnings

**Status:** accepted for now

These warnings do **not** currently qualify as release blockers.

Treat them as operationally acceptable **unless** one of the following becomes observable:

- noticeable scroll jank
- degraded touch responsiveness on mobile
- measurable performance regression in field data or Lighthouse traces
- a clear link to custom app code rather than third-party/runtime code

Most likely sources at this stage:

- Astro client/runtime
- hCaptcha
- browser tooling / Tag Assistant
- other third-party listeners outside our critical-path logic

## Smoke Tests

Run these against the live production site after every meaningful deploy that affects runtime behavior, forms, observability, or consent.

### A. Browser Sentry smoke test

1. Open `https://aglaya.biz`.
2. Open browser DevTools.
3. In Console, run:

```js
window.dispatchEvent(new ErrorEvent('error', {
  message: '[SMOKE] AGLAYA production browser',
  error: new Error('[SMOKE] AGLAYA production browser')
}))
```

**Pass criteria**

- A new event appears in Sentry.
- The event lands in the active AGLAYA project.
- The event is tagged with `environment = production`.
- The event points to `https://aglaya.biz`.

### B. Cookie consent + GTM smoke test

1. Open production in a fresh tab.
2. Reset consent:

```js
localStorage.removeItem('aglaya_cookie_consent');
location.reload();
```

3. Confirm the banner appears.
4. Click `Accept all`.
5. Open Tag Assistant.

**Pass criteria**

- GTM container is detected after consent.
- GTM is not detected before consent.
- The cookie banner disappears and does not reappear on reload.

### C. Footer dispatch smoke test

1. Submit the footer form with:
   - first name
   - valid email
   - privacy consent checked
   - valid hCaptcha completion
2. Confirm the UI success state.
3. Confirm the subscriber receives the confirmation email.
4. Confirm a BCC copy reaches `info@aglaya.biz`.
5. Confirm the subscriber is captured in MailerLite when configured.

**Pass criteria**

- Success state visible in UI
- Immediate user-facing email received
- MailerLite capture or documented fallback capture succeeds

### D. ICP funnel branching smoke test (on `/roi-audit`)

Run all three branches from the ICP qualifier embedded in `/roi-audit`:

- `qualified`
- `borderline`
- `open_channel` / blocked branch

For each branch:

1. On `/roi-audit`, complete the ICP qualifier inputs until the correct branch appears.
2. Fill in the form.
3. Complete hCaptcha.
4. Submit.

Also test `/contact` separately: the simple `ContactForm` submits name/email/message + consent → `icp_status=OPEN_CHANNEL` (no branching).

**Pass criteria**

- Form submits successfully
- User receives confirmation email
- Internal copy reaches `info@aglaya.biz`
- Lead is routed to the correct MailerLite group when configured

### E. ROI Audit page smoke test

1. Enter via `/roi-audit/` (the ICP qualification funnel is embedded on the page itself).
2. Complete the qualifier and submit a valid request through the resulting branch.
3. Confirm the lead is ROI-tagged.

**Pass criteria**

- Submission succeeds from within the `/roi-audit` funnel
- Internal notification identifies the lead as ROI-tagged (`service_interest=roi_audit`)
- User-facing confirmation uses audit-specific wording in the submission language

### F. Proof/logo smoke test

1. Open EN, ES, and PT proof surfaces.
2. Confirm proof cards render their logos without console/network 404s.

**Pass criteria**

- No proof-logo asset 404s
- Card layout remains stable across locales

### G. CRM dispatch smoke test

1. Submit a lead through any form (`/contact` or a `/roi-audit` branch).
2. Confirm the Resend internal notification arrives at `info@aglaya.biz` (the canary).
3. In Sentry, confirm **no** `crm_outcome:failed|rejected|anomaly` capture for the submission (tag `stage=crm-dispatch`).
4. Cross-check the lead appears in the CRM panel (or is an intentional `excluded:true` drop).

**Pass criteria**

- Internal Resend canary received
- No `crm_outcome:{failed,rejected,anomaly}` in Sentry
- Deal present in CRM (or intentional exclusion)

## Manual Release Certification Checklist

### Routing and i18n

- [ ] `/`, `/es/`, `/pt/` load correctly
- [ ] `/contact/`, `/es/contact/`, `/pt/contact/` load correctly
- [ ] `/roi-audit/`, `/es/roi-audit/`, `/pt/roi-audit/` load correctly
- [ ] Language switcher preserves equivalent route where available
- [ ] `canonical` and `hreflang` tags remain consistent across EN/ES/PT

### Consent and analytics

- [ ] Cookie banner appears when `aglaya_cookie_consent` is absent
- [ ] `Essential only` suppresses GTM
- [ ] `Accept all` loads GTM
- [ ] Tag Assistant detects the live container after consent
- [ ] Consent state persists across reloads

### Forms and email automation

- [ ] Footer dispatch requires consent + hCaptcha
- [ ] Contact forms require consent + hCaptcha
- [ ] Dispatch confirmation email arrives
- [ ] Contact confirmation email arrives
- [ ] BCC copies reach `info@aglaya.biz`

### Observability

- [ ] Browser Sentry smoke test lands in production
- [ ] No fresh critical issues are created by the release
- [ ] Production deploy is green in Netlify

### Console sanity

- [ ] No CSP violations
- [ ] No unresolved module-import errors
- [ ] No asset 404s on key journeys
- [ ] Remaining console noise is limited to accepted warnings only

## Blocker Classification

Treat any of the following as a **release blocker**:

- GTM cannot be loaded even after consent
- Cookie banner fails to appear when consent is reset
- Sentry browser bootstrap fails
- contact or dispatch forms cannot submit
- hCaptcha does not render or validate
- user-facing confirmation emails do not arrive
- proof/logo assets 404 on production routes
- localized routes break canonical/hreflang parity

Treat the following as **non-blocking unless user impact is observed**:

- passive-listener warnings with no visible UX degradation
- isolated third-party console chatter that does not break functionality

## Evidence Pointers

The current live implementation depends primarily on:

- `src/layouts/BaseLayout.astro`
- `src/components/CookieBanner.astro`
- `src/components/SentryBrowser.astro`
- `src/components/DispatchSignupForm.astro`
- `src/components/ICPFilter.astro`
- `netlify/functions/contact.ts`
- `netlify/functions/_crm.ts` (CRM dispatch + consent ledger)
- `netlify/functions/dispatch-subscribe.ts`
- `public/_headers`
- `netlify.toml`

## Follow-Up Work (Not Required To Keep Production Viable)

- Add a visible “Cookie settings” re-open control instead of relying on `localStorage` reset for manual QA.
- Investigate non-passive listener warnings only if they correlate with measurable performance degradation.
- Replace the temporary CSP compromise (`'unsafe-inline'`) with nonce/hash-based hardening once the remaining inline runtime scripts are externalized.
