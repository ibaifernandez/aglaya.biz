---
status: active
domain: architecture
owner: engineering
source_of_truth: true
last_reviewed: 2026-04-03
consumable_by_agents: true
---

# 3RD-PARTY CONFIGURATION — MASTER GUIDE

Este es el documento **RECTOR** para toda la infraestructura externa de AGLAYA.BIZ. 
Cualquier cambio en secrets, reglas de rama o configuración de servicios debe reflejarse aquí.

---

## 1. GitHub Infrastructure

**Repositorio:** `ibaifernandez/aglaya.biz`
**URL:** [github.com/ibaifernandez/aglaya.biz](https://github.com/ibaifernandez/aglaya.biz)

### 🛡️ Branch Protection: "Protect main"
- **Target:** `main`
- **Restrict Deletions:** ✅ Activo
- **Block Force Pushes:** ✅ Activo
- **Status Checks:** ✅ Requeridos (Unit Tests + E2E/A11y)

### 🔑 Actions Secrets
| Secret | Valor/Propósito |
|---|---|
| `PUBLIC_HCAPTCHA_SITE_KEY` | Site key de hCaptcha para el build en CI. |

---

## 2. Netlify Infrastructure

**Proyecto:** `aglaya`
**Dominio:** [aglaya.biz](https://aglaya.biz)

### ⚙️ Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 22 (via `NODE_VERSION` env var)

### 🔑 Variables de Entorno (Environment Variables)
*Configuradas en Site Settings → Environment variables*

| Variable | Scope | Propósito |
|---|---|---|
| `RESEND_API_KEY` | All | Autenticación para envío de emails (Sensitive) |
| `HCAPTCHA_SECRET` | All | Verificación server-side de hCaptcha (Sensitive) |
| `PUBLIC_HCAPTCHA_SITE_KEY` | All | Site key para el widget hCaptcha |
| `NOTIFY_EMAIL` | All | Destinatario de leads (`info@aglaya.biz`) |
| `SENTRY_AUTH_TOKEN` | All | Subida de source maps durante el build |
| `PUBLIC_SENTRY_DSN` | All | DSN del proyecto en Sentry |

---

## 3. Integrated Services

### 📧 Resend (Email API)
- **Status:** ✅ Activo y verificado.
- **DKIM/SPF:** Configurado en Cloudflare.
- **Audience:** Contactos capturados vía `contact.ts`.

### 🛡️ hCaptcha (Bot Protection)
- **Status:** ✅ Activo (Reemplaza a legacy Turnstile).
- **Validation:** Server-side en Netlify Functions contra `https://api.hcaptcha.com/siteverify`.

### 🐞 Sentry (Error Tracking)
- **Org/Project:** `aglaya-s6` / `javascript-astro`.
- **Status:** ✅ Captura activa en producción.
- **Filtering:** Errores de ruido externo descartados.

### ⏱️ UptimeRobot (Monitoring)
- **Monitors:**
  - `AGLAYA EN`: [aglaya.biz/](https://aglaya.biz/) (5 min)
  - `AGLAYA ES`: [aglaya.biz/es/](https://aglaya.biz/es/) (5 min)
- **Alerts:** Enviadas a `info@aglaya.biz`.

### 📦 Migadu (Email Management)
- **Principal:** `info@aglaya.biz` (Buzón activo).
- **DNS:** MX, SPF, DKIM (3 keys) y DMARC configurados en Cloudflare.

---

## 🚀 Post-Deploy Checklist
- [ ] Sitio carga en EN/ES.
- [ ] Formulario de contacto funciona (hCaptcha + success message).
- [ ] Email de confirmación recibido por el usuario.
- [ ] Lead notificado en `info@aglaya.biz`.
- [ ] Sentry libre de fallos críticos.
