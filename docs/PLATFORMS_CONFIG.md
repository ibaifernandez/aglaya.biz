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
- [ ] Monitor EN creado
- [ ] Monitor ES creado
- [ ] Alertas configuradas a `info@aglaya.biz`

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

### Estado actual
- [x] DSN configurado en `sentry.client.config.js`
- [x] DSN configurado en `sentry.server.config.js`
- [x] `SENTRY_AUTH_TOKEN` en Netlify
- [x] Primer error capturado (TurnstileError desde bot — comportamiento esperado)
- [ ] Alertas de email configuradas
- [ ] Issue resuelto: JAVASCRIPT-ASTRO-1 (TurnstileError bot — marcar como resolved)

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
1. Usuario envía formulario → Netlify Function verifica Turnstile
2. **Email de confirmación** → al remitente (desde `info@aglaya.biz`)
3. **Email de notificación de lead** → a `NOTIFY_EMAIL`

### Verificar que funciona
1. Ir a https://aglaya.biz/
2. Completar el formulario (nombre + email + mensaje)
3. Pasar el Turnstile
4. Enviar
5. Confirmar: mensaje de éxito "Message sent. We'll be in touch within 24 hours."
6. Confirmar: email de confirmación recibido
7. Confirmar: notificación de lead recibida en `info@aglaya.biz`

### Logs
> resend.com → Emails → filtrar por dominio `aglaya.biz`

### Estado actual
- [x] API key configurada en Netlify
- [x] DNS DKIM verificado
- [x] Función `contact.ts` implementada
- [ ] **Prueba end-to-end pendiente** (QA manual)

---

## 4. Cloudflare Turnstile

**URL:** https://dash.cloudflare.com → Turnstile
**Plan:** Free (ilimitado)
**Tipo:** Widget de verificación anti-bot (invisible/managed)

### Keys configuradas
| Variable | Scope | Valor |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Client | `0x4AAAAAACr7qLXpzOQqF7Ni` |
| `TURNSTILE_SECRET` | Server | En Netlify (no exponer) |

### Dominio autorizado
> Cloudflare Dashboard → Turnstile → Widget → Allowed domains

Debe incluir:
- `aglaya.biz` ✅
- `www.aglaya.biz` (si aplica)

> ⚠️ Los deploy previews de Netlify (`*.netlify.app`) **no están autorizados** intencionalmente. El error `TurnstileError: 110200` que captura Sentry desde bots en URLs de preview es comportamiento esperado y correcto.

### Cómo funciona en el sitio
1. Widget se carga en el formulario de contacto
2. Usuario completa el challenge (normalmente invisible)
3. Turnstile emite un token → se habilita el botón "Send Message"
4. El token se envía al backend con el formulario
5. Netlify Function verifica el token contra la API de Cloudflare
6. Si válido → se procesan y envían los emails

### Estado actual
- [x] Site key en código fuente (`ContactForm.astro`)
- [x] Site key en Netlify env vars
- [x] Secret key en Netlify env vars
- [x] Dominio `aglaya.biz` autorizado en Cloudflare
- [ ] **Prueba end-to-end pendiente** (QA manual)

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
| GitHub Actions | ✅ | 🔄 En progreso |
| Sentry | ✅ | ✅ (captura activa) |
| Resend | ✅ | ⏳ QA pendiente |
| Turnstile | ✅ | ⏳ QA pendiente |
| UptimeRobot | ⏳ Crear monitores | ⏳ |
| Migadu | ✅ | ✅ |
