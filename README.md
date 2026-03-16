# AGLAYA — The Uncomfortable Agency

![Build Status](https://img.shields.io/github/actions/workflow/status/ibaifernandez/aglaya.biz/deploy.yml?branch=main)
![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)
![Accessibility](https://img.shields.io/badge/a11y-verified-hotpink)

Bilingual Coming Soon page for AGLAYA digital marketing agency.

## 🚀 Features
- **Astro Static Build**: Ultra-fast performance.
- **Bilingual (EN/ES)**: subdirectory strategy with full SEO parity.
- **Lead Capture**: Resend API + Netlify Functions + Turnstile protection.
- **Branded SEO**: Custom OG images, JSON-LD Organization schema, and manifest.
- **Error Tracking**: Integrated Sentry monitoring.
- **Verified Suite**: Vitest (Unit) + Playwright (E2E) + Axe (A11y).

## 🛠 Tech Stack
- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Forms**: [Netlify Functions](https://www.netlify.com/products/functions/), [Resend](https://resend.com), [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Tracking**: [Sentry](https://sentry.io)
- **Testing**: [Vitest](https://vitest.dev), [Playwright](https://playwright.dev), [Axe-core](https://www.deque.com/axe/)

## 📖 Documentation
- [Architecture](./docs/ARCHITECTURE.md)
- [Workflow Setup](./docs/WORKFLOW-SETUP.md)
- [Services Setup](./docs/SERVICES.md)
- [Testing Guide](./docs/TESTING.md)

## 💻 Local Development
```bash
npm install
npm run dev
```

## 🧪 Running Tests
```bash
npm run test:unit # Unit tests
npm run test:e2e  # E2E tests
```

## 🌍 Environment Variables
Required in Netlify for full production functionality:
| Key | Description |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `TURNSTILE_SECRET` | Cloudflare Turnstile private key |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public key |
| `PUBLIC_SENTRY_DSN` | Sentry DSN |
| `NOTIFY_EMAIL` | Destination for lead notifications |

---
© 2026 AGLAYA.
