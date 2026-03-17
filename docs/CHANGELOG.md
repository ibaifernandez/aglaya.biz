# CHANGELOG

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/).

---

## [Unreleased]

### Added
- Comprehensive documentation suite: CLAUDE.md, AGENTS.md, PRD, BACKLOG, ROADMAP, CHANGELOG, IA-RULES
- Updated and expanded existing documentation

---

## [0.2.0] — 2026-03-16

### Added
- Contact form with name, email, message fields (`ContactForm.astro`)
- Netlify serverless function for form processing (`netlify/functions/contact.ts`)
- Cloudflare Turnstile bot protection integration
- Resend API email delivery (user confirmation + agency notification)
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
