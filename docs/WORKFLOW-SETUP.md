# 🚀 WORKFLOW-SETUP.md — Cómo se configuró este proyecto

> Este documento recoge el flujo exacto que se siguió para crear y conectar el proyecto Astro
> con GitHub y Netlify, para que nunca más haya que inferirlo o reconstruirlo de memoria.

---

## Contexto: la convivencia WordPress + Astro

El servidor local (OrbStack / Docker) sirve toda la carpeta `/Users/AGLAYA/Local Sites/wordpress/`
como si fuera el `html/` de un WordPress clásico. Cada dominio tiene su propia subcarpeta:

```
/Users/AGLAYA/Local Sites/wordpress/
├── ibaifernandez.com/
│   ├── docker-compose.yml          ← levanta WordPress en el puerto asignado
│   └── html/
│       ├── wp-*                    ← instalación WordPress legacy
│       └── ibaifernandez.com-astro/  ← ← ← ESTE ES EL PROYECTO REAL
│
├── aglaya.biz/
│   ├── docker-compose.yml
│   └── html/
│       ├── wp-*
│       └── aglaya.biz-astro/       ← plantilla para el nuevo proyecto
...
```

**La clave:** el proyecto Astro vive como una subcarpeta dentro de `html/`, pero tiene
**su propio repositorio Git independiente**. WordPress no sabe que existe; Git no sabe
que hay un WordPress alrededor.

---

## Paso a paso: configuración inicial de un nuevo sitio Astro

### 1. Crear el proyecto Astro

```bash
# Dentro de html/ del dominio correspondiente
cd "/Users/AGLAYA/Local Sites/wordpress/DOMINIO/html/"

npx create-astro@latest DOMINIO-astro \
  --template minimal \
  --no-install \
  --no-git

cd DOMINIO-astro
npm install
```

### 2. Añadir integraciones esenciales

```bash
npx astro add netlify    # adapter para Netlify SSR
npx astro add sitemap    # sitemap automático
npx astro add tailwind   # (opcional) si se usa Tailwind
```

### 3. Inicializar el repositorio Git local

```bash
git init
git add .
git commit -m "feat: initial Astro project setup"
```

### 4. Crear el repositorio en GitHub

Crear manualmente en https://github.com/new (o con la GitHub CLI):

```bash
gh repo create OWNER/DOMINIO \
  --public \
  --description "DESCRIPCIÓN DEL SITIO"
```

### 5. Conectar local → GitHub

```bash
git remote add origin git@github.com:OWNER/DOMINIO.git
git branch -M main
git push -u origin main
```

### 6. Configurar el sitio en Netlify

1. Ir a https://app.netlify.com → **Add new site → Import an existing project**
2. Conectar con GitHub → seleccionar el repo `OWNER/DOMINIO`
3. Configuración del build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Deploy site**
5. En **Domain settings**, añadir el dominio personalizado (`DOMINIO`)
6. Configurar los DNS del dominio para apuntar a Netlify

### 7. Configurar `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://DOMINIO',
  integrations: [sitemap(), tailwind()],
  adapter: netlify(),
  i18n: {
    defaultLocale: 'en',  // o 'es' según el proyecto
    locales: ['en', 'es'],
  },
});
```

### 8. Verificar el flujo completo

```bash
npm run build      # debe completar sin errores
git add .
git commit -m "feat: production-ready config"
git push           # → Netlify detecta el push y despliega automáticamente
```

---

## Flujo de trabajo en estado de cruzero (día a día)

```
Editar código en local
        │
        ▼
npm run dev          → verificar en http://localhost:4321
        │
        ▼
npm run build        → verificar que no hay errores
        │
        ▼
npx playwright test  → 100% tests en verde
        │
        ▼
git add + commit + push → Netlify despliega automáticamente
        │
        ▼
Verificar en https://DOMINIO
```

---

## Proyectos activos con este patrón

| Dominio | Astro folder | Repo GitHub | Puerto local |
|---|---|---|---|
| ibaifernandez.com | `ibaifernandez.com-astro/` | `ibaifernandez/ibaifernandez.com` | 4321 (dev) |
| aglaya.biz | `aglaya.biz-astro/` | `ibaifernandez/aglaya.biz` *(pendiente)* | 4322 (dev) |

---

## Notas importantes

- **No** hacer `git init` en `html/` ni en la raíz del dominio — solo dentro de `DOMINIO-astro/`
- El `.gitignore` debe incluir `dist/`, `node_modules/`, `.env`
- Netlify usa el `netlify.toml` en la raíz del repo Astro para configuración avanzada
- El adapter `@astrojs/netlify` hace el build SSR; Netlify lo ejecuta como Edge Function
