# Platform Configuration Guide — AGLAYA.BIZ

Estado de configuración de todas las plataformas integradas.

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

### Qué monitoriza
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
**Org:** `aglaya-s6`
**Proyecto:** `javascript-astro`
**Plan:** Free (5K errores/mes, 30 días retención)

### DSN (ya configurado en código)
```
https://d1d3347073dadf16d4c7d7625ee28190@o4511058994724864.ingest.us.sentry.io/4511058996101120
```

### Variables de entorno en Netlify (ya configuradas)
| Variable | Descripción |
|---|---|
| `SENTRY_AUTH_TOKEN` | Para subir source maps durante el build |

### Qué captura
- Errores JavaScript en el browser (producción únicamente)
- Errores en Netlify Functions (serverless)
- Source maps: stack traces con código fuente legible

### Alertas recomendadas
> Sentry → Project Settings → Alerts → Create Alert

| Alert | Condition | Action |
|---|---|---|
| New issue | First seen | Email a `info@aglaya.biz` |
| Error spike | >10 events in 1h | Email a `info@aglaya.biz` |

### Nota sobre el filtro `beforeSend()` y Turnstile
El código original incluía un filtro `beforeSend()` en `sentry.client.config.js` para descartar errores de tipo `TurnstileError` (ruido generado por el widget de Cloudflare en URLs no autorizadas). Ese filtro fue **eliminado** cuando se migró a hCaptcha — no porque Sentry esté filtrando el ruido, sino porque **el ruido ya no existe**: hCaptcha no genera ese tipo de error. El resultado es idéntico (Sentry limpio), pero por una razón diferente.

> ⚠️ Si en el futuro se reintegra Cloudflare Turnstile o cualquier widget de terceros que genere errores esperados, habrá que restaurar un filtro `beforeSend()` adecuado.

### Estado actual
- [x] DSN configurado en `sentry.client.config.js`
- [x] DSN configurado en `sentry.server.config.js`
- [x] `SENTRY_AUTH_TOKEN` en Netlify
- [x] `beforeSend()` TurnstileError filter eliminado — ya no necesario (ver nota arriba)
- [ ] Alertas de email configuradas

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

### Flujo de emails del formulario
1. Usuario envía formulario → Netlify Function verifica hCaptcha
2. Función detecta idioma del formulario (`lang: "en"` o `lang: "es"`)
3. **Email de confirmación** → al remitente, en el idioma del formulario (EN: `Signal received — AGLAYA` / ES: `Señal recibida — AGLAYA`), diseño branded con barra roja, eyebrow monospace, titular en negrita y bloque de mensaje con borde rojo izquierdo
4. **Email de notificación de lead** → a `NOTIFY_EMAIL` con tag `[EN]` o `[ES]` en el asunto

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

### Cómo funciona en el sitio
1. Widget se carga en el formulario de contacto (`class="h-captcha"`, `data-theme="dark"`)
2. Usuario completa el challenge
3. hCaptcha emite un token → se habilita el botón "Send Message"
4. El token se envía al backend con el formulario
5. Netlify Function verifica el token contra `https://api.hcaptcha.com/siteverify` con `HCAPTCHA_SECRET`
6. Si válido → se detecta el idioma y se procesan y envían los emails

### Estado actual
- [x] Site key en código fuente (`ContactForm.astro`)
- [x] Site key en Netlify env vars (`PUBLIC_HCAPTCHA_SITE_KEY`)
- [x] Secret key en Netlify env vars (`HCAPTCHA_SECRET`)
- [x] Dominio `aglaya.biz` autorizado en hCaptcha dashboard
- [x] **1 prueba end-to-end exitosa** — 2 adicionales pendientes

---

## 5. Migadu (Email)

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
| Resend | ✅ | ✅ (2/3 pruebas — EN + ES) |
| hCaptcha | ✅ | ✅ (2/3 pruebas — EN + ES) |
| UptimeRobot | ✅ | ✅ 2 monitores activos |
| Migadu | ✅ | ✅ |
