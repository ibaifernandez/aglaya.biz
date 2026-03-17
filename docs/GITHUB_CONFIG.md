# GitHub Configuration Guide — AGLAYA.BIZ

Repository: `ibaifernandez/aglaya.biz`
URL: https://github.com/ibaifernandez/aglaya.biz

---

## 1. Branch Protection (Settings → Branches)

Configura la regla para la rama `main`:

| Setting | Value |
|---|---|
| Require a pull request before merging | ✅ |
| Require status checks to pass | ✅ — checks: `Unit Tests`, `E2E + Accessibility Tests` |
| Require branches to be up to date | ✅ |
| Do not allow bypassing the above settings | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

> Ruta: Settings → Branches → Add branch ruleset → Branch name: `main`

---

## 2. Actions Secrets (Settings → Secrets and variables → Actions)

Estos secrets son necesarios para el pipeline de CI:

| Secret | Descripción | Obligatorio |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Site key de Cloudflare Turnstile (`0x4AAAAAACr7qLXpzOQqF7Ni`) | ✅ Para build en CI |

> **Nota:** Las demás variables (`RESEND_API_KEY`, `TURNSTILE_SECRET`, etc.) son server-side y NO deben estar en GitHub — solo en Netlify.

---

## 3. Dependabot (Settings → Security → Dependabot)

Activar:
- **Dependabot alerts** ✅
- **Dependabot security updates** ✅

Crear `.github/dependabot.yml` (opcional pero recomendado):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

---

## 4. GitHub Actions — Workflow existente

El fichero `.github/workflows/ci.yml` ejecuta automáticamente en cada push a `main` y en PRs:

1. **Unit Tests** — Vitest (`tests/unit/`)
2. **E2E + A11y Tests** — Playwright + axe-core (`tests/coming-soon.spec.ts`)

El pipeline falla si cualquier test falla, bloqueando el merge.

---

## 5. Repository Settings recomendados

> Settings → General

| Setting | Valor recomendado |
|---|---|
| Default branch | `main` |
| Automatically delete head branches | ✅ |
| Allow squash merging | ✅ |
| Allow merge commits | ❌ |
| Allow rebase merging | ✅ |

---

## 6. Deploy automático en Netlify

El repositorio está conectado a Netlify (cuenta `ibaifernandez`). Cada push a `main` dispara un deploy automático. No hace falta configurar nada adicional en GitHub para el deploy — Netlify gestiona el webhook.

---

## 7. Topics y descripción del repositorio

> Settings → General (arriba del todo)

- **Description:** Coming soon page for AGLAYA — The Uncomfortable AI·gency
- **Website:** https://aglaya.biz
- **Topics:** `astro`, `netlify`, `tailwindcss`, `typescript`, `i18n`, `sentry`, `cloudflare-turnstile`
