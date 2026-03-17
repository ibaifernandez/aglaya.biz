# CHANGELOG

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- Resend integration pending (API key + domain verification)
- Sentry DSN configuration pending (fix `YOUR_BUNDLE_ID` in BaseLayout)
- UptimeRobot monitor pending (awaiting live URL confirmation)

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
