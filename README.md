# AGLAYA — The Uncomfortable Agency

![Build Status](https://img.shields.io/github/actions/workflow/status/ibaifernandez/aglaya.biz/deploy.yml?branch=main)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)
![Accessibility](https://img.shields.io/badge/a11y-WCAG_2AA-hotpink)
![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8)

Bilingual Coming Soon page for **AGLAYA**, a digital marketing AI·gency that builds brands that convert.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6.x](https://astro.build) (SSR via Netlify) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Forms | [Netlify Functions](https://www.netlify.com/products/functions/) + [Resend](https://resend.com) |
| Bot Protection | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) |
| Error Tracking | [Sentry](https://sentry.io) |
| Monitoring | [UptimeRobot](https://uptimerobot.com) |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) + [Axe-core](https://www.deque.com/axe/) |

## Features

- **Bilingual (EN/ES)** — subdirectory routing with full SEO parity and hreflang
- **Complete Metadata** — OG, Twitter Cards, JSON-LD, canonical URLs
- **Lead Capture** — contact form with Turnstile + Resend dual notifications
- **Error Tracking** — Sentry integration
- **Accessible** — WCAG 2AA verified with Axe-core
- **Tested** — 100% coverage on critical paths

## Quick Start

```bash
npm install
npm run dev    # → http://localhost:4321
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server (port 4321) |
| `npm run build` | Production build |
| `npm run test:unit` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E + a11y |
| `npm test` | All tests |

## Environment Variables

Set in Netlify dashboard for production:

| Variable | Scope | Description |
|---|---|---|
| `RESEND_API_KEY` | Server | Resend API key |
| `TURNSTILE_SECRET` | Server | Turnstile secret key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Client | Turnstile public key |
| `PUBLIC_SENTRY_DSN` | Client | Sentry DSN |
| `NOTIFY_EMAIL` | Server | Lead notification email |

## Documentation

| Document | Description |
|---|---|
| [CLAUDE.md](./CLAUDE.md) | AI assistant instructions |
| [AGENTS.md](./AGENTS.md) | Multi-agent guidelines |
| [Architecture](./docs/ARCHITECTURE.md) | System architecture |
| [PRD](./docs/PRD.md) | Product requirements |
| [Backlog](./docs/BACKLOG.md) | Prioritized tasks |
| [Roadmap](./docs/ROADMAP.md) | Timeline and milestones |
| [IA Rules](./docs/IA-RULES.md) | IA and AI interaction rules |
| [Services](./docs/SERVICES.md) | Third-party setup |
| [Testing](./docs/TESTING.md) | Testing strategy |
| [Workflow](./docs/WORKFLOW-SETUP.md) | Dev workflow |
| [Changelog](./docs/CHANGELOG.md) | Version history |

## Project Structure

```
src/
├── pages/              # EN at /, ES at /es/
├── layouts/            # BaseLayout (SEO, meta)
├── components/         # ContactForm, icons
├── i18n/               # Translation system
├── styles/             # Tailwind v4 + tokens
└── assets/images/      # SVG brand assets
netlify/functions/      # Serverless handler
public/                 # Static assets
tests/                  # E2E + unit tests
docs/                   # Documentation
```

---
© 2026 AGLAYA. All rights reserved.
