# DOCS INDEX — AGLAYA

> Mapa de navegación y jerarquía documental del proyecto.
> Si no sabes por dónde empezar, empieza aquí.
>
> Este INDEX define qué documento manda en cada dominio
> y cuáles quedan como referencia, histórico o revisión.

---

## Leyenda de estado

- **[RECTOR]** → fuente de verdad del dominio
- **[REF]** → referencia activa útil, pero no manda si entra en conflicto con un rector
- **[REV]** → documento en revisión; no debe consumirse como verdad por agentes
- **[HIST]** → histórico; solo contexto humano

---

## Lectura obligatoria (en este orden)

Antes de tocar copy, estrategia, estructura del sitio o decisiones técnicas, leer estos seis:

| # | Documento | Estado | Qué responde |
|---|---|---|---|
| 1 | `docs/brand/dna/BRAND-FOUNDATION.md` | [RECTOR] | Quién es AGLAYA, qué defiende, a quién sirve, a quién excluye y cómo habla. Fuente de verdad de marca. |
| 2 | `docs/AGLAYA-VISUAL-SYSTEM.md` | [RECTOR] | Nombre, subconcepto, taglines, postura de idioma y sistema verbal-visual. |
| 3 | `docs/MARKETING-OPERATING-SYSTEM.md` | [RECTOR] | Modelo de negocio, GTM, criterios de entrada, mensajes por decisor y activación comercial. |
| 4 | `docs/SERVICE-CATALOG.md` | [RECTOR] | Qué vende AGLAYA, cómo se estructura el engagement y qué condiciones rigen la oferta. |
| 5 | `docs/FASE1-WEBSITE-IMPLEMENTATION-BRIEF.md` | [RECTOR] | Qué debe construir la web operativa Fase 1, con qué estructura y bajo qué restricciones. |
| 6 | `docs/IA-RULES.md` | [RECTOR] | Reglas de arquitectura de información, i18n, componentes, testing y seguridad para implementación. |

---

## Regla de precedencia

Si dos documentos se contradicen, gana este orden:

1. `docs/brand/dna/BRAND-FOUNDATION.md`
2. `docs/AGLAYA-VISUAL-SYSTEM.md`
3. `docs/MARKETING-OPERATING-SYSTEM.md`
4. `docs/SERVICE-CATALOG.md`
5. `docs/FASE1-WEBSITE-IMPLEMENTATION-BRIEF.md`
6. `docs/IA-RULES.md`
7. `docs/CHANGELOG.md`
8. `docs/3rd-parties-config/PLATFORMS-CONFIG.md`
9. documentos `[REF]`
10. documentos `[REV]` o `[HIST]`

**Regla especial de estado técnico actual:**  
Si una duda es sobre qué está implementado de verdad hoy, mandan `docs/CHANGELOG.md` y los documentos de configuración activos de plataformas.  
`docs/PRD.md`, `docs/ROADMAP.md` y `docs/BACKLOG.md` no mandan sobre estado real hasta ser reconciliados.

---

## Documentación por dominio

### Marca
*Para propósito, posicionamiento, tesis, ICP, anti-cliente, voz y lenguaje madre.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/brand/dna/BRAND-FOUNDATION.md` | [RECTOR] | Documento maestro de identidad y posicionamiento. Fuente única de verdad de marca. |
| `docs/AGLAYA-VISUAL-SYSTEM.md` | [RECTOR] | Sistema verbal-visual: nombre, subconcepto, taglines, idioma, color, tipografía y dirección visual. |

---

### Comercial
*Para modelo de negocio, GTM, mensajes por decisor, criterios de entrada y activación de mercado.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/MARKETING-OPERATING-SYSTEM.md` | [RECTOR] | Documento maestro de activación comercial: modelo, GTM, anti-mercado, métricas y secuencia comercial. |
| `docs/SERVICE-CATALOG.md` | [RECTOR] | Arquitectura de servicios: ROI Audit, retainer, sistemas, proyectos one-time y condiciones de trabajo. |

---

### Producto
*Para decisiones sobre qué construir, con qué alcance y bajo qué restricciones.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/FASE1-WEBSITE-IMPLEMENTATION-BRIEF.md` | [RECTOR] | Brief de implementación de la web operativa Fase 1. |
| `docs/PRD.md` | [REV] | PRD heredado. Mantener visible, pero no usar como fuente de verdad sin reconciliación. |
| `docs/ROADMAP.md` | [REV] | Timeline y milestones. Útil como contexto, no como estado autoritativo. |
| `docs/BACKLOG.md` | [REV] | Lista priorizada de tareas. Útil como contexto, no como estado autoritativo. |
| `docs/CHANGELOG.md` | [RECTOR] | Historial de cambios implementados. Referencia principal para saber qué cambió de verdad. |

---

### Técnica
*Para arquitectura, implementación, QA, testing y reglas de trabajo para desarrolladores y agentes.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/IA-RULES.md` | [RECTOR] | Reglas no negociables de IA, i18n, componentes, seguridad, performance y testing. |
| `docs/ARCHITECTURE.md` | [REF] | Visión general de infraestructura, flujo de datos y modelo de seguridad. |
| `docs/TESTING.md` | [REF] | Estrategia de testing: unit, E2E, accesibilidad y verificaciones manuales. |

---

### Operaciones y plataformas
*Para configuración actual de GitHub, Netlify y servicios conectados.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/3rd-parties-config/GITHUB-CONFIG.md` | [RECTOR] | Configuración del repositorio GitHub, branch protection, CI y settings recomendados. |
| `docs/3rd-parties-config/NETLIFY-CONFIG.md` | [RECTOR] | Configuración del proyecto en Netlify, env vars, dominio, headers y funciones. |
| `docs/3rd-parties-config/PLATFORMS-CONFIG.md` | [RECTOR] | Estado actual de UptimeRobot, Sentry, Resend, hCaptcha y Migadu. |
| `docs/PLATFORM-SETUP.md` | [REV] | Guía de activación histórica. No usar como fuente de verdad sin reconciliación. |
| `docs/SERVICES-SETUP.md` | [REV] | Setup legado de terceros. Fuera de lectura obligatoria hasta depuración. |
| `docs/WORKFLOW-SETUP.md` | [HIST] | Historial de cómo se creó y conectó el proyecto. Referencia humana. |

---

### Mantenimiento
*Para registrar deuda documental, redundancias, decisiones de mantenimiento y futuras mejoras de estructura.*

| Documento | Estado | Contenido |
|---|---|---|
| `docs/MAINTENANCE_LOG.md` | [REF] | Registro de diagnósticos de mantenimiento y recomendaciones futuras. |

---

## Notas de mantenimiento

- Este INDEX se actualiza cada vez que cambia el estado de un documento: rector, referencia, revisión o histórico.
- Un documento `[REV]` no debe ser consumido por agentes como fuente de verdad.
- Un documento `[HIST]` no participa en precedencia; solo sirve como contexto humano.
- Si aparece una contradicción de marca, manda `docs/brand/dna/BRAND-FOUNDATION.md`.
- Si aparece una contradicción sobre el sistema visual o verbal, manda `docs/AGLAYA-VISUAL-SYSTEM.md`.
- Si aparece una contradicción sobre qué se vende o cómo entra un cliente, mandan `docs/MARKETING-OPERATING-SYSTEM.md` y `docs/SERVICE-CATALOG.md`.
- Si aparece una contradicción sobre qué está implementado hoy, mandan `docs/CHANGELOG.md` y `docs/3rd-parties-config/PLATFORMS-CONFIG.md`.

---

## Estado de la depuración documental

- **Fase 1 — congelación y jerarquía:** cerrada
- **Fase 2 — normalización de nombres y rutas:** cerrada
- **Fase 3 — depuración de obsolescencia:** pendiente
- **Fase 4 — cabeceras de gobernanza por documento:** pendiente
- **Fase 5 — reconciliación por dominio:** pendiente
- **Fase 6 — índice maestro final para agentes:** pendiente
