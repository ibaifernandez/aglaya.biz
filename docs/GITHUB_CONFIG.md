# GitHub Configuration Guide — AGLAYA.BIZ

Repository: `ibaifernandez/aglaya.biz`
URL: https://github.com/ibaifernandez/aglaya.biz

---

## 1. Branch Protection — Ruleset "Protect main" ✅ ACTIVO

> Ruta: Settings → Rules → Rulesets → "Protect main"

Configuración aplicada (17 Mar 2026):

| Setting | Valor |
|---|---|
| Ruleset name | `Protect main` |
| Enforcement status | Active |
| Target branches | Default branch (`main`) |
| Restrict deletions | ✅ |
| Require status checks to pass | ✅ |
| → Unit Tests | ✅ GitHub Actions |
| → E2E + Accessibility Tests | ✅ GitHub Actions |
| Block force pushes | ✅ |

**Efecto práctico:** Un push a `main` cuyo commit no tenga los dos status checks en verde es rechazado. Ningún código roto llega a producción ni dispara un deploy de Netlify.

**Flujo de trabajo recomendado:**
```bash
git checkout -b fix/nombre-descriptivo
# ... cambios ...
git push origin fix/nombre-descriptivo
gh pr create --title "fix: descripción" --body "..."
# CI corre en la rama → verde → merge → Netlify despliega
```

**Nota sobre push directo a main:** Sin "Require a pull request before merging" activado, los push directos a `main` siguen siendo técnicamente posibles si el commit tiene checks pasados (e.g. ya corrió CI en una rama). Para trabajo en solitario esto es aceptable. Activar "Require PR" si en el futuro hay colaboradores.

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
