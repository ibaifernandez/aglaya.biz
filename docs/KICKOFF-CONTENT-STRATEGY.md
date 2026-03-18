# KICKOFF PROMPT — Website Content Strategy
## Hilo nuevo: del Coming Soon al sitio completo

> **Uso:** Pega este documento entero al inicio de una nueva conversación con Claude.
> Es un prompt de arranque, no un documento de lectura pasiva.
> El agente que lo reciba tendrá todo el contexto necesario para trabajar sin briefings adicionales.

---

## QUIÉN SOY Y QUÉ ESTAMOS CONSTRUYENDO

Soy el fundador de **AGLAYA**, una agencia de marketing digital especializada en inteligencia artificial, con sede en España/LATAM. Mi nombre es Ibai Fernández.

El sitio web `aglaya.biz` está construido en **Astro 6.x**, desplegado en **Netlify**, con soporte bilingüe EN/ES nativo. Actualmente está en fase **Coming Soon** (v1.0.0). El objetivo de este hilo es planificar y ejecutar el **contenido del sitio completo** (Fase 2) que reemplazará el Coming Soon.

---

## LA PIEDRA ANGULAR — LEER ANTES DE HACER NADA

> *"La suerte está en el cuidado de los detalles."*
> — Sir Winston Churchill

**La obsesión por el detalle es exactamente lo que diferencia a AGLAYA de una agencia genérica.**

Esta no es una frase de marketing. Es la razón de existir de la marca. Toda decisión de contenido, copy, estructura y diseño debe poder justificarse desde aquí.

AGLAYA incomoda porque exige más. Al cliente, al mercado, y a sí misma. Una agencia que dice la verdad aunque duela, que rehace el trabajo hasta que es correcto, que nota lo que nadie más nota. La IA no cambia esto — lo amplifica. Permite que esa obsesión opere a escala, sin fatiga, sin atajos.

**Bastante bien nunca es suficiente.**

---

## LA MARCA

### Nombre y concepto
- **AGLAYA** — nombre propio. En mitología griega, Aglaya era la Gracia de la belleza, el esplendor y la excelencia. No es accidental.
- **Agenc·IA** (ES) / **AI·gency** (EN) — el subconcepto que define el posicionamiento. El punto `·` es intencional: separa y une.

### Taglines
- **EN:** "The Uncomfortable AI·gency"
- **ES:** "La Agenc·IA Incómoda"
- **Email / copy secundario EN:** "AI executes. Humans strategize."
- **Email / copy secundario ES:** "La IA ejecuta. El humano estrategiza."

### Los tres pilares de marca
1. **Obsesión** — No atención al detalle. Obsesión. Hay diferencia.
2. **Excelencia** — El listón no baja porque el presupuesto sea pequeño, la prisa sea grande, o "nadie se vaya a fijar". Nos fijamos nosotros.
3. **Honestidad incómoda** — La agencia que dice lo que nadie más se atreve. Prefiere perder un cliente a entregar trabajo mediocre.

### Personalidad de voz
- **Tono:** Directo, sin relleno, sin condescendencia
- **Voz:** La de un experto que respeta la inteligencia del interlocutor
- **Actitud:** Perfeccionista. Incómoda. Honesta hasta el punto de incomodar.
- ❌ "Proveemos soluciones integrales de marketing digital mediante el uso de tecnologías disruptivas."
- ❌ "¡Somos apasionados del marketing y estamos aquí para ayudarte a crecer!"
- ✅ "Hacemos que tu marca crezca usando IA. Sin rodeos. Sin mediocridad."
- ✅ "El detalle en el que nadie se fija es exactamente el que nos obsesiona."

### Identidad visual (para decisiones de copy y estructura)
- **Fondo:** `#080808` — negro casi puro
- **Rojo AGLAYA:** `#e8003d`
- **Tipografía display:** Outfit Black 900 — impacto, convicción
- **Tipografía cuerpo:** Inter — legibilidad, precisión
- **Estética general:** oscura, tecnológica, editorial, sin decoración innecesaria
- **Animaciones:** entradas por palabras, scanlines, cursor glow — el detalle que el usuario casi no ve pero siente

---

## EL PRODUCTO — QUÉ VENDE AGLAYA

### Filosofía H+IA
- **IA ejecuta:** genera, automatiza, analiza, optimiza a escala y velocidad imposibles para un humano
- **Humano supervisa:** da el contexto, la estrategia, el criterio y la corrección
→ Calidad de boutique a precio de herramienta.

### Audiencia objetivo
**Primaria — El Emprendedor Exigente**
- 28–45 años, Colombia / México / Argentina / España
- Negocio que funciona pero no crece como debería
- Harto: las agencias baratas no entregan, las buenas cobran demasiado
- Aprecia el detalle. Nota cuando algo está bien hecho.

**Secundaria — La PYME con Estándares**
- $50K–$500K USD/año, 5–50 personas
- Marketing disperso, sin estrategia
- Quiere un socio que tome su marca tan en serio como ellos

**Terciaria — El Startup con Ambición**
- Budget limitado, expectativas altísimas
- Entiende que la percepción lo es todo en fase early-stage

**Lo que une a los tres:** exigen más de lo que el mercado suele ofrecer.

### Servicios
1. **AI Brand Strategy** — $799 one-time. Análisis de mercado + UVP + arquitectura de marca.
2. **AI Content Engine** — desde $299/mes. Producción de contenido automatizada, supervisada.
3. **AI-Powered Advertising** — desde $399/mes (+ budget del cliente). Meta/Google/TikTok Ads.
4. **Web Design & Dev** — desde $799. Astro/Next.js, orientado a conversión.
5. **Marketing Intelligence Dashboard** — desde $299/mes. GA4 + Looker Studio + informes IA.
6. **AI Visual Identity** — $499 one-time. Logo, paleta, tipografía, manual.
7. **WhatsApp & Email Automation** — $599 setup + $199/mes. Flujos de ventas 24/7.
8. **AI SEO** — desde $399/mes. Keyword research + contenido optimizado + posicionamiento.

### Paquetes mensuales
| Plan | Precio | Para quién |
|---|---|---|
| Spark | $299/mes | Emprendedores y freelancers — 1 canal |
| Ignite | $599/mes | PYMEs en crecimiento — 3 canales + ads |
| Blaze | $999/mes | Escalar — full stack de marketing |
| Inferno | Cotización | Empresas medianas o necesidades específicas |

---

## EL TECH STACK (contexto para el agente)

El agente que trabaje en este hilo **no tiene por qué tocar el código**. Pero debe conocer las restricciones técnicas para no plantear estructuras inviables.

- **Framework:** Astro 6.x (SSR via Netlify adapter)
- **Styling:** Tailwind CSS v4 — utilidades primero, scoped CSS en componentes
- **i18n:** todas las cadenas de texto van en `src/i18n/translations.ts`. Nada hardcodeado. Cada string tiene versión EN y ES.
- **Componentes:** `.astro` para contenido estático. `<script>` solo para interactividad cliente.
- **Fuentes:** Outfit (display/headings) + Inter (body) — Google Fonts
- **Contenido dinámico futuro:** MDX + Content Collections (Astro nativo) para blog y casos de estudio
- **Accesibilidad:** WCAG 2AA obligatorio. Axe-core pasa en CI en cada PR.
- **Bilingüismo:** cada página existe en EN (`/`) y ES (`/es/`). Hreflang parity total.

**Lo que NO se usa:**
- React, Vue ni ningún framework de UI
- PostCSS (Tailwind v4 usa plugin de Vite)
- CMS externo de momento (se evalúa para Fase 2 blog)

---

## ESTADO ACTUAL DEL SITIO (v1.0.0)

El sitio coming soon tiene:
- Header: logo + language switcher + WhatsApp CTA
- Hero: animación tipográfica word-by-word + scanline + cursor glow
- Marquee: loop de los 8 servicios
- Sección de contacto: formulario (nombre + email + mensaje) + hCaptcha + botón WhatsApp
- Footer implícito (no hay footer explícito todavía)
- Cookie consent banner (GDPR)
- Página 404 bilingüe
- Sentry para error tracking
- UptimeRobot para monitorización

**Lo que NO existe aún (objetivo de Fase 2):**
- Páginas de servicios individuales
- Página "Nosotros / About"
- Portfolio / casos de estudio
- Blog / recursos
- Página de precios explícita
- Footer completo
- Política de privacidad / Cookies (página)

---

## EL OBJETIVO DE ESTE HILO

**Planificar y escribir el contenido completo del sitio web Fase 2.**

Esto incluye, en este orden de prioridad:

### 1. Arquitectura de información
¿Qué páginas tiene el sitio? ¿Cuál es la jerarquía? ¿Qué va en la navegación principal?

Propuesta de partida (a validar y refinar):
```
/                    — Home (reemplaza coming soon)
/servicios/          — Página de servicios (overview)
/servicios/[slug]/   — Página individual por servicio (×8)
/nosotros/           — About / Manifiesto
/casos/              — Portfolio / Casos de estudio
/blog/               — Blog / Recursos (MDX)
/precios/            — Pricing
/contacto/           — Contacto ampliado
/privacidad/         — Política de privacidad
/cookies/            — Política de cookies
```
Todo esto con paridad EN/ES.

### 2. Copy de la Home
La página más importante. Debe:
- Capturar en 3 segundos quién es AGLAYA y por qué importa
- Comunicar la propuesta de valor desde la obsesión/excelencia, no desde los buzzwords de IA
- Generar la acción: contactar / ver servicios

### 3. Copy de servicios
Cada servicio tiene su propia página. No fichas de catálogo — páginas que convencen.

### 4. Manifiesto / About
AGLAYA tiene una filosofía muy definida. La página About no es un "quiénes somos" corporativo. Es un manifiesto. "Esto es en lo que creemos. Esto es lo que no haremos nunca. Si compartes estos valores, somos tu agencia."

### 5. Política de privacidad y cookies
Legal pero sin ser indigesta. Redactada con la voz de AGLAYA — directa, sin jerga legal innecesaria donde se pueda evitar.

---

## CÓMO TRABAJAMOS (proceso para este hilo)

1. **Una sección a la vez.** No intentar escribir todo el sitio de golpe. Cada bloque de copy se revisa, aprueba y documenta antes de pasar al siguiente.

2. **Siempre EN + ES simultáneamente.** Cada string se escribe en los dos idiomas. No "primero EN y luego traducimos" — las dos versiones se trabajan en paralelo para que ninguna sea una traducción literal de la otra.

3. **El copy va al archivo de traducciones.** El destino final de todo texto de UI es `src/i18n/translations.ts`. Cuando una sección de copy quede aprobada, se formaliza en ese formato.

4. **Documentar las decisiones.** Cuando se elija una dirección de copy sobre otra, queda registrado por qué. Este repo tiene una cultura de documentación obsesiva — mantenerla.

5. **El listón es alto.** Primera versión no es suficiente. Se itera hasta que sea excelente. No mediocre, no "está bien", no "ya lo mejoramos luego". Excelente.

---

## ARCHIVOS RELEVANTES EN EL REPO

| Archivo | Contenido |
|---|---|
| `docs/BRAND-STRATEGY.md` | Estrategia de marca completa — **leer primero** |
| `docs/MARKETING-STRATEGY.md` | Funnel, canales, precios, KPIs |
| `docs/SERVICES-AI.md` | Catálogo de servicios detallado |
| `docs/ROADMAP.md` | Fases del proyecto, milestones |
| `src/i18n/translations.ts` | Todas las cadenas de texto actuales (referencia de formato) |
| `src/layouts/BaseLayout.astro` | Layout base — SEO, meta, estructura |
| `CLAUDE.md` | Instrucciones técnicas para el agente (convenciones, gotchas) |

---

## PRIMERA TAREA DE ESTE HILO

**Comenzar por la arquitectura de información.**

Proponer la estructura de páginas definitiva del sitio completo, con:
- URL slug (EN y ES)
- Propósito de cada página en una frase
- Prioridad de desarrollo (qué se construye antes)
- Qué páginas pueden compartir layout vs cuáles necesitan diseño único

Antes de escribir una sola línea de copy, la arquitectura tiene que estar clara y aprobada. Los cimientos primero.

---

*Documento generado el 17 Mar 2026 — AGLAYA v1.0.0 pre-release*
*Repositorio: `github.com/ibaifernandez/aglaya.biz`*
