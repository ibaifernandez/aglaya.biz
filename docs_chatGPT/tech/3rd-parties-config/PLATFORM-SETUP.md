# PLATFORM SETUP — Guía de Activación Completa

> Sigue este documento **en orden**. Cada plataforma depende de tener la anterior configurada.

---

## Prerequisito: Repositorio Git + GitHub

Antes de todo lo demás, el código necesita estar en GitHub para que Netlify lo detecte.

```bash
cd /Users/AGLAYA/Local\ Sites/aglaya.biz

# Inicializar Git
git init
git add .
git commit -m "feat: initial Agenc·IA coming soon page"

# Crear repo en GitHub (necesitas tener gh instalado)
gh repo create ibaifernandez/aglaya.biz \
  --public \
  --description "AGLAYA — The Uncomfortable Agency · Agenc·IA"

# Conectar y subir
git remote add origin git@github.com:ibaifernandez/aglaya.biz.git
git branch -M main
git push -u origin main
```

**Verificación**: Abre `https://github.com/ibaifernandez/aglaya.biz` y confirma que los archivos están ahí.

---

## Plataforma 1: Netlify (Hosting + Functions)

### Paso 1 — Crear el sitio
1. Ve a **https://app.netlify.com** → botón **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Autoriza Netlify para acceder a tu GitHub si no lo has hecho
4. Busca y selecciona el repo `ibaifernandez/aglaya.biz`

### Paso 2 — Configurar el build
La configuración ya está en `netlify.toml`, pero confirma que Netlify detecta:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 22 (ya configurado en `netlify.toml`)

Click **"Deploy site"**. El primer deploy tomará 1–2 minutos.

### Paso 3 — Dominio personalizado
1. En tu sitio de Netlify → **"Domain settings"**
2. Click **"Add a domain"** → escribe `aglaya.biz`
3. Netlify te dará instrucciones de DNS. Tienes dos opciones:
   - **Opción A (recomendada)**: Cambiar los nameservers de tu dominio a los de Netlify (control total)
   - **Opción B**: Añadir un registro A apuntando a `75.2.60.5` en tu registrador actual
4. Ve a tu registrador de dominio (GoDaddy, Namecheap, Cloudflare, etc.) y aplica los cambios de DNS
5. Espera propagación DNS (5 min a 24h según el registrador)

### Paso 4 — HTTPS automático
Netlify activa Let's Encrypt automáticamente cuando el DNS propaga. No tienes que hacer nada.

### Paso 5 — Variables de entorno
Antes de continuar con las otras plataformas, ten este panel abierto:
**Site settings → Environment variables** en tu dashboard de Netlify.

Aquí añadirás las variables una a una mientras configuras cada plataforma.

---

## Plataforma 2: Resend (Email)

### Paso 1 — Cuenta
1. Ve a **https://resend.com** → **"Sign up"**
2. Confirma tu email

### Paso 2 — Verificar dominio
1. En el dashboard → **"Domains"** → **"Add Domain"**
2. Escribe `aglaya.biz`
3. Resend te mostrará registros DNS que debes añadir en tu registrador:
   ```
   TXT   @              v=spf1 include:amazonses.com ~all
   TXT   resend._domainkey   (valor largo que te da Resend)
   MX    send            feedback-smtp.us-east-1.amazonses.com
   ```
4. Ve a tu registrador y añade esos registros
5. Vuelve a Resend → click **"Verify DNS records"**
6. El estado cambiará a ✅ Verified (puede tardar hasta 1 hora)

> ⚠️ Si ya usas `info@aglaya.biz` con otro proveedor (Gmail, etc.), no cambies los registros MX principales. Solo añade los registros TXT y el MX del subdominio `send.`

### Paso 3 — Crear API Key
1. En Resend → **"API Keys"** → **"Create API Key"**
2. Nombre: `aglaya-production`
3. Permisos: **Full access**
4. Copia el key (empieza con `re_`). **Solo se muestra una vez.**

### Paso 4 — Variables en Netlify
En **Netlify → Environment variables**, añade:
```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxx
NOTIFY_EMAIL   = info@aglaya.biz  (o el email donde quieres recibir leads)
```

### Verificación
Haz un test enviando el formulario en la web. Deberías recibir:
1. Email de confirmación en la dirección que pusiste en el formulario (en el idioma del formulario)
2. Email de notificación en `NOTIFY_EMAIL` con tag `[EN]` o `[ES]` en el asunto

---

## Plataforma 3: hCaptcha (Bot Protection)

### Paso 1 — Cuenta
1. Ve a **https://www.hcaptcha.com** → **"Sign up"** (gratuito, verificaciones ilimitadas)
2. Confirma tu email y accede al dashboard

### Paso 2 — Añadir el sitio
1. En el dashboard → **"New Site"**
2. Configura:
   - **Label**: `aglaya.biz`
   - **Hostname**: `aglaya.biz` (también puedes añadir `localhost` para development)
   - **Difficulty**: Normal
3. Click **"Save"**

### Paso 3 — Copiar las keys
Verás dos valores:
- **Site Key** (pública, va en el frontend): tu site key única
- En **Settings → Secret Key**: copia el Secret Key (va en el servidor)

### Paso 4 — Variables en Netlify
```
PUBLIC_HCAPTCHA_SITE_KEY = a772dbf8-f0da-4658-a4be-5b0848440ac8
HCAPTCHA_SECRET          = (tu secret key de hCaptcha)
```

> 🔑 La `PUBLIC_` prefix hace que Astro la exponga al cliente (necesario para el widget). La `HCAPTCHA_SECRET` NUNCA debe tener prefix PUBLIC_.

### Verificación
El widget de hCaptcha debe aparecer en el formulario con tema oscuro. El botón de envío estará deshabilitado hasta que hCaptcha complete la verificación. La verificación del token ocurre en el servidor contra `https://api.hcaptcha.com/siteverify`.

---

## Plataforma 4: Sentry (Error Tracking)

### Paso 1 — Cuenta y proyecto
1. Ve a **https://sentry.io** → **"Sign up"** (plan gratuito: 5.000 errores/mes)
2. Durante el onboarding, elige:
   - **Platform**: JavaScript → Browser
   - **Project name**: `aglaya-biz`

### Paso 2 — Obtener el DSN
1. Sentry → tu proyecto `aglaya-biz` → **Settings → Client Keys (DSN)**
2. Copia el DSN. Formato: `https://abc123@o123456.ingest.sentry.io/789`

### Paso 3 — Variable en Netlify
```
PUBLIC_SENTRY_DSN = https://abc123@o123456.ingest.sentry.io/789
```

### Paso 4 — Corregir el snippet en BaseLayout.astro
El archivo `src/layouts/BaseLayout.astro` actualmente tiene un placeholder. Necesita actualizarse para usar el SDK de `@sentry/browser` que ya está instalado.

Abre `src/layouts/BaseLayout.astro` y reemplaza el bloque de Sentry (líneas ~109–120) por:

```astro
{PUBLIC_SENTRY_DSN && (
  <script is:inline define:vars={{ PUBLIC_SENTRY_DSN }}>
    import('https://browser.sentry-cdn.com/8.0.0/bundle.min.js').then(() => {
      if (typeof Sentry !== 'undefined') {
        Sentry.init({
          dsn: PUBLIC_SENTRY_DSN,
          environment: 'production',
          tracesSampleRate: 0.1,
        });
      }
    });
  </script>
)}
```

### Verificación
1. Despliega en Netlify
2. En Sentry → **Issues** — deberías ver el proyecto activo
3. Para forzar un error de prueba, abre la consola del navegador en producción y ejecuta:
   ```js
   Sentry.captureException(new Error('Test error from AGLAYA'))
   ```
4. Aparecerá en Sentry → Issues en ~30 segundos

---

## Plataforma 5: UptimeRobot (Monitoring)

### Paso 1 — Cuenta
1. Ve a **https://uptimerobot.com** → **"Register for FREE"**
2. El plan gratuito incluye 50 monitores con checks cada 5 minutos

### Paso 2 — Crear monitores
Click **"Add New Monitor"** y crea los siguientes:

**Monitor 1 — Homepage EN**
- Monitor Type: `HTTP(s)`
- Friendly Name: `AGLAYA — Homepage EN`
- URL: `https://aglaya.biz`
- Monitoring Interval: `5 minutes`

**Monitor 2 — Homepage ES**
- Monitor Type: `HTTP(s)`
- Friendly Name: `AGLAYA — Homepage ES`
- URL: `https://aglaya.biz/es/`
- Monitoring Interval: `5 minutes`

**Monitor 3 — Contact Function**
- Monitor Type: `HTTP(s)`
- Friendly Name: `AGLAYA — Contact Function`
- URL: `https://aglaya.biz/.netlify/functions/contact`
- HTTP Method: `POST`
- Monitoring Interval: `15 minutes`
- Expected status code: `405` (porque un GET devuelve 405 Method Not Allowed — eso confirma que la función está viva)

### Paso 3 — Alertas
1. En UptimeRobot → **"Alert Contacts"** → **"Add Alert Contact"**
2. Añade tu email y/o número de WhatsApp/Telegram
3. Asigna el contacto a todos tus monitores

### Paso 4 — Status Page (opcional pero recomendado)
1. UptimeRobot → **"Status Pages"** → **"Create Status Page"**
2. Nombre: `AGLAYA Status`
3. URL: algo como `status.aglaya.biz`
4. Añade todos tus monitores
5. Puedes embeber este status page en tu web o compartirlo con clientes

---

## Checklist Final de Verificación

Antes de declarar el sitio como "production-ready":

```
[ ] git push a main → Netlify despliega automáticamente
[ ] https://aglaya.biz carga correctamente (HTTPS verde)
[ ] https://aglaya.biz/es/ carga correctamente
[ ] El formulario de contacto envía (recibes email de confirmación)
[ ] El formulario de contacto recibe notificación en NOTIFY_EMAIL
[ ] hCaptcha widget aparece y permite/bloquea según corresponde
[ ] Cookie banner aparece en primera visita y desaparece tras la elección
[ ] Sentry → Issues muestra el proyecto activo
[ ] UptimeRobot → todos los monitores en estado UP (verde)
[ ] Google Search Console → sitio verificado y sitemap enviado
[ ] Lighthouse score > 90 en Performance, Accessibility, SEO, Best Practices
```

---

## Variables de Entorno — Resumen

| Variable | Plataforma | Scope | Ejemplo |
|---|---|---|---|
| `RESEND_API_KEY` | Resend | Server | `re_abc123...` |
| `NOTIFY_EMAIL` | — | Server | `info@aglaya.biz` |
| `HCAPTCHA_SECRET` | hCaptcha | Server | `ES_xxxxxxxx...` |
| `PUBLIC_HCAPTCHA_SITE_KEY` | hCaptcha | Client | `a772dbf8-f0da-4658-a4be-5b0848440ac8` |
| `PUBLIC_SENTRY_DSN` | Sentry | Client | `https://abc@sentry.io/123` |

> En Netlify: Site → **Environment variables** → para cada una, click "Add variable".
> Para que tomen efecto: **Deploys → Trigger deploy** (o el próximo push a main lo activa automáticamente).
