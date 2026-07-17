# AGLAYA — The Uncomfortable AI·gency

![Build Status](https://img.shields.io/github/actions/workflow/status/ibaifernandez/aglaya.biz/ci.yml?branch=main&label=build)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)
![Accessibility](https://img.shields.io/badge/a11y-WCAG_2AA-hotpink)
![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8)

Trilingual website for **AGLAYA**, a digital marketing AI·gency. The Uncomfortable AI·gency — obsession, excellence, uncomfortable honesty.

## Brand Identity

**Primary Color**: `#e8003d` (brand red)
**Secondary Color**: `#9FC243` (corporate green)
**Background**: `#000000` (canvas)
**Surface**: `#080808` / `#0f0f0f`
**Typography**: Outfit (display/headings), Inter (body)

## Tech Stack

| Layer          | Technology                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| Framework      | [Astro 6.x](https://astro.build) (SSR via Netlify)                                                           |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com)                                                                   |
| Forms          | [Netlify Functions](https://www.netlify.com/products/functions/) + [Resend](https://resend.com)              |
| Bot Protection | [hCaptcha](https://www.hcaptcha.com)                                                                         |
| Error Tracking | [Sentry](https://sentry.io)                                                                                  |
| Monitoring     | [UptimeRobot](https://uptimerobot.com)                                                                       |
| Testing        | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) + [Axe-core](https://www.deque.com/axe/) |

## Features

- **Trilingual (EN/ES/PT)** — subdirectory routing with full SEO parity and hreflang
- **Complete Metadata** — OG, Twitter Cards, JSON-LD, canonical URLs
- **Lead Capture** — admission-gated contact flows and footer dispatch with hCaptcha, Resend autoresponses, and MailerLite routing where configured
- **Error Tracking** — Sentry in browser, Astro SSR, and Netlify form handlers when DSN is configured
- **Consent-Gated Analytics** — GTM loads only after explicit cookie consent
- **Security Headers** — canonical `_headers` file with CSP, HSTS, anti-framing, and isolation headers
- **Accessible** — WCAG 2AA verified with Axe-core
- **Tested** — 100% coverage on critical paths

## Quick Start ✅

```bash
npm install
npm run dev    # → http://localhost:4321
```

## Commands

| Command             | Description            |
| ------------------- | ---------------------- |
| `npm run dev`       | Dev server (port 4321) |
| `npm run build`     | Production build       |
| `npm run test:unit` | Vitest unit tests      |
| `npm run test:e2e`  | Playwright E2E + a11y  |
| `npm test`          | All tests              |

## Environment Variables

Set in Netlify dashboard for production:

| Variable                   | Scope  | Description             |
| -------------------------- | ------ | ----------------------- |
| `RESEND_API_KEY`           | Server | Resend API key          |
| `HCAPTCHA_SECRET`          | Server | hCaptcha secret key     |
| `PUBLIC_HCAPTCHA_SITE_KEY` | Client | hCaptcha site key       |
| `PUBLIC_SENTRY_DSN`        | Client | Sentry DSN for browser + shared runtime config |
| `SENTRY_DSN`               | Server | Optional server-only DSN override for Astro/Functions |
| `SENTRY_AUTH_TOKEN`        | Build | Optional source-map upload token |
| `SENTRY_ORG`               | Build | Optional Sentry org slug for source-map upload |
| `SENTRY_PROJECT`           | Build | Optional Sentry project slug for source-map upload |
| `NOTIFY_EMAIL`             | Server | Lead notification email |
| `MAILERLITE_API_KEY`       | Server | MailerLite API key |
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | Server | Dispatch subscription group |
| `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` | Server | Non-qualified lead group |
| `MAILERLITE_CUALIFICADOS_GROUP_ID` | Server | Qualified lead group |
| `MAILERLITE_BORDERLINE_GROUP_ID` | Server | Borderline lead group |

Sentry environment labels are derived automatically from Netlify deploy context (`production`, `deploy-preview`, `branch-deploy`, `preview`, `development`), so no separate public environment variable is required for normal operation.

## Documentation

| Document | Description |
| --- | --- |
| [CLAUDE.md](./CLAUDE.md) | AI assistant instructions |
| [AGENTS.md](./AGENTS.md) | Multi-agent guidelines |
| [docs/README.md](./docs/README.md) | Master map of the documentation corpus |
| [docs/tech/ARCHITECTURE.md](./docs/tech/ARCHITECTURE.md) | Current system architecture |
| [docs/tech/3RD-PARTIES-CONFIG.md](./docs/tech/3RD-PARTIES-CONFIG.md) | Master third-party/service configuration guide |
| [docs/delivery/TESTING.md](./docs/delivery/TESTING.md) | Automated and manual testing strategy |
| [docs/ops/PRODUCTION-VALIDATION.md](./docs/ops/PRODUCTION-VALIDATION.md) | Smoke tests, blockers, and production-readiness checks |
| [docs/MASTER-TASKLIST.md](./docs/MASTER-TASKLIST.md) | Everything outstanding (single source of truth) |
| [docs/tech/DEVELOPMENT-WORKFLOW.md](./docs/tech/DEVELOPMENT-WORKFLOW.md) | Development workflow |
| [docs/tech/IA-RULES.md](./docs/tech/IA-RULES.md) | IA and AI interaction rules |
| [docs/ops/CHANGELOG.md](./docs/ops/CHANGELOG.md) | Version history |

## Security Headers

Netlify security headers are now sourced from [`public/_headers`](./public/_headers), not `netlify.toml`. That file is the single source of truth for CSP, HSTS, anti-framing, and related browser hardening.

## Project Structure

```
src/
├── pages/              # EN at /, ES at /es/, PT at /pt/
├── layouts/            # BaseLayout (SEO, meta)
├── components/         # ICP filter, proof, footer, form branches
├── i18n/               # Translation system
├── styles/             # Tailwind v4 + tokens
└── assets/images/      # SVG brand assets
netlify/functions/      # Serverless handlers
public/                 # Static assets
tests/                  # E2E + unit tests
docs/                   # Documentation
```

---

© 2026 AGLAYA. All rights reserved.
