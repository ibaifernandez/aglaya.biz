---
status: active
domain: architecture
owner: engineering
source_of_truth: true
last_reviewed: 2026-04-03
consumable_by_agents: true
---

# DEVELOPMENT WORKFLOW — MASTER GUIDE

Este documento define el ciclo de vida del desarrollo en AGLAYA para asegurar la integridad de la producción y la eficiencia local.

---

## 💻 Local Architecture

### 🛡️ Local Setup
Proyecto Astro independiente (sin dependencias WordPress).

- **Path:** `/Users/AGLAYA/Local Sites/aglaya.biz/`
- **Entorno:** Independent Git Repository.
- **Node:** v23.4.0 vía nvm (`nvm use v23.4.0`); `package.json` exige `>=22.12.0`.

### ⚓ Ports
| Servicio | Comando | URL Local |
|---|---|---|
| Development | `npm run dev` | `http://localhost:4321` |
| Preview (Build) | `npm run preview` | puerto que imprima Astro (4321 por defecto) |

---

## 🛠️ The Daily Development Loop (Cruise Mode)

Para cada cambio, los agentes y humanos deben seguir este "Golden Path":

1. **Dev Mode:**
   ```bash
   npm run dev
   ```
2. **Structural Validation:**
   ```bash
   npm run build
   ```
3. **Quality Assurance (Tests):**
   ```bash
   npx playwright test  # Todos los tests en verde
   ```
4. **Branch, Push & PR (obligatorio — `main` está protegido):**
   ```bash
   git checkout -b feat/mi-cambio
   git add . && git commit -m "feat: description"
   git push origin feat/mi-cambio
   gh pr create   # abre PR; espera los 2 checks de CI en verde; luego merge
   ```
   > Push directo a `main` es **rechazado** por branch protection. Nunca lo intentes.

---

## 🚀 CI/CD Pipeline

En cada Push o Pull Request a `main`, GitHub Actions ejecuta:
1. **Unit Tests** (Vitest).
2. **E2E & A11y Tests** (Playwright + Axe-core).

Si el pipeline falla, **el Deploy en Netlify se bloquea automáticamente** (vía Ruleset "Protect main").

---

## 📐 Integration Philosophy
- **Framework:** Astro 6.x (SSR Mode).
- **Styling:** Tailwind v4.
- **Security:** hCaptcha obligatorio en todos los puntos de entrada de datos.
- **Accessibility:** Ningún despliegue permitido con violaciones WCAG 2AA.
