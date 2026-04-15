---
status: active
domain: operations
owner: operations
source_of_truth: true
supersedes: []
superseded_by: []
last_reviewed: 2026-04-03
consumable_by_agents: true
---

# CHANGELOG — AGLAYA

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Changed

- Replace the AntiClient exclusion cards with five expanded exclusion principles, each with localized title/body copy in English, Spanish, and Portuguese.
- Reframe the ICP filter as a JTBD-based admission stress test with live audit feedback, stronger qualifying signals, and a stricter branch logic.
- Rebalance the ICP filter into a 66/33 diagnostic layout with a compact left-side input console, a sticky audit HUD, and stronger hover/focus feedback while preserving the dark console aesthetic.
- Rebuild the Economics section as a capital-model comparison with explicit client ownership, platform-fee clarity, and valuation-focused messaging instead of abstract ROI claims.
- Refactor the footer into a dispatch-signup conversion block with a single high-value email action, reduced navigation noise, and cleaner legal routing across EN, ES, and PT.

### Fixed

- Refresh proof E2E title assertions so they match the current localized POCURO case-study content.
- Relax hero headline clipping so uppercase diacritics render cleanly across English, Spanish, and Portuguese on the homepage.
- Language switcher (#lang-switcher) on header now uses server-side `href` fallback plus client-side recalculation to preserve pathname/search/hash and avoid stale `#` URLs after repeated toggles. This prevents scenarios where `/contact/` reload did not activate first-click due script race conditions or hash inconsistencies.
- Language switcher now supports non-JS fallback by setting `href` to `langLink` (previously `javascript:void(0)`), ensuring the toggle works even if client scripts fail.
- Restore full ICP contact-path functionality by requiring a real message in the borderline branch, capturing the hCaptcha token in every branch form, and opening a sendable fallback channel for blocked states with state-aware messaging.
- Replace the footer's broken `/terms` path and homepage-only hash links with working routes, and add a dedicated dispatch subscription function that uses MailerLite when configured with internal fallback capture when it is not.
- Restore Portuguese parity across the active contact flows by localizing live submit states in the footer and ICP forms, translating bot-verification labels, and sending PT confirmation emails from the contact function instead of falling back to English.
- Add GTM-friendly dataLayer instrumentation for the homepage funnel, including ICP evaluation/branch events plus dispatch and contact-form attempt/success/failure signals.
- Make the global skip link land on a focusable `#main-content` target with real keyboard focus and visible main-landmark feedback, then cover it with E2E regression checks.
- Route the footer dispatch form to the dedicated MailerLite subscriptions group with optional first-name capture, and add tier-aware MailerLite sync support for contact leads using the configured `cualificados`, `borderline`, and `no_cualificados` groups with backward-compatible legacy fallbacks.
- Send an immediate personalized Resend confirmation email for every successful footer dispatch signup, and only report signup success once both capture and confirmation complete.
- Turn the ROI Audit into a real request flow by routing `/roi-audit/` into contextualized contact forms, tagging submissions as `ROI_AUDIT_LEAD`, carrying `entry_point` and `service_interest` through the ICP flow, switching contact emails to ROI-specific copy, and updating the public/docs pricing language from fixed fee to scope-based quoting.
- Enforce hCaptcha and explicit privacy consent across every active form, copy confirmation emails to `info@aglaya.biz` for human QA via BCC, and rewrite the privacy policy so it matches the live Resend, MailerLite, hCaptcha, and analytics flows in EN, ES, and PT.
- Reinstate production-grade Sentry coverage across browser, Astro SSR, and Netlify form handlers; move hard security headers to `public/_headers`; tighten CSP around GTM, hCaptcha, fonts, and Sentry ingest; and align the docs/privacy copy with the live observability stack.
- Scrub literal Sentry org/project references from repo docs, derive Sentry environment labels from Netlify deploy context, and mark the public browser DSN as an intentional secret-scan omission so production deploys do not fail on public runtime config.
- Relax the production CSP script policy enough to restore Astro inline runtime, cookie consent, GTM gating, hCaptcha callbacks, and Cloudflare Insights, while forcing the browser Sentry bootstrap to emit as a real asset URL instead of an inlined `data:` script.
- Rename the browser Sentry bootstrap asset from `.ts` to `.js` so Netlify serves it with a valid JavaScript module MIME type in production.
- Replace the raw browser Sentry asset with an Astro-bundled client component so `@sentry/browser` resolves correctly in production, and map proof logos through imported asset URLs instead of broken `src/assets/...` relative paths.

---

## [1.0.0] — 2026-03-17

### Added

- GitHub Actions CI workflow (unit tests → E2E + axe-core, sequential)
- Bilingual 404 page (`src/pages/404.astro`) with auto-detected lang
- Skip link + `#main-content` landmark for WCAG 2.4.1
- `@sentry/astro` integration replacing old CDN approach
- Security headers in `netlify.toml` (HSTS, X-Frame-Options, CSP, etc.)
- Docs: `GITHUB_CONFIG.md`, `NETLIFY_CONFIG.md`, `PLATFORMS_CONFIG.md`
- QA checklists: `QA-USABILITY.csv`, `QA-ACCESSIBILITY.csv`, `QA-EMAIL.csv`
- Full favicon fallback chain: SVG (rojo) → PNG 32/16 → ICO → apple-touch-icon
- **hCaptcha bot protection** — complete replacement for Cloudflare Turnstile (see Changed)
- **Cookie consent banner** (`CookieBanner.astro`): fixed bottom position, brand-red 3px top bar, monospace `// COOKIES` eyebrow, "Accept all" (red) / "Essential only" (ghost) buttons, bilingual EN/ES, consent stored in `localStorage` key `aglaya_cookie_consent` (`all` or `essential`), slides up on first visit, never shown again after a decision, rendered in `BaseLayout.astro` below `<slot />`
- **Branded confirmation email** (new HTML design): red top/bottom bars, `// TRANSMISSION RECEIVED` / `// TRANSMISIÓN RECIBIDA` eyebrow, bold headline, red left-border message block, footer taglines ("AI executes. Humans strategize." / "La IA ejecuta. El humano estrategiza.")
- **Bilingual email flow**: confirmation email sent in the language the user submitted the form from (EN or ES); form passes `lang` to the serverless function; internal notification subject now includes `[EN]` or `[ES]` tag

### Changed

- **Cloudflare Turnstile → hCaptcha**: Turnstile had an unresolvable error 300030 on proxied Cloudflare domains. Completely removed. hCaptcha integrated throughout: widget (`class="h-captcha"`, `data-sitekey`, `data-theme="dark"`), script (`https://js.hcaptcha.com/1/api.js`), verify URL (`https://api.hcaptcha.com/siteverify`), env vars renamed (`TURNSTILE_SECRET` → `HCAPTCHA_SECRET`, `PUBLIC_TURNSTILE_SITE_KEY` → `PUBLIC_HCAPTCHA_SITE_KEY`)
- **Favicon**: was showing Astro logo (655 bytes) — replaced with correct AGLAYA red PNG favicon
- **OG image**: replaced auto-generated image with real production screenshot at 1200×630
- **Page titles updated**: EN: `AGLAYA — The Uncomfortable AI·gency`, ES: `AGLAYA — La Agenc·IA Incómoda`
- **Confirmation email subjects**: EN: `Signal received — AGLAYA`, ES: `Señal recibida — AGLAYA`
- Migrated from suspended AGLAYA Netlify account → ibaifernandez Legacy Free (300 min/month)
- `role="complementary"` → `aria-hidden="true"` on marquee (decorative; was causing landmark violation)
- Contact eyebrow color: `#e8003d` (4.33:1, fails AA) → `#ff4d70` (6.5:1 ✓)
- Resend API calls now check `res.ok` and throw on 4xx/5xx (previously silent on failure)

### Fixed

- Form success message disappeared with form (was inside `<form>` tag; moved outside)
- **hCaptcha IP parsing**: `x-forwarded-for` had comma-separated IPs; now uses `.split(",")[0].trim()` to extract the first (real) IP
- **Turnstile race condition** (now moot — Turnstile removed): `window.onTurnstileSuccess` defined in Astro module script (deferred) could be called before module ran, leaving button permanently disabled. Documented for reference.
- Axe color-contrast false positives in CI: animated elements scanned at `opacity:0` mid-transition. Fixed by calling `page.emulateMedia({ reducedMotion: 'reduce' })` before `page.goto()` in E2E tests
- **Sentry**: removed `beforeSend()` TurnstileError filter (no longer needed after Turnstile removal)
- **Cookie banner eyebrow**: `// COOKIES` label `#e8003d` at 10px monospace on `#0d0d0d` had insufficient luminosity — changed to `#ff4d6e`
- **Debug log in production**: `console.log("[contact] hCaptcha result:", ...)` added in PR #5 for diagnosis, survived into production after fix in PR #7 — removed

---

## [0.3.0] — 2026-03-16

### Added

- **Strategic pivot documentation**: `docs/brand/dna/BRAND-FOUNDATION.md`, `docs/MARKETING-OPERATING-SYSTEM.md`, `docs/SERVICE-CATALOG.md`, `docs/PLATFORM-SETUP.md`
- **AI·gency branding** (EN): "AI·gency" as the English expression of the pivot concept; "Agenc·IA" retained for ES
- **New OG image** 1200×630: editorial layout matching current site design (AGLAYA wordmark, radial red glow, tagline, body copy, red bottom stripe). Generated with `sharp` from SVG template.
- **Git repo initialized** and connected to `git@github.com:ibaifernandez/aglaya.biz.git` via SSH
- **Turnstile real site key** `0x4AAAAAACr7qLXpzOQqF7Ni` set as fallback in ContactForm; `TURNSTILE_SECRET` configured in Netlify env vars

### Changed

- **Contact form**: removed inline icons from input fields — pure minimal inputs, consistent with editorial aesthetic
- **Response time copy**: "4 hours" → "24 hours" in both EN and ES pages
- **`.gitignore`**: expanded from 2 lines to full Node/Astro/macOS coverage (dist, node_modules, .env, .DS_Store, logs, editor files)

### Fixed

- Merge conflict with remote history (remote had older design); resolved all add/add conflicts keeping local redesign

---

## [0.2.0] — 2026-03-16

### Added

- Contact form with name, email, message fields (`ContactForm.astro`)
- Netlify serverless function for form processing (`netlify/functions/contact.ts`)
- Cloudflare Turnstile bot protection integration
- Resend API email delivery (user confirmation + AI·gency notification)
- Sentry error tracking scaffolding in BaseLayout
- Icon components (User, Mail, MessageSquare, MessageCircle, Languages, Send)
- Unit tests for translations and contact function (Vitest)
- E2E tests with accessibility audit (Playwright + Axe-core)
- Documentation: ARCHITECTURE.md, TESTING.md, PLATFORMS-CONFIG.md, WORKFLOW-SETUP.md

### Changed

- Upgraded form from simple email capture to full contact form
- Enhanced BaseLayout with complete SEO metadata suite

---

## [0.1.0] — 2026-03

### Added

- Initial Astro 6.x project with Netlify adapter
- Tailwind CSS v4 via Vite plugin
- Bilingual support (EN/ES) with subdirectory routing
- BaseLayout with OG, Twitter Card, hreflang, JSON-LD
- Coming Soon hero section with marquee
- Brand assets: logo variants, favicons, flag icons
- Design tokens: brand red (#e8003d), Outfit + Inter fonts
- WhatsApp CTA button
- Language switcher with flag icons
