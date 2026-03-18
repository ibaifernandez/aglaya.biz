# BACKLOG — Prioritized Task List

> Items ordered by priority within each category. Status: `todo` | `in-progress` | `done` | `blocked`

---

## Phase 1: Coming Soon (Current Sprint)

### Critical Path
| # | Task | Status | Notes |
|---|---|---|---|
| 1 | Initialize Git repo and push to GitHub | **done** | SSH → `ibaifernandez/aglaya.biz` |
| 2 | Configure Netlify deployment with auto-deploy | **done** | Auto-deploy on push to `main` |
| 3 | Set up hCaptcha: create site widget | **done** | Site key `a772dbf8-f0da-4658-a4be-5b0848440ac8`; secret in Netlify env |
| 4 | Configure environment variables in Netlify | **done** | `HCAPTCHA_SECRET` ✅ · `PUBLIC_HCAPTCHA_SITE_KEY` ✅ · `RESEND_API_KEY` ✅ · `NOTIFY_EMAIL` ✅ · `SENTRY_AUTH_TOKEN` ✅ |
| 5 | Set up Resend: verify domain, create API key | **done** | Domain verified, API key active |
| 6 | Set up Sentry: create project, get DSN | **done** | DSN set and working |
| 7 | Set up UptimeRobot monitors | **todo** | Monitor `/` and `/es/` |
| 8 | Add security headers in netlify.toml | **done** | CSP, HSTS, X-Frame configured |

### UX/Design Enhancement
| # | Task | Status | Notes |
|---|---|---|---|
| 9 | Redesign Coming Soon page — cinematic hero | **done** | Cursor glow, scanline, word-by-word animation, marquee |
| 10 | AI·gency / Agenc·IA bilingual branding | **done** | EN: AI·gency · ES: Agenc·IA |
| 11 | OG image 1200×630 | **done** | Generated with `sharp`; editorial layout matching site |
| 12 | Clean contact form (no icons, minimal) | **done** | Pure inputs, 24h response copy |
| 13 | Add smooth page transitions between EN/ES | **todo** | View Transitions API |
| 14 | Create custom 404 page | **done** | Bilingual |
| 15 | Optimize for Lighthouse 95+ | **todo** | After all integrations are live |
| 29 | Email redesign v2 — confirmation + notification | **todo** | Confirmation email: design improvable per user feedback. Internal notification: currently plain HTML, needs branding. Low priority post-v1.0.0 |

### Infrastructure
| # | Task | Status | Notes |
|---|---|---|---|
| 15 | Create custom 404 page | todo | Bilingual |
| 16 | Add security.txt and humans.txt | todo | Standard web files |
| 17 | Configure robots.txt | todo | Allow all, link sitemap |
| 18 | Add cookie consent (if analytics added) | **done** | GDPR compliance — localStorage-based, bilingual |
| 19 | Set up CI/CD with GitHub Actions | **done** | Lint, test, deploy |
| 30 | Migrate bot protection: hCaptcha → Google reCAPTCHA v3 (invisible) | **todo** | reCAPTCHA v3 is fully invisible (no user interaction), ML-based scoring, wider support. Tradeoff: Google privacy concerns; requires GDPR cookie consent update. Consider post-v1.0.0 if hCaptcha causes UX friction. |

### v1.0.0 Checklist
| # | Task | Status | Notes |
|---|---|---|---|
| 31 | Form E2E test 3/3 | **in-progress** | 2/3 complete (EN ✅, ES ✅). 1 more needed. |
| 32 | GitHub Release v1.0.0 | **todo** | After 3/3 form tests pass |
| 33 | UptimeRobot monitors | **todo** | 2 HTTPS monitors: aglaya.biz + aglaya.biz/es/ |
| 34 | Remove debug console.log from contact.ts | **todo** | Line: `console.log('[contact] hCaptcha result:', ...)` |

---

## Phase 2: Full Website (Future)
| # | Task | Status | Notes |
|---|---|---|---|
| 20 | Design system / component library | todo | Buttons, cards, grids |
| 21 | Home page — full redesign | todo | Hero, services, social proof |
| 22 | Services page | todo | Detailed service offerings |
| 23 | Portfolio / Case studies | todo | Filterable grid layout |
| 24 | About / Team page | todo | Team bios, values |
| 25 | Blog setup with MDX | todo | Content Collections |
| 26 | CMS integration evaluation | todo | Notion vs Contentful |
| 27 | Privacy-first analytics | todo | Plausible or Umami |
| 28 | Contact page (enhanced) | todo | Map, office info |
