# CLAUDE.md — Project Instructions for AI Assistants

## Project Overview
**AGLAYA** ("The Uncomfortable Agency") — bilingual (EN/ES) digital marketing agency website built with Astro, deployed on Netlify. Currently in "Coming Soon" phase transitioning to full site.

## Tech Stack
- **Framework**: Astro 6.x (SSR via Netlify adapter)
- **Styling**: Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- **Serverless**: Netlify Functions (`netlify/functions/`)
- **Email**: Resend API
- **Bot Protection**: Cloudflare Turnstile
- **Error Tracking**: Sentry (browser SDK)
- **Monitoring**: UptimeRobot
- **Testing**: Vitest (unit) + Playwright (E2E) + Axe-core (a11y)

## Key Commands
```bash
npm run dev        # Start dev server (port 4321)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run test:unit  # Vitest unit tests
npm run test:e2e   # Playwright E2E + accessibility
```

## Project Structure
```
src/
├── pages/           # Astro pages (/ = EN, /es/ = ES)
├── layouts/         # BaseLayout.astro (SEO, meta, structured data)
├── components/      # ContactForm.astro, icons/
├── i18n/            # translations.ts (useTranslations helper)
├── styles/          # global.css (Tailwind v4 + design tokens)
└── assets/images/   # SVG brand assets
netlify/functions/   # Serverless contact handler
public/              # Static assets, favicons, OG images
tests/               # E2E specs + unit tests
docs/                # Project documentation
```

## Architecture Decisions
- **i18n**: Subdirectory strategy (EN at `/`, ES at `/es/`). Full hreflang parity.
- **Forms**: Client → Turnstile validation → Netlify Function → Resend (dual email: confirmation + lead notification)
- **Styling**: Tailwind v4 via Vite plugin, NOT PostCSS. Design tokens defined in `@theme` block.
- **Fonts**: Outfit (display/headings), Inter (body). Loaded via Google Fonts with preconnect.

## Brand Identity
- **Primary color**: `#e8003d` (brand red)
- **Background**: `#080808` (near-black)
- **Surface**: `#111111`
- **Typography**: Outfit 300–900, Inter 300–700
- **Tagline EN**: "The Uncomfortable Agency"
- **Tagline ES**: "La Agencia Incómoda"

## Coding Conventions
- All text must be bilingual (EN + ES). Use `src/i18n/translations.ts` for all user-facing strings.
- Semantic HTML with ARIA attributes. Every form field needs labels.
- All pages must pass Axe-core WCAG 2AA audit.
- Use Astro components (`.astro`) for static content; reserve `<script>` for client interactivity.
- Environment variables: prefix `PUBLIC_` for client-exposed values.
- CSS: prefer Tailwind utilities; custom CSS only in `global.css` or scoped `<style>` blocks.

## Environment Variables (Production — set in Netlify)
| Variable | Scope | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Server | Resend email API key |
| `TURNSTILE_SECRET` | Server | Cloudflare Turnstile secret |
| `PUBLIC_TURNSTILE_SITE_KEY` | Client | Turnstile widget site key |
| `PUBLIC_SENTRY_DSN` | Client | Sentry project DSN |
| `NOTIFY_EMAIL` | Server | Lead notification recipient |

## Do NOT
- Modify `astro.config.mjs` without understanding the Netlify adapter implications.
- Use `React`, `Vue`, or other UI frameworks — this is a pure Astro project.
- Hardcode strings — use the i18n system.
- Skip accessibility testing when modifying UI components.
- Commit `.env` files or API keys.
