# ROADMAP — Project Timeline

## Phase 1: Coming Soon Page
**Status**: In Progress
**Target**: March 2026

### Milestone 1.0 — Foundation (Done)
- [x] Astro project scaffolding
- [x] Tailwind CSS v4 integration
- [x] Bilingual i18n system (EN/ES)
- [x] BaseLayout with full SEO metadata
- [x] Contact form component
- [x] Netlify Functions contact handler
- [x] Cloudflare Turnstile integration (later replaced by hCaptcha)
- [x] Resend email integration
- [x] Unit + E2E + A11y test suite
- [x] Brand assets (logos, favicons, flags)

### Milestone 1.1 — Production Launch (Current)
- [x] Git repository initialization and push to `ibaifernandez/aglaya.biz`
- [x] Netlify deployment with auto-deploy on `main`
- [x] Resend domain verified and `RESEND_API_KEY` set in Netlify
- [x] Sentry DSN set and working
- [x] `NOTIFY_EMAIL` set in Netlify env vars
- [x] Security headers in netlify.toml
- [ ] UptimeRobot monitors on `/` and `/es/`
- [ ] Lighthouse audit 95+

### Milestone 1.2 — Visual Impact
- [x] Cinematic Coming Soon hero: cursor glow, scanline, word-by-word animation
- [x] AI·gency / Agenc·IA bilingual branding pivot
- [x] OG image 1200×630 — real production screenshot
- [x] Clean minimal contact form (no icons, 24h response copy)
- [x] Custom 404 page (bilingual)
- [x] hCaptcha bot protection (replaced Cloudflare Turnstile)
- [x] Branded confirmation email (futuristic dark theme, bilingual EN/ES)
- [x] Bilingual confirmation email (EN/ES — sent in submission language)
- [x] Cookie consent banner (GDPR — localStorage-based, bilingual)
- [ ] View Transitions API for language switching

### Milestone 1.3 — v1.0.0 Release
- [x] Form end-to-end tested (1/3 successful submissions — 2 more pending)
- [ ] Form end-to-end tested — 2/3 complete (EN ✅ ES ✅, 1 pending)
- [ ] GitHub Release v1.0.0 tagged
- [ ] UptimeRobot monitors configured
- [ ] QA-USABILITY manual checklist completed
- [ ] QA-EMAIL manual checklist completed

---

## Phase 2: Full Website
**Target**: Q2–Q3 2026

### Milestone 2.0 — Design System
- [ ] Component library (buttons, cards, sections)
- [ ] Typography scale
- [ ] Spacing and grid system
- [ ] Animation library
- [ ] Dark/light theme tokens

### Milestone 2.1 — Core Pages
- [ ] Home page (hero, services, social proof, CTA)
- [ ] Services page
- [ ] About / Team page
- [ ] Contact page (enhanced)

### Milestone 2.2 — Content & Portfolio
- [ ] Portfolio / Case studies (filterable)
- [ ] Blog with MDX and Content Collections
- [ ] CMS integration

### Milestone 2.3 — Polish & Launch
- [ ] Privacy-first analytics
- [ ] Performance optimization
- [ ] Full SEO audit
- [ ] Production launch

---

## Phase 3: Growth (Future)
- [ ] Client portal / dashboard
- [ ] Automated lead scoring
- [ ] A/B testing framework
- [ ] Multi-language expansion (PT, FR)
