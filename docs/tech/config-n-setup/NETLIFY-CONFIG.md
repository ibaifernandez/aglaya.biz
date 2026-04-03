# Netlify Configuration Guide — AGLAYA.BIZ

Cuenta: **Ibai Fernández** (Legacy Free — 300 build minutes/mes)
Proyecto: `aglaya` → https://aglaya.netlify.app
Dominio primario: https://aglaya.biz

---

## 1. Variables de Entorno

> Site settings → Environment variables

Todas deben estar configuradas en **All scopes** (Production, Deploy Previews, Branch deploys).

| Variable | Scope | Descripción | Valor ejemplo |
|---|---|---|---|
| `RESEND_API_KEY` | Builds, Functions, Runtime | API key de Resend para envío de emails (**Sensitive**) | `re_xxxxxxxxx` |
| `HCAPTCHA_SECRET` | Builds, Functions, Runtime | Secret key de hCaptcha (server-side) (**Sensitive**) | `ES_xxxxxxxx...` |
| `PUBLIC_HCAPTCHA_SITE_KEY` | All scopes | Site key de hCaptcha (client-side) | `a772dbf8-f0da-4658-a4be-5b0848440ac8` |
| `NOTIFY_EMAIL` | All scopes | Email destinatario de notificaciones de leads | `info@aglaya.biz` |
| `SENTRY_AUTH_TOKEN` | Builds, Functions, Runtime | Auth token de Sentry para subir source maps | `sntrys_xxxxx` |
| `NODE_VERSION` | All scopes | Versión de Node.js para el build | `22` |

> ⚠️ **CRÍTICO:** `RESEND_API_KEY` y `HCAPTCHA_SECRET` deben marcarse como **Sensitive** (no visibles en los logs).

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
| `contact.ts` | `/.netlify/functions/contact` | Gestiona el formulario de contacto: verifica hCaptcha + envía emails bilingües vía Resend |

---

## 5. Notificaciones de Deploy

> Site settings → Build & deploy → Deploy notifications

Recomendado activar:
- **Email** al propietario cuando un deploy falle
- **Slack** (opcional) si se usa Slack en el equipo

---

## 6. Headers de Seguridad (netlify.toml)

Ya configurados en `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

> **Pendiente Fase 2:** Content-Security-Policy (CSP) — requiere configurar nonces en Astro.

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
| Sentry | aglaya-s6 | Proyecto `javascript-astro` |
| Resend | info@aglaya.biz | 3.000 emails/mes gratis |
| hCaptcha | ibaifernandez | Bot protection (reemplaza Turnstile) |
| Cloudflare | ibaifernandez | DNS (proxy) |
| Migadu | aglaya.biz | Email transaccional |

---

## 9. Checklist de verificación post-deploy

Después de cada deploy a producción:
- [ ] https://aglaya.biz/ carga correctamente
- [ ] https://aglaya.biz/es/ carga correctamente
- [ ] Formulario de contacto completa el flujo (hCaptcha → envío → mensaje de éxito)
- [ ] Email de confirmación llega al remitente (EN o ES según idioma del formulario)
- [ ] Email de notificación llega a `info@aglaya.biz`
- [ ] Sentry no registra errores nuevos
- [ ] UptimeRobot muestra ambos monitores en verde
