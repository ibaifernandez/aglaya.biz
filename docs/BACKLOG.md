# BACKLOG — Prioritized Task List

> Items ordered by priority within each category. Status: `todo` | `in-progress` | `done` | `blocked`

---

## Phase 1: Coming Soon (Current Sprint)

### Critical Path
| # | Task | Status | Notes |
|---|---|---|---|
| 1 | Initialize Git repo and push to GitHub | **done** | SSH → `ibaifernandez/aglaya.biz` |
| 2 | Configure Netlify deployment with auto-deploy | **done** | Auto-deploy on push to `main` |
| 3 | Set up Cloudflare Turnstile: create site widget | **done** | Site key `0x4AAAAAACr7qLXpzOQqF7Ni`; secret in Netlify env |
| 4 | Configure environment variables in Netlify | **in-progress** | `TURNSTILE_SECRET` ✅ · `PUBLIC_TURNSTILE_SITE_KEY` ✅ · `RESEND_API_KEY` ⏳ · `NOTIFY_EMAIL` ⏳ · `PUBLIC_SENTRY_DSN` ⏳ |
| 5 | Set up Resend: verify domain, create API key | **todo** | Next up — need API key + domain verification |
| 6 | Set up Sentry: create project, get DSN | **todo** | Fix `YOUR_BUNDLE_ID` in BaseLayout.astro |
| 7 | Set up UptimeRobot monitors | **todo** | Monitor `/` and `/es/` once Sentry is live |
| 8 | Add security headers in netlify.toml | **todo** | CSP, HSTS, X-Frame |

### UX/Design Enhancement
| # | Task | Status | Notes |
|---|---|---|---|
| 9 | Redesign Coming Soon page — cinematic hero | **done** | Cursor glow, scanline, word-by-word animation, marquee |
| 10 | AI·gency / Agenc·IA bilingual branding | **done** | EN: AI·gency · ES: Agenc·IA |
| 11 | OG image 1200×630 | **done** | Generated with `sharp`; editorial layout matching site |
| 12 | Clean contact form (no icons, minimal) | **done** | Pure inputs, 24h response copy |
| 13 | Add smooth page transitions between EN/ES | **todo** | View Transitions API |
| 14 | Create custom 404 page | **todo** | Bilingual |
| 15 | Optimize for Lighthouse 95+ | **todo** | After all integrations are live |

### Infrastructure
| # | Task | Status | Notes |
|---|---|---|---|
| 15 | Create custom 404 page | todo | Bilingual |
| 16 | Add security.txt and humans.txt | todo | Standard web files |
| 17 | Configure robots.txt | todo | Allow all, link sitemap |
| 18 | Add cookie consent (if analytics added) | todo | GDPR compliance |
| 19 | Set up CI/CD with GitHub Actions | todo | Lint, test, deploy |

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
