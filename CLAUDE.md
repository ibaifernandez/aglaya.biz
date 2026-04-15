# CLAUDE.md — Project Instructions for AI Assistants

## Project Overview
**AGLAYA** ("The Uncomfortable Agency") — bilingual (EN/ES) digital marketing agency website built with Astro, deployed on Netlify.

## Tech Stack
- **Framework**: Astro 6.x (SSR via Netlify adapter)
- **Styling**: Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- **Serverless**: Netlify Functions (`netlify/functions/`)
- **Email**: Resend API
- **Bot Protection**: hCaptcha
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
├── components/      # ContactForm.astro, CookieBanner.astro, icons/
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
- **Forms**: Client → hCaptcha validation → Netlify Function → Resend (dual email: confirmation + lead notification). Confirmation email is bilingual — rendered in the same language (`lang`) the form was submitted from.
- **Cookie consent**: `CookieBanner.astro` rendered in `BaseLayout.astro`. Consent stored in `localStorage` (`aglaya_cookie_consent`: `all` | `essential`). No external CMP — first-party only.
- **Styling**: Tailwind v4 via Vite plugin, NOT PostCSS. Design tokens defined in `@theme` block.
- **Fonts**: Outfit (display/headings), Inter (body). Loaded via Google Fonts with preconnect.

## Brand Identity
- **Primary color**: `#e8003d` (brand red)
- **Background**: `#080808` (near-black)
- **Surface**: `#111111`
- **Typography**: Outfit 300–900, Inter 300–700
- **Tagline EN**: "The Uncomfortable AI·gency"
- **Tagline ES**: "La Agenc·IA Incómoda"
- **Email tagline EN**: "AI executes. Humans strategize."
- **Email tagline ES**: "La IA ejecuta. El humano estrategiza."

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
| `HCAPTCHA_SECRET` | Server | hCaptcha secret key |
| `PUBLIC_HCAPTCHA_SITE_KEY` | Client | hCaptcha site key (fallback hardcoded in ContactForm) |
| `PUBLIC_SENTRY_DSN` | Client | Sentry project DSN |
| `NOTIFY_EMAIL` | Server | Lead notification recipient |
| `MAILERLITE_API_KEY` | Server | Optional MailerLite API key for footer dispatch subscriptions |
| `MAILERLITE_GROUP_ID` | Server | Optional MailerLite group id for footer dispatch subscriptions |

## Git Workflow

The `main` branch has **branch protection rules** active on GitHub:
- **"Require status checks to pass"** — 2 CI checks must pass before any ref can be updated.
- **"Block force pushes"** — `git push --force` to `main` is forbidden.

This means **direct pushes to `main` are rejected**. Always work in a feature branch:

```bash
# Start new work
git checkout -b feat/my-feature

# ... make changes, commit ...

git push origin feat/my-feature
# Then open a PR on GitHub — CI runs — merge when green
```

### Standard PR workflow
1. `git checkout -b <branch>` — name it `feat/`, `fix/`, `chore/`, etc.
2. Commit changes locally as usual.
3. `git push origin <branch>`.
4. Open PR on GitHub (or via `gh pr create` if CLI is installed).
5. Wait for CI checks to pass (Playwright E2E + build).
6. Merge PR → `main` auto-deploys to Netlify.
7. `git checkout main && git pull` to sync locally.

### Installing gh CLI (recommended)
```bash
brew install gh
gh auth login   # authenticate with GitHub
gh pr create    # create PR from current branch
```

### Environment note
Node.js must be v23.4.0 (via nvm). Run before any npm/build commands:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use v23.4.0
```

## Do NOT
- Modify `astro.config.mjs` without understanding the Netlify adapter implications.
- Use `React`, `Vue`, or other UI frameworks — this is a pure Astro project.
- Hardcode strings — use the i18n system.
- Skip accessibility testing when modifying UI components.
- Commit `.env` files or API keys.

## Known Gotchas & Hard-Won Lessons

### Astro script modules are deferred — use `is:inline` for global callbacks
Astro compiles `<script>` blocks as ES modules (`type="module"`), which the browser **defers** until after parsing. Any third-party `async` script (e.g. hCaptcha, Google Analytics) can fire before the module runs. If a third-party calls `window.someCallback`, define it in a **`<script is:inline>`** block placed *before* the third-party `<script src>` tag — inline scripts are synchronous and always run first.

```html
<!-- ✅ Correct — inline runs before async hCaptcha -->
<script is:inline>
  window.onHCaptchaSuccess = function(token) { /* ... */ };
</script>
<script src="https://js.hcaptcha.com/1/api.js" async defer is:inline></script>

<!-- ❌ Wrong — module is deferred; hCaptcha may fire callback first -->
<script>
  window.onHCaptchaSuccess = (token) => { /* ... */ };
</script>
```

### Axe-core fails contrast on animated elements in CI
Playwright/headless Chrome defaults to `prefers-reduced-motion: no-preference`. Animated elements start at `opacity: 0` and axe scans them mid-transition, reporting false-positive color-contrast failures (foreground ≈ background ≈ near-black).

Fix: call `await page.emulateMedia({ reducedMotion: 'reduce' })` **before** `page.goto()` in any test that runs axe. Pair with CSS:
```css
@media (prefers-reduced-motion: reduce) {
  [data-animate="fade-up"] { opacity: 1 !important; transform: none !important; }
}
```

### `??` vs `||` for env var fallbacks
`import.meta.env.PUBLIC_HCAPTCHA_SITE_KEY ?? 'fallback'` only catches `null`/`undefined`. If Netlify stores the var as an empty string `""`, the fallback never triggers. Always use `||` for env vars that could be empty strings:
```js
// ✅
const key = import.meta.env.PUBLIC_HCAPTCHA_SITE_KEY || 'a772dbf8-f0da-4658-a4be-5b0848440ac8';
// ❌ — empty string passes through
const key = import.meta.env.PUBLIC_HCAPTCHA_SITE_KEY ?? 'd9205cec-4106-4c24-add6-b4ca3bb40472';
```

### Always check fetch() responses from external APIs
```js
const res = await fetch('https://api.resend.com/emails', { ... });
if (!res.ok) throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
```
Without `res.ok` check, a 401/422 from Resend is silently swallowed — the Netlify function returns 200 OK but no email is sent. User sees "success" but nothing arrives.

### Brand red `#e8003d` fails WCAG AA on small text
`#e8003d` on `#080808` = **4.33:1** contrast — below the 4.5:1 AA threshold for text under 18px/14px bold. Use `#ff4d70` (6.5:1) for small text elements like eyebrow labels. Reserve `#e8003d` for large headings (≥18px) or decorative non-text elements.

### axe-core 4.11 checks `color-contrast` on `aria-hidden` children
`aria-hidden="true"` hides elements from the accessibility tree but axe-core 4.11's `color-contrast` rule still audits visually rendered children. For decorative elements (e.g. scrolling marquees) that are intentionally `aria-hidden`, exclude them explicitly in the test:
```js
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
  .exclude('.marquee-wrap') // decorative, aria-hidden="true"
  .analyze();
```

### Cloudflare Turnstile error 300030 — avoid Invisible mode on proxied domains
Turnstile error 300030 ("widget hung") occurs consistently when the site is proxied through Cloudflare (orange cloud DNS) and Turnstile is in Invisible mode. The widget loads but the verification iframe hangs indefinitely. Root cause: likely an internal Cloudflare account conflict between the proxy and Turnstile's own challenge servers. **Workaround attempted:** Managed mode, disabling proxy, disabling Bot Fight Mode — none resolved it. **Solution: migrate to hCaptcha** (`https://js.hcaptcha.com/1/api.js`), which has no dependency conflicts with Cloudflare.

### hCaptcha in CI — exclude from axe scan
hCaptcha injects a "Warning: localhost detected" div in non-production environments with low-contrast text (#bf1722 on #333333 = 2.02:1). Exclude the widget container from axe:
```js
await new AxeBuilder({ page }).exclude('.h-captcha').analyze();
```

### Astro 6.x: `ViewTransitions` is now `ClientRouter`
```js
// ✅ Astro 6.x
import ClientRouter from 'astro/components/ClientRouter.astro';
// ❌ Old — throws in Astro 6
import { ViewTransitions } from 'astro:transitions';
```

### Import statements must be at the TOP of Astro frontmatter
Astro/Rollup requires all `import` statements before any `interface`, `const`, or logic. Placing imports after declarations causes a build error.
