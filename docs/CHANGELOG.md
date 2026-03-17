# CHANGELOG

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- GitHub Actions CI workflow (unit tests → E2E + axe-core, sequential)
- Bilingual 404 page (`src/pages/404.astro`) with auto-detected lang
- Skip link + `#main-content` landmark for WCAG 2.4.1
- `@sentry/astro` integration replacing old CDN approach; `beforeSend` filter drops TurnstileError noise
- Security headers in `netlify.toml` (HSTS, X-Frame-Options, CSP, etc.)
- Docs: `GITHUB_CONFIG.md`, `NETLIFY_CONFIG.md`, `PLATFORMS_CONFIG.md`
- QA checklists: `QA-USABILITY.csv`, `QA-ACCESSIBILITY.csv`, `QA-EMAIL.csv`
- Full favicon fallback chain: SVG (rojo) → PNG 32/16 → ICO → apple-touch-icon

### Changed
- Migrated from suspended AGLAYA Netlify account → ibaifernandez Legacy Free (300 min/month)
- Turnstile sitekey fallback: `??` → `||` (fixes silent failure when env var is empty string)
- `role="complementary"` → `aria-hidden="true"` on marquee (decorative; was causing landmark violation)
- Contact eyebrow color: `#e8003d` (4.33:1, fails AA) → `#ff4d70` (6.5:1 ✓)
- Favicon: `aglaya-favicon-blanco.svg` had `fill:none` (invisible) → switched to `aglaya-favicon-rojo.svg`
- Resend API calls now check `res.ok` and throw on 4xx/5xx (previously silent on failure)

### Fixed
- Form success message disappeared with form (was inside `<form>` tag; moved outside)
- **Turnstile race condition**: `window.onTurnstileSuccess` defined in Astro module script (deferred) — Turnstile's async CDN script could call it before the module ran, leaving button permanently disabled. Fixed by defining callback in `<script is:inline>` (synchronous) before the Turnstile `<script src>` tag.
- Axe color-contrast false positives in CI: animated elements scanned at `opacity:0` mid-transition. Fixed by calling `page.emulateMedia({ reducedMotion: 'reduce' })` before `page.goto()` in E2E tests — triggers CSS `prefers-reduced-motion` rule that sets `opacity:1 !important` on all `[data-animate]` elements.

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
