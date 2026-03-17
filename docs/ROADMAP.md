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
- [x] Cloudflare Turnstile integration
- [x] Resend email integration
- [x] Unit + E2E + A11y test suite
- [x] Brand assets (logos, favicons, flags)

### Milestone 1.1 — Production Launch (Current)
- [x] Git repository initialization and push to `ibaifernandez/aglaya.biz`
- [x] Netlify deployment with auto-deploy on `main`
- [x] Cloudflare Turnstile configured (`TURNSTILE_SECRET` + `PUBLIC_TURNSTILE_SITE_KEY` in Netlify)
- [ ] Resend domain verified and `RESEND_API_KEY` set in Netlify
- [ ] Sentry project created, DSN set, `YOUR_BUNDLE_ID` fixed in BaseLayout
- [ ] `NOTIFY_EMAIL` set in Netlify env vars
- [ ] UptimeRobot monitors on `/` and `/es/`
- [ ] Security headers in netlify.toml
- [ ] Lighthouse audit 95+

### Milestone 1.2 — Visual Impact (Done ahead of schedule)
- [x] Cinematic Coming Soon hero: cursor glow, scanline, word-by-word animation
- [x] AI·gency / Agenc·IA bilingual branding pivot
- [x] OG image 1200×630 — editorial layout with brand identity
- [x] Clean minimal contact form (no icons, 24h response copy)
- [ ] View Transitions API for language switching
- [ ] Custom 404 page (bilingual)

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
