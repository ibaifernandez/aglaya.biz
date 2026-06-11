# AGLAYA — Blueprint de Transformación Comercial

> **Esta carpeta es un plan de implementación, no la implementación.**
> Documentamos primero la estrategia completa, capa por capa. El código del
> sitio no se toca hasta que el blueprint esté cerrado y aprobado.

## Principio: cascada estratégica

Cada capa **hereda de la de arriba**. No se optimiza un formulario (capa 6) hasta
que la oferta de valor (capa 2) está decidida. Bajar, nunca subir. El artefacto
que produce cada capa es el input de la siguiente.

## Las 8 capas

| # | Capa | Qué decide | Skills | Artefacto | Estado |
|---|------|-----------|--------|-----------|--------|
| 1 | [Posicionamiento](01-positioning/) | Quiénes somos, categoría, mercado, ICP, narrativa | `obviously-awesome` · `crossing-the-chasm` · `jobs-to-be-done` · `aglaya-os:brand-voice` | [`positioning-statement.md`](01-positioning/positioning-statement.md) | ✅ Cerrado (2026-06-11) |
| 2 | [Oferta de valor](02-value-proposition/) | Por qué te eligen; mensaje matriz; el "incómodo" como ventaja | `hundred-million-offers` · `storybrand-messaging` · `made-to-stick` · `mom-test` | [`value-proposition.md`](02-value-proposition/value-proposition.md) | ✅ Cerrado (2026-06-11) |
| 3 | [Productos](03-products/) | Catálogo: packaging, pricing, posición vs alternativas | `pricing-strategy` · `product-marketing-context` · `competitor-alternatives` · `free-tool-strategy` | [`catalog.md`](03-products/catalog.md) | ✅ Cerrado (2026-06-11) |
| 4 | [Arquitectura del sitio](04-site-architecture/) | Qué páginas, qué jerarquía, qué ruta de conversión | `site-architecture` · `content-strategy` · `cro-methodology` · `seo-audit` | [`sitemap.md`](04-site-architecture/sitemap.md) · [`conversion-paths.md`](04-site-architecture/conversion-paths.md) | ✅ Cerrado (2026-06-11) |
| 5 | [Páginas](05-pages/) | Cada página ejecutando su trabajo | `page-cro` · `ads-landing` · `refactoring-ui` · `copywriting` | [`page-specs.md`](05-pages/page-specs.md) | ✅ Cerrado (2026-06-11) |
| 6 | [Formularios](06-forms/) | Captura: usabilidad sin perder personalidad | `form-cro` · `ux-heuristics` · `signup-flow-cro` | [`form-spec.md`](06-forms/form-spec.md) | ✅ Cerrado (2026-06-11) |
| 7 | [Automatizaciones](07-automations/) | Qué pasa tras el submit: CRM, MailerLite, secuencias | `email-sequence` · `analytics-tracking` · `revops` | Flujos post-captura | ⬜ Pendiente |
| 8 | [Ventas](08-sales/) | El cierre: propuestas, outreach, ROI audit como oferta | `predictable-revenue` · `aglaya-os:proposal` · `aglaya-os:roi-audit` · `aglaya-os:outreach` | Motor comercial | ⬜ Pendiente |

## Cómo se usa

1. Trabajamos una capa a la vez, **de arriba abajo**.
2. En cada capa: aplico la(s) skill(s), genero el/los documento(s), los guardo en su subcarpeta.
3. El fundador decide los huecos que solo él puede llenar y cierra la capa.
4. Capa cerrada → se marca ✅ en esta tabla → se baja a la siguiente.
5. Cuando las 8 estén cerradas, este blueprint es el plan de ejecución del sitio.

## Pendientes técnicos reubicados

La cola técnica previa se absorbe en las capas:
- ROIForm backend (antes #7) → **capa 8 (Ventas)**.
- MailerLite E2E (antes #9) → **capa 7 (Automatizaciones)**.
- Scan Ley 21.719 sobre aglaya.biz (antes #18) → independiente (compliance, no conversión).

## Estado global

**Fase actual:** ✅ Capas 1-6 cerradas (2026-06-11) → siguiente: Capa 7 (Automatizaciones).
