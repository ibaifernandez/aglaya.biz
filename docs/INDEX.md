# DOCS INDEX — AGLAYA

> Mapa de navegación de toda la documentación del proyecto.
> Si no sabes por dónde empezar, empieza aquí.

---

## Lectura obligatoria (en este orden)

Antes de tocar cualquier otra cosa — código, copy, estrategia — leer estos cuatro:

| # | Documento | Qué responde |
|---|---|---|
| 1 | `BRAND-DNA.md` | Quiénes somos, qué creemos, cómo hablamos. Fuente de verdad de marca. |
| 2 | `BRAND-STRATEGY.md` | A quién le vendemos, a quién no, y por qué. ICP, anti-cliente, posicionamiento. |
| 3 | `SERVICES-AI.md` | Qué construimos, cómo se estructura el engagement, qué cuesta. |
| 4 | `MARKETING-STRATEGY.md` | Cómo llegamos al cliente correcto. GTM, canales, funnel, KPIs. |

---

## Documentación por área

### Marca y Estrategia
*Para decisiones de posicionamiento, copy, oferta y go-to-market.*

| Documento | Contenido |
|---|---|
| `BRAND-DNA.md` | Documento maestro de marca: propósito, UVP, filosofía, glosario de poder, mensajes, manifiesto, LinkedIn, identidad visual. |
| `BRAND-STRATEGY.md` | Posicionamiento operativo, ICP, anti-cliente, personalidad de marca, ventaja competitiva, mensajes por decisor. |
| `SERVICES-AI.md` | Catálogo de servicios del modelo $8K/mes: ROI Audit, System Retainer, los 5 sistemas, proyectos one-time, condiciones. |
| `MARKETING-STRATEGY.md` | Go-to-market de precisión: canales (LinkedIn, referidos, outreach, cold email), funnel, KPIs de negocio. |

---

### Producto
*Para decisiones sobre qué construir, en qué orden y con qué criterio.*

| Documento | Contenido |
|---|---|
| `PRD.md` | Product Requirements Document: visión del producto, requisitos funcionales y no funcionales. |
| `ROADMAP.md` | Fases del proyecto, milestones, estado actual. |
| `BACKLOG.md` | Lista priorizada de tareas pendientes por categoría. |
| `CHANGELOG.md` | Historial de cambios por versión. Formato Keep a Changelog. |

---

### Técnica
*Para decisiones de arquitectura, código y testing. Lectura para desarrolladores.*

| Documento | Contenido |
|---|---|
| `ARCHITECTURE.md` | Visión general de infraestructura, decisiones de arquitectura, stack técnico. |
| `TESTING.md` | Estrategia de testing: Vitest (unit), Playwright (E2E), Axe-core (a11y). Cobertura de caminos críticos. |
| `IA-RULES.md` | Arquitectura de información del sitio y reglas de interacción para agentes de IA. |
| `SERVICES.md` | Guía de configuración de servicios de terceros: Resend, hCaptcha, Sentry, Netlify. |

---

### Setup y Operaciones
*Para configurar el entorno, las plataformas y los flujos de trabajo. Leer una vez, no tocar sin motivo.*

| Documento | Contenido |
|---|---|
| `PLATFORM-SETUP.md` | Guía de activación completa de todas las plataformas, en orden de dependencia. |
| `WORKFLOW-SETUP.md` | Cómo se creó y conectó el proyecto: Astro + GitHub + Netlify. Historial de configuración. |
| `3rd-parties-config/GITHUB_CONFIG.md` | Configuración del repositorio de GitHub. |
| `3rd-parties-config/NETLIFY_CONFIG.md` | Configuración del proyecto en Netlify. |
| `3rd-parties-config/PLATFORMS_CONFIG.md` | Variables de entorno y configuración de plataformas conectadas. |

---

### QA
*Resultados de auditorías de calidad. Referencia para saber qué se ha verificado y qué no.*

| Documento | Contenido |
|---|---|
| `QA/QA-ACCESSIBILITY.csv` | Resultados de auditoría de accesibilidad automatizada (Axe-core). |
| `QA/QA-ACCESSIBILITY-HUMAN-CHECKED.csv` | Verificación humana de los resultados de accesibilidad. |
| `QA/QA-EMAIL.csv` | Pruebas de flujos de email (Resend + confirmaciones). |
| `QA/QA-USABILITY.csv` | Resultados de pruebas de usabilidad. |

---

## Documentos pendientes de crear

Estos documentos no existen aún pero son necesarios para la Fase 2:

| Documento | Propósito | Prioridad |
|---|---|---|
| `KICKOFF-CONTENT-STRATEGY.md` | Prompt de arranque autocontenido para planificar el contenido del sitio completo (Fase 2). Reemplaza la versión obsoleta de marzo 2026. | Alta |
| `CASE-STUDIES.md` | Documentación estructurada de casos de estudio (POCURO, Leben, Norden) con resultados y metodología. | Alta |
| `COPY-SITE.md` | Copy aprobado del sitio completo en EN + ES, organizado por página y sección. | Alta |

---

## Notas de mantenimiento

- Este INDEX se actualiza cada vez que se crea, elimina o renombra un documento en `docs/`.
- Los documentos de marca son los únicos que se actualizan con frecuencia. Los técnicos y de setup son estables.
- Si un documento contradice a `BRAND-DNA.md`, gana `BRAND-DNA.md`. Siempre.
- La carpeta `docs/strategy/` fue eliminada el 28 Mar 2026. Contenía versiones obsoletas del modelo anterior (LATAM emprendedores, $299–$999/mes). Ver `BRAND-STRATEGY.md` sección "Evolución Estratégica" para el contexto.
