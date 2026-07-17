# CLAUDE.md — Project Instructions for AI Assistants

## Project Overview
**AGLAYA** ("The Uncomfortable Agency") — trilingual (EN/ES/PT) digital marketing agency website built with Astro, deployed on Netlify.

## Tech Stack
- **Framework**: Astro 6.x (SSR via Netlify adapter)
- **Styling**: Tailwind CSS v4 (design tokens in `src/styles/global.css`)
- **Serverless**: Netlify Functions (`netlify/functions/`)
- **Email**: Resend API
- **Bot Protection**: hCaptcha
- **Error Tracking**: Sentry (browser + Astro SSR + Netlify Functions when DSN is configured)
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
├── pages/           # Astro pages (/ = EN, /es/ = ES, /pt/ = PT)
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
- **i18n**: Subdirectory strategy (EN at `/`, ES at `/es/`, PT at `/pt/`). Full hreflang parity.
- **Forms**: Client → hCaptcha validation → Netlify Function → Resend/MailerLite/CRM. Contact and ROI flows send immediate confirmations plus internal notifications; footer dispatch captures subscribers in MailerLite when configured — MailerLite owns the confirmation sequence (Email 0) directly. Resend is not involved in dispatch confirmations. Confirmation email for contact/ROI is rendered in the same language (`lang`) the form was submitted from.
- **Form routing (post PR #83, 2026-06-15)**: the **ICP qualification funnel** (`ICPFilter` → `QualifiedForm`/`BorderlineForm`/`OpenChannelForm`) lives on **`/roi-audit`** (embedded after the explainer; mounted with `entryPoint`/`serviceInterest="roi_audit"` so leads are tagged ROI). **`/contact`** is a **simple `ContactForm`** (name/email/message + consent) that posts `icp_status=OPEN_CHANNEL` + `inquiry_type=GENERAL_LEAD` → lands in the CRM as an open-channel lead (from `icp_status`) + MailerLite **Contacto** group (auto-reply; routed by `inquiry_type` via `getGeneralContactGroupId()`, NOT by `icp_status`) + Resend internal notification. All form submits hit the same `netlify/functions/contact.ts`. (The old `ROIForm.astro` fake-submit component is deleted.)
- **Consent/DSR ledger (contract §3-bis, v1.1.0)**: every CRM-bound lead rides a consent ficha built by `buildConsentFields()` in `_crm.ts` and sent **FLAT** (top-level) in the `/leads/capture` body. `evidence_hash = sha256(email␟purpose␟legal_basis␟notice_version␟granted_at␟source)` (U+001F sep, `sha256:` prefix) — cross-producer contract, byte-identical to Scanner's `build_consent_fields`; golden locked in `tests/unit/crm-consent.test.ts`. aglaya.biz emits `legal_basis=legitimate-interest`, `regime=cl-21719`, `channel=web-form`, `status=granted`, `purpose∈{contacto,roi-audit}`. Signature ledger: [`docs/contracts/IMPLEMENTS.md`](docs/contracts/IMPLEMENTS.md).
- **Cookie consent**: `CookieBanner.astro` rendered in `BaseLayout.astro`. Consent stored in `localStorage` (`aglaya_cookie_consent`: `all` | `essential`). No external CMP — first-party only.
- **Styling**: Tailwind v4 via Vite plugin, NOT PostCSS. Design tokens defined in `@theme` block.
- **Fonts**: Outfit (display/headings), Inter (body). Loaded via Google Fonts with preconnect.

## Brand Identity
- **Primary color**: `#e8003d` (brand red)
- **Background**: `#080808` (near-black)
- **Surface**: `#080808` / `#0f0f0f` (two surface tokens in global.css)
- **Typography**: Outfit 300–900, Inter 300–700
- **Tagline EN**: "The Uncomfortable AI·gency"
- **Tagline ES**: "La Agenc·IA Incómoda"
- **Email tagline EN**: "AI executes. Humans strategize."
- **Email tagline ES**: "La IA ejecuta. El humano estrategiza."

## Coding Conventions
- All text must be trilingual (EN + ES + PT). Use `src/i18n/translations.ts` for all user-facing strings.
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
| `PUBLIC_SENTRY_DSN` | Client | Sentry DSN shared with browser runtime and as server fallback |
| `SENTRY_DSN` | Server | Optional server-only DSN override for Astro SSR and Netlify Functions |
| `SENTRY_AUTH_TOKEN` | Build | Optional source-map upload token |
| `SENTRY_ORG` | Build | Optional Sentry org slug for source-map upload |
| `SENTRY_PROJECT` | Build | Optional Sentry project slug for source-map upload |
| `PUBLIC_SENTRY_RELEASE` | Client | Optional browser-side release label |
| `NOTIFY_EMAIL` | Server | Lead notification recipient |
| `MAILERLITE_API_KEY` | Server | Optional MailerLite API key for dispatch/contact list sync |
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | Server | Optional MailerLite group id for footer dispatch subscriptions |
| `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` | Server | Optional MailerLite group id for blocked/open-channel and non-qualified contact leads |
| `MAILERLITE_CUALIFICADOS_GROUP_ID` | Server | Optional MailerLite group id for qualified contact leads |
| `MAILERLITE_BORDERLINE_GROUP_ID` | Server | Optional MailerLite group id for borderline contact leads |
| `MAILERLITE_COTIZACIONES_GROUP_ID` | Server | MailerLite group id for quote calculator leads (fallback hardcoded in quote.ts) |

Sentry environment tagging is inferred from Netlify deploy context by default. Avoid setting a separate public environment label unless you intentionally need to override that behavior outside Netlify.
| `MAILERLITE_CONTACTO_GROUP_ID` | Server | **Primary** MailerLite group id for the simple `/contact` form (`inquiry_type=GENERAL_LEAD`), read by `getGeneralContactGroupId()` — which has **no fallback chain**, so leaving it unset silently drops the auto-reply. Also still read as a legacy fallback inside `getContactGroupIds()` when `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` is unset (vestigial — that var is set in prod). |
| `MAILERLITE_CONTACTO_QUALIFIED_GROUP_ID` | Server | Legacy fallback MailerLite group id for qualified contact leads |
| `MAILERLITE_CONTACTO_BORDERLINE_GROUP_ID` | Server | Legacy fallback MailerLite group id for borderline contact leads |
| `MAILERLITE_CONTACTO_BLOCKED_GROUP_ID` | Server | Legacy fallback MailerLite group id for blocked/open-channel contact leads |
| `CRM_API_KEY` | Server | CRM AGLAYA API key (paste from Railway → service `crm-aglaya` → Variables). Authenticates the `X-CRM-API-Key` header on `/leads/capture`. Unset → CRM dispatch is skipped silently. |
| `CRM_LEADS_CAPTURE_URL` | Server | Full URL to the CRM AGLAYA `/leads/capture` endpoint. During transition: `https://crm-aglaya-production.up.railway.app/api/v1/admin/crm/leads/capture`. Post-DNS-cutover: `https://crm.aglaya.biz/api/v1/admin/crm/leads/capture`. Swap is env-var only — no code redeploy. |

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
# package.json declares engines: { node: ">=22.12.0" } — v23.4.0 is the pinned local dev version
```

## Do NOT
- Modify `astro.config.mjs` without understanding the Netlify adapter implications.
- Use `React`, `Vue`, or other UI frameworks — this is a pure Astro project.
- Hardcode strings — use the i18n system.
- Skip accessibility testing when modifying UI components.
- Commit `.env` files or API keys.

## Known Gotchas & Hard-Won Lessons

### Prefer bundled module scripts; reserve `is:inline` for true parse-time requirements
Astro compiles plain `<script>` blocks as ES modules (`type="module"`). That is the default we prefer because it keeps CSP tighter and avoids scattering executable inline JS across the site. Only use `is:inline` when a third-party truly needs a parse-time global before the browser can even reach the deferred module phase.

```html
<!-- ✅ Preferred — bundled module keeps CSP stricter -->
<script>
  window.onHCaptchaSuccess = (token) => { /* ... */ };
</script>

<!-- Use `is:inline` only if a provider provably breaks without synchronous parse-time globals -->
<script is:inline>
  window.someLegacyVendorCallback = function () { /* ... */ };
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

### pdfkit in Netlify Functions — use the standalone build
`pdfkit` (default build) loads Helvetica and other standard font metrics from AFM files on disk (`node_modules/pdfkit/js/data/`). Netlify esbuild bundles functions into a single `.js` file without those data files, so any `.font('Helvetica')` call throws `ENOENT: no such file or directory` at runtime (Sentry AGLAYA-BIZ-6).

Always import the standalone build, which embeds all fonts as base64 strings:
```ts
// @ts-expect-error — standalone build has no separate .d.ts; API is identical to main
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';
```
The API is 100% identical. Never use bare `import PDFDocument from 'pdfkit'` inside a Netlify Function.

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

### CRM AGLAYA `/leads/capture` returns 201 even when it excludes the lead
The CRM honors a server-side exclusion list (gmail plus-alias normalization, blocklist, etc.). When a submitted email matches, the endpoint still responds `201 Created` with body `{contact_id: null, deal_id: null, excluded: true}` — no deal is created. This is intentional (the sender should not need to know whether the lead was kept or dropped).

Implication for logging in `netlify/functions/_crm.ts`: a status code alone is not enough. Inspect the response body. The helper surfaces 6 outcomes:

| Outcome | Trigger | Sentry capture? |
|---|---|---|
| `created` | 2xx + `excluded:false` + `deal_id` present | no — logs only |
| `excluded` | 2xx + `excluded:true` | no — logs only (intentional CRM-side drop) |
| `anomaly` | 2xx + `excluded:false` + `deal_id:null` (contract violation) | **yes** |
| `rejected` | 4xx (typically 422 — our payload malformed) | **yes** |
| `failed` | 5xx / network error (CRM down or transient) | **yes** |
| `skipped` | `CRM_API_KEY` or `CRM_LEADS_CAPTURE_URL` unset | no — logs only |

`CRM_ATTENTION_OUTCOMES` (exported from `_crm.ts`) is the set `{anomaly, rejected, failed}`. Filter Sentry by `crm_outcome:anomaly OR crm_outcome:failed OR crm_outcome:rejected` to see everything requiring human attention.

### CRM dispatch is best-effort, Resend is the canary
In `contact.ts`, the Resend internal notification stays `await`-blocking so that a failed Resend call returns `500` to the user (and you notice the gap between form-submission email and CRM panel). MailerLite and CRM dispatch run in parallel via `Promise.allSettled` after Resend succeeds — both are best-effort. A CRM failure never bounces the visitor; it is captured in Sentry with tag `stage=crm-dispatch` for manual reconciliation against the internal email canary.

### Netlify secrets scanning fails the build on env-var values found in source
A Netlify deploy can fail with `astro build` "exit code 2" / "Failed during stage 'building site'" while the **same build is green locally and in GitHub Actions**. The real failure is the **secrets-scanning** step, which only runs on Netlify (not locally, not in CI). It greps the build output AND repo source for the *values* of all env vars, and aborts if it finds one. The trap: `SENTRY_PROJECT`'s value is the slug `aglaya-biz`, which matches as a substring of any brand-ish literal — e.g. a `"aglaya-biz-form"` source label in `contact.ts` tripped it. Two-part fix already applied:
1. Never embed an env-var value (even a non-secret slug) in a source literal — the offending label was renamed `aglaya-website-form`.
2. `SENTRY_ORG`/`SENTRY_PROJECT` are slugs, not secrets, so they are listed in `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`.

When a Netlify build fails "exit code 2" but `npm run build` is clean locally, **check secrets scanning first** — read the build log's "Scanning for secrets" section for the flagged key and file:line. (Separately: the Sentry source-map upload errors non-fatally with "Project not found" — a pre-existing slug misconfig — it does NOT fail builds.)

## CRM AGLAYA Integration — Contract (read before sending leads)

aglaya.biz is a **PRODUCER** feeding the CRM AGLAYA. Any form/flow that sends leads is governed by two documents:

- **Governance (canonical, wins):** [`docs/contracts/lead-capture-contract.md`](docs/contracts/lead-capture-contract.md) (currently **v1.1.0** — **triangle closed**: aglaya.biz, Scanner 21.719 and CRM AGLAYA all signed v1.1.0 on 2026-06-13, each in its own `IMPLEMENTS.md`; CRM's formal re-ack is `ce0c544`. Verified by the AGLAYA captain 2026-07-17 — nothing pending). Single source of truth for the legal-basis model (legitimate interest for inbound forms; consent only for Dispatch), the GDPR accountability record (`privacy_policy_version` / `privacy_policy_displayed_at`), §3-bis (consent + DSR ledger), §5 (erasure↔retention), the `source` taxonomy (`<product>-<channel>-<segment>`), §9 (extending to a new product), and §10 (signatories). When this contract changes, bump its version (§8) and re-sync every signatory thread. aglaya.biz's own implementation ledger: [`docs/contracts/IMPLEMENTS.md`](docs/contracts/IMPLEMENTS.md).

- **Technical API:** `crm-aglaya/docs/contracts/crm-ingestion-api.md` (CRM-owned spec) — endpoints, payloads, `Idempotency-Key`. The CRM owns this; it wins on interface details. The governance contract above wins on the legal/data-protection model. **OPEN:** as of crm-ingestion-api v1.3.0 the consent fields (§3-bis) are NOT yet documented there — CRM thread to version them and confirm it accepts the flat consent payload.

**For a NEW form:** POST to `/leads/capture` with a `source` from your taxonomy (`aglaya-form-<segment>`) plus the GDPR fields. The CRM accepts any `source` (additive); the taxonomy and the §10 signature are mandatory. Reuse `netlify/functions/_crm.ts` (`dispatchLeadToCrm` already sends auth, GDPR fields, and `Idempotency-Key`). Do not improvise — propose contract changes in the canonical doc (§6). Do not let aglaya.biz drift from the contract version it has signed.

## AGLAYA · Flota — el capitán

Este repo es una **nave de la flota AGLAYA**. Existe un orquestador (el «capitán», repo `aglaya-orchestrator` en `/Users/AGLAYA/Local Sites/aglaya-orchestrator`) cuyo atlas es la fuente de verdad **de flota**: registro de contratos inter-nave (`atlas/contratos/README.md`), fichas por nave (`atlas/repos/aglaya.biz/`) y tablero global (`atlas/tablero.md`).

Reglas para cualquier hilo que trabaje aquí:
- **Antes de un cambio estructural** (el contrato canónico `lead-capture` que este repo POSEE, la ficha de consentimiento, el `evidence_hash`, la taxonomía de `source`), consulta el registro de contratos del atlas — el Scanner, el CRM y el plugin dependen de lo que vas a tocar.
- **El capitán puede haber tocado docs de este repo** (nunca `src/` ni `netlify/`): sus commits van identificados y cada pase queda registrado en `docs/ops/CHANGELOG.md`. Si un doc contradice al código, gana el código — y avisa.
- La verdad comercial (precios, ofertas, GTM) NO vive aquí: vive en el atlas del capitán (`atlas/gtm.md`). Este repo ejecuta y apunta.

**Último pase del capitán: 2026-07-17** — verificado el 7/7 de cohesión tras el lote #102–#107; **triángulo de firmas del canónico CERRADO** (§10: las tres naves firmaron v1.1.0 el 2026-06-13; un mes de notas rancias cruzadas, muertas hoy); huella colocada. Detalle: entradas del 17-jul en `docs/ops/CHANGELOG.md`.
