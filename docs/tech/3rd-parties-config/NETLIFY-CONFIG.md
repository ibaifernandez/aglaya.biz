# Netlify Configuration Guide — AGLAYA.BIZ

Cuenta: **Ibai Fernández** (Legacy Free — 300 build minutes/mes)
Proyecto: `aglaya` → https://aglaya.netlify.app
Dominio primario: https://aglaya.biz

---

## 1. Environment Variables

> Site settings → Environment variables

All runtime variables should be configured for the scopes they actually need.

| Variable | Scope | Descripción | Valor ejemplo |
|---|---|---|---|
| `RESEND_API_KEY` | Builds, Functions, Runtime | API key de Resend para envío de emails (**Sensitive**) | `re_xxxxxxxxx` |
| `HCAPTCHA_SECRET` | Builds, Functions, Runtime | Secret key de hCaptcha (server-side) (**Sensitive**) | `ES_xxxxxxxx...` |
| `PUBLIC_HCAPTCHA_SITE_KEY` | All scopes | Site key de hCaptcha (client-side) | `a772dbf8-f0da-4658-a4be-5b0848440ac8` |
| `NOTIFY_EMAIL` | All scopes | Email destinatario de notificaciones de leads | `info@aglaya.biz` |
| `MAILERLITE_API_KEY` | Builds, Functions, Runtime | MailerLite API auth (**Sensitive**) | `ml_xxxxxxxx` |
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | All scopes | Footer dispatch group | `<group-id>` |
| `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` | All scopes | Non-qualified lead group | `<group-id>` |
| `MAILERLITE_BORDERLINE_GROUP_ID` | All scopes | Borderline lead group | `<group-id>` |
| `MAILERLITE_CUALIFICADOS_GROUP_ID` | All scopes | Qualified lead group | `<group-id>` |
| `PUBLIC_SENTRY_DSN` | All scopes | Public DSN for browser capture | `https://...` |
| `SENTRY_DSN` | Builds, Functions, Runtime | Optional server-only DSN override | `https://...` |
| `SENTRY_AUTH_TOKEN` | Builds | Auth token de Sentry para subir source maps | `sntrys_xxxxx` |
| `SENTRY_ORG` | Builds | Sentry org slug for source-map upload | `<org-slug>` |
| `SENTRY_PROJECT` | Builds | Sentry project slug for source-map upload | `<project-slug>` |
| `NODE_VERSION` | All scopes | Versión de Node.js para el build | `22` |

> ⚠️ `PUBLIC_SENTRY_ENVIRONMENT` is not required. Environment labels are derived from Netlify deploy context.
>
> ⚠️ `PUBLIC_SENTRY_DSN` is intentionally omitted from Netlify secret scanning via `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`.

---

## 2. Build Settings

> Site settings → Build & deploy → Continuous deployment

| Setting | Valor |
|---|---|
| Repository | `ibaifernandez/aglaya.biz` |
| Production branch | `main` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` (via `NODE_VERSION` env var) |

---

## 3. Domain Management

> Site settings → Domain management

| Dominio | Tipo | Estado |
|---|---|---|
| `aglaya.netlify.app` | Netlify subdomain | ✅ Activo |
| `aglaya.biz` | Primary domain | ✅ Activo |
| `www.aglaya.biz` | Alias | ✅ Redirige a `aglaya.biz` |

### DNS en Cloudflare (ya configurado)
```
A     aglaya.biz      → 75.2.60.5       (Proxied)
CNAME www             → aglaya.netlify.app (Proxied)
```

### HTTPS
- Certificado Let's Encrypt activo ✅
- Renovación automática ✅
- Válido hasta: junio 2026

---

## 4. Functions

Las Netlify Functions están en `netlify/functions/`. Se despliegan automáticamente con cada build.

| Función | Endpoint | Descripción |
|---|---|---|
| `contact.ts` | `/.netlify/functions/contact` | Handles all ICP/contact branches and ROI Audit context |
| `dispatch-subscribe.ts` | `/.netlify/functions/dispatch-subscribe` | Handles footer dispatch capture + autoresponse |

---

## 5. Notificaciones de Deploy

> Site settings → Build & deploy → Deploy notifications

Recomendado activar:
- **Email** al propietario cuando un deploy falle
- **Slack** (opcional) si se usa Slack en el equipo

---

## 6. Security Headers

Security headers are no longer sourced from `netlify.toml`.

**Source of truth:** `public/_headers`

That file controls:

- CSP
- HSTS
- anti-framing
- permissions policy
- COOP / CORP
- immutable cache rules for `/_astro/*` and `/assets/*`

---

## 7. Consumo de Build Minutes (Legacy Free)

- **Plan:** Legacy Free — 300 minutos/mes
- **Reset:** 1er día de cada mes
- **Duración media por build:** ~3-5 minutos
- **Builds disponibles/mes:** ~60-100

### Historial de consumo
| Fecha | Build | Minutos |
|---|---|---|
| Mar 17, 2026 | Migración + setup | ~10 min usados |

---

## 8. Cuentas relacionadas

| Plataforma | Cuenta | Notas |
|---|---|---|
| Netlify | ibaifernandez (Legacy Free) | Proyecto `aglaya` activo |
| ~~Netlify AGLAYA~~ | ~~AGLAYA team~~ | ~~Eliminar — créditos agotados~~ |
| Sentry | Managed in dashboard | Observability project for browser + SSR/runtime errors |
| Resend | info@aglaya.biz | 3.000 emails/mes gratis |
| hCaptcha | ibaifernandez | Bot protection (reemplaza Turnstile) |
| Cloudflare | ibaifernandez | DNS (proxy) |
| Migadu | aglaya.biz | Email transaccional |

---

## 9. Checklist de verificación post-deploy

Después de cada deploy a producción:
- [ ] https://aglaya.biz/ carga correctamente
- [ ] https://aglaya.biz/es/ carga correctamente
- [ ] https://aglaya.biz/pt/ carga correctamente
- [ ] Cookie banner aparece al resetear consentimiento
- [ ] GTM solo carga tras `Accept all`
- [ ] Dispatch footer completa el flujo (consent + hCaptcha + success + email)
- [ ] Contact flow completa el flujo en al menos una rama
- [ ] ROI Audit preserva su contexto
- [ ] Sentry smoke test de browser entra en producción
- [ ] UptimeRobot muestra ambos monitores en verde
