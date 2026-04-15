# Platform Configuration Guide — AGLAYA.BIZ

Operational status of every live third-party platform used by `aglaya.biz`.

---

## 1. UptimeRobot

**URL:** https://uptimerobot.com
**Plan:** Free (50 monitores, alertas cada 5 min)

### Monitores a crear

| Monitor | Tipo | URL | Intervalo |
|---|---|---|---|
| AGLAYA EN | HTTPS | `https://aglaya.biz/` | 5 min |
| AGLAYA ES | HTTPS | `https://aglaya.biz/es/` | 5 min |

### Pasos
1. Login → **Add New Monitor**
2. Monitor type: **HTTPS**
3. Friendly name: `AGLAYA — EN`
4. URL: `https://aglaya.biz/`
5. Monitoring interval: **5 minutes**
6. Alert contacts: añadir `info@aglaya.biz`
7. Repetir para `/es/`

### What it monitors
- HTTP 200 en ambas URLs
- Tiempo de respuesta
- Alerta por email si el sitio cae

### Estado actual
- [x] Monitor EN creado — `AGLAYA (EN)` · `https://aglaya.biz/` · 5 min · ✅ Up
- [x] Monitor ES creado — `AGLAYA (ES)` · `https://aglaya.biz/es/` · 5 min · ✅ Up
- [x] Alertas configuradas a `info@aglaya.biz`
- **Configurado:** 17 Mar 2026

---

## 2. Sentry

**URL:** https://sentry.io
**Org:** Managed in Sentry dashboard  
**Project:** Managed in Sentry dashboard
**Plan:** Free (5K errores/mes, 30 días retención)

### Runtime configuration
- `PUBLIC_SENTRY_DSN`: habilita la captura en browser y sirve como fallback compartido para runtime server-side.
- `SENTRY_DSN`: override opcional server-only para Astro SSR y Netlify Functions.
- `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`: habilitan source maps durante el build.

### Netlify variables
| Variable | Descripción |
|---|---|
| `PUBLIC_SENTRY_DSN` | Browser DSN + shared runtime fallback |
| `SENTRY_DSN` | Optional server-only DSN |
| `SENTRY_AUTH_TOKEN` | Optional source-map upload token |
| `SENTRY_ORG` | Optional org slug for source-map upload |
| `SENTRY_PROJECT` | Optional project slug for source-map upload |

### What it captures
- browser runtime errors
- Astro SSR errors
- Netlify Function exceptions
- source-mapped stack traces when build credentials are present

### Alertas recomendadas
> Sentry → Project Settings → Alerts → Create Alert

| Alert | Condition | Action |
|---|---|---|
| New issue | First seen | Email a `info@aglaya.biz` |
| Error spike | >10 events in 1h | Email a `info@aglaya.biz` |

### Architecture notes
- Browser bootstrap is rendered through `src/components/SentryBrowser.astro`
- Astro SSR is configured through `astro.config.mjs`
- Function capture uses `netlify/functions/_sentry.ts`
- `PUBLIC_SENTRY_ENVIRONMENT` is intentionally not used; environment labels are derived from Netlify deploy context

### Estado actual
- [x] Browser capture wired
- [x] SSR capture wired
- [x] Functions capture wired
- [x] Production project renamed and aligned in Sentry
- [ ] Alert rules reviewed in dashboard

---

## 3. Resend

**URL:** https://resend.com
**Plan:** Free (3.000 emails/mes, 100/día)
**From:** `AGLAYA <info@aglaya.biz>`

### DNS (ya configurado en Cloudflare)
| Tipo | Nombre | Valor |
|---|---|---|
| TXT | `resend._domainkey.aglaya.biz` | `p=MIGfMA0GCSqGSlb3D...` |

### Variables de entorno en Netlify (ya configuradas)
| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de autenticación |
| `NOTIFY_EMAIL` | Destinatario de notificaciones de leads (`info@aglaya.biz`) |

### Runtime role
- user-facing confirmation emails for contact and dispatch
- internal notifications / BCC to `info@aglaya.biz`
- localized copy for EN / ES / PT
- ROI Audit-specific copy path

### Verificar que funciona
1. Ir a https://aglaya.biz/
2. Completar el formulario (nombre + email + mensaje)
3. Pasar el hCaptcha
4. Enviar
5. Confirmar: mensaje de éxito visible
6. Confirmar: email de confirmación branded recibido (diseño con barras rojas)
7. Confirmar: notificación de lead recibida en `info@aglaya.biz`

### Logs
> resend.com → Emails → filtrar por dominio `aglaya.biz`

### Estado actual
- [x] API key configurada en Netlify
- [x] DNS DKIM verificado
- [x] Función `contact.ts` implementada
- [x] **1 prueba end-to-end exitosa completada** — 2 adicionales pendientes

---

## 4. hCaptcha (Bot Protection)

**URL:** https://www.hcaptcha.com
**Plan:** Free (verificaciones ilimitadas)
**Tipo:** Widget CAPTCHA anti-bot

### Keys configuradas
| Variable | Scope | Valor |
|---|---|---|
| `PUBLIC_HCAPTCHA_SITE_KEY` | Client | `a772dbf8-f0da-4658-a4be-5b0848440ac8` |
| `HCAPTCHA_SECRET` | Server | En Netlify (no exponer) |

### Dominio autorizado
> hCaptcha Dashboard → Sites → aglaya.biz

- `aglaya.biz` ✅

### Where it runs
- footer dispatch
- qualified contact branch
- borderline contact branch
- open channel branch

### Estado actual
- [x] Site key in active forms
- [x] Site key en Netlify env vars (`PUBLIC_HCAPTCHA_SITE_KEY`)
- [x] Secret key en Netlify env vars (`HCAPTCHA_SECRET`)
- [x] Dominio `aglaya.biz` autorizado en hCaptcha dashboard
- [ ] Full human QA matrix complete

---

## 5. Google Tag Manager

**Container:** `GTM-5BVC9C5C`

### Consent rule

GTM loads only after `CookieBanner.astro` dispatches `aglaya:consent-update` with `consent = all`.

### Status

- [x] Tag Assistant detects the live container after consent
- [x] GTM stays suppressed before consent
- [ ] Manual event-by-event audit completed in GA/GTM dashboards

## 6. MailerLite

### Group model

- `MAILERLITE_SUSCRIPCIONES_GROUP_ID`
- `MAILERLITE_NO_CUALIFICADOS_GROUP_ID`
- `MAILERLITE_BORDERLINE_GROUP_ID`
- `MAILERLITE_CUALIFICADOS_GROUP_ID`

### Status

- [x] Dispatch path wired
- [x] Contact tier routing wired
- [ ] Live dashboard verification completed after latest deploy

---

## 7. Migadu (Email)

**URL:** https://admin.migadu.com
**Plan:** Micro (cuota anual)
**Dominio:** `aglaya.biz`

### DNS en Cloudflare (ya configurado)
| Tipo | Nombre | Valor |
|---|---|---|
| MX | `aglaya.biz` | `aspmx1.migadu.com` (prio 10) |
| MX | `aglaya.biz` | `aspmx2.migadu.com` (prio 20) |
| TXT | `aglaya.biz` | `v=spf1 include:spf.migadu.com ~all` |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine...` |
| CNAME | `key1._domainkey` | `key1.aglaya.biz._domainkey...` |
| CNAME | `key2._domainkey` | `key2.aglaya.biz._domainkey...` |
| CNAME | `key3._domainkey` | `key3.aglaya.biz._domainkey...` |

### Buzones activos
- `info@aglaya.biz` — buzón principal (contacto + notificaciones)

### Estado actual
- [x] DNS MX configurado
- [x] SPF configurado
- [x] DKIM (3 claves) configurado
- [x] DMARC configurado
- [x] Buzón `info@aglaya.biz` activo

---

## Resumen de estado global

| Plataforma | Configurada | Probada E2E |
|---|---|---|
| Netlify | ✅ | ✅ |
| GitHub Actions | ✅ | ✅ CI verde consistente |
| Sentry | ✅ | ✅ (captura activa) |
| Resend | ✅ | ✅ |
| hCaptcha | ✅ | ✅ |
| GTM | ✅ | ✅ (consent-gated) |
| MailerLite | ✅ | ✅ (code path) |
| UptimeRobot | ✅ | ✅ 2 monitores activos |
| Migadu | ✅ | ✅ |
