---
status: active
domain: architecture
owner: engineering
source_of_truth: true
last_reviewed: 2026-04-15
consumable_by_agents: true
---

# 3RD-PARTY CONFIGURATION — MASTER GUIDE

This is the master guide for AGLAYA.BIZ external services.
Any change to environment variables, third-party routing, or production observability must be reflected here.

---

## 1. GitHub Infrastructure

**Repositorio:** `ibaifernandez/aglaya.biz`
**URL:** [github.com/ibaifernandez/aglaya.biz](https://github.com/ibaifernandez/aglaya.biz)

### 🛡️ Branch Protection: "Protect main"
- **Target:** `main`
- **Restrict Deletions:** ✅ Activo
- **Block Force Pushes:** ✅ Activo
- **Status Checks:** ✅ Requeridos (Unit Tests + E2E/A11y)

### 🔑 Actions / CI notes

The main CI pipeline validates build, unit tests, and Playwright E2E checks. Third-party runtime secrets are primarily managed in Netlify, not in GitHub Actions.

---

## 2. Netlify Infrastructure

**Proyecto:** `aglaya`
**Dominio:** [aglaya.biz](https://aglaya.biz)

### ⚙️ Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 22 (via `NODE_VERSION` env var)

### 🔑 Environment Variables
Configured in **Site settings → Environment variables**

| Variable | Scope | Propósito |
|---|---|---|
| `RESEND_API_KEY` | All | Authentication for user-facing confirmations and internal notifications |
| `HCAPTCHA_SECRET` | All | Server-side hCaptcha verification |
| `PUBLIC_HCAPTCHA_SITE_KEY` | All | Client-side hCaptcha widget key |
| `NOTIFY_EMAIL` | All | Internal notification address (`info@aglaya.biz`) |
| `MAILERLITE_API_KEY` | All | MailerLite API authentication |
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | All | Footer dispatch subscription group |
| `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` | All | Non-qualified / open-channel lead group |
| `MAILERLITE_BORDERLINE_GROUP_ID` | All | Borderline lead group |
| `MAILERLITE_CUALIFICADOS_GROUP_ID` | All | Qualified lead group |
| `PUBLIC_SENTRY_DSN` | All | Public browser DSN and shared runtime fallback |
| `SENTRY_DSN` | All | Optional server-only DSN override for Astro SSR and Netlify Functions |
| `SENTRY_AUTH_TOKEN` | Build | Optional source-map upload token |
| `SENTRY_ORG` | Build | Sentry org slug for source-map uploads |
| `SENTRY_PROJECT` | Build | Sentry project slug for source-map uploads |

`PUBLIC_SENTRY_ENVIRONMENT` is intentionally **not** used anymore. Environment labels are derived from Netlify deploy context.

---

## 3. Integrated Services

### 📧 Resend (Email API)
- **Status:** ✅ Active.
- **Role:** Transactional mail only.
- **Used by:**
  - `contact.ts`
  - `dispatch-subscribe.ts`
- **Expected outcomes:**
  - immediate user confirmation
  - internal notification / BCC to `info@aglaya.biz`

### 🛡️ hCaptcha (Bot Protection)
- **Status:** ✅ Active.
- **Legacy note:** replaces historical Turnstile implementation.
- **Coverage:** footer dispatch + all active contact branches.
- **Validation:** server-side against `https://api.hcaptcha.com/siteverify`.

### 📬 MailerLite
- **Status:** ✅ Active when group IDs are configured.
- **Role:** list management and tier segmentation.
- **Routing model:**
  - dispatch → subscriptions group
  - qualified leads → qualified group
  - borderline leads → borderline group
  - blocked/open-channel leads → non-qualified group

### 🐞 Sentry (Error Tracking)
- **Status:** ✅ Active when DSN is configured.
- **Browser runtime:** `src/components/SentryBrowser.astro`
- **Astro SSR:** `@sentry/astro` integration in `astro.config.mjs`
- **Netlify Functions:** `netlify/functions/_sentry.ts`
- **Source maps:** optional; require `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`
- **Privacy:** `sendDefaultPii: false` across browser, SSR, and functions

### 📈 Google Tag Manager
- **Status:** ✅ Active
- **Container:** `GTM-5BVC9C5C`
- **Gating rule:** only loads when `aglaya_cookie_consent === 'all'`
- **Trigger path:** `BaseLayout.astro` + `CookieBanner.astro`

### 🔐 Security Headers
- **Source of truth:** `public/_headers`
- **Coverage:** CSP, HSTS, anti-framing, opener/resource policy, permissions policy, and immutable cache rules for `/_astro/*` and `/assets/*`

### ⏱️ UptimeRobot (Monitoring)
- **Monitors:**
  - `AGLAYA EN`: [aglaya.biz/](https://aglaya.biz/) (5 min)
  - `AGLAYA ES`: [aglaya.biz/es/](https://aglaya.biz/es/) (5 min)
- **Alerts:** routed to `info@aglaya.biz`
- **Status:** verify directly in the UptimeRobot dashboard when performing ops sign-off

### 📦 Migadu (Email Management)
- **Primary mailbox:** `info@aglaya.biz`
- **DNS:** MX, SPF, DKIM, and DMARC managed via Cloudflare

---

## 🚀 Post-Deploy Checklist
- [ ] EN / ES / PT routes load correctly
- [ ] Cookie banner appears when consent is reset
- [ ] GTM loads only after `Accept all`
- [ ] Dispatch form submits end-to-end
- [ ] Contact branches submit end-to-end
- [ ] User confirmation emails are received
- [ ] `info@aglaya.biz` receives BCC/internal copies
- [ ] Sentry browser smoke test lands in production
- [ ] `_headers` is deployed and no CSP regressions appear
- [ ] Remaining console output is limited to accepted non-blocking warnings
