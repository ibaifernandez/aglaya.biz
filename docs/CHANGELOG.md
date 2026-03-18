# CHANGELOG

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

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

---

## [0.3.0] — 2026-03-16

### Added
- **Strategic pivot documentation**: `docs/BRAND-STRATEGY.md`, `docs/MARKETING-STRATEGY.md`, `docs/SERVICES-AI.md`, `docs/PLATFORM-SETUP.md`
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
- Documentation: ARCHITECTURE.md, TESTING.md, SERVICES.md, WORKFLOW-SETUP.md

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
