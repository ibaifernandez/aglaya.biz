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
| 4 | Arquitectura del sitio | Qué páginas, qué jerarquía, qué ruta de conversión | `site-architecture` · `content-strategy` · `cro-methodology` · `seo-audit` | [`sitemap.md`](../_review/strategy-review-260611/sitemap.md) · [`conversion-paths.md`](../_review/strategy-review-260611/conversion-paths.md) | ✅ Ejecutado → archivado |
| 5 | Páginas | Cada página ejecutando su trabajo | `page-cro` · `ads-landing` · `refactoring-ui` · `copywriting` | [`page-specs.md`](../_review/strategy-review-260611/page-specs.md) | ✅ Ejecutado → archivado |
| 6 | Formularios | Captura: usabilidad sin perder personalidad | `form-cro` · `ux-heuristics` · `signup-flow-cro` | [`form-spec.md`](../_review/strategy-review-260611/form-spec.md) | ✅ Ejecutado → archivado |
| 7 | Automatizaciones | Qué pasa tras el submit: CRM, MailerLite, secuencias | `email-sequence` · `analytics-tracking` · `revops` | [`post-capture-flows.md`](../_review/strategy-review-260611/post-capture-flows.md) · [`mailerlite-validation.md`](../_review/strategy-review-260611/mailerlite-validation.md) | ✅ Ejecutado → archivado |
| 8 | [Ventas](08-sales/) | El cierre: propuestas, outreach, ROI audit como oferta | `predictable-revenue` · `aglaya-os:proposal` · `aglaya-os:roi-audit` · `aglaya-os:outreach` | [`roi-audit-offer.md`](08-sales/roi-audit-offer.md) · [`sales-motion.md`](08-sales/sales-motion.md) | ✅ Cerrado (2026-06-11) |

> **Nota de archivo (2026-07-15):** las capas 4–7 ya se **ejecutaron** en el sitio; sus specs
> (`sitemap`, `conversion-paths`, `page-specs`, `form-spec`, `post-capture-flows`, `mailerlite-validation`)
> se archivaron en [`docs/_review/strategy-review-260611/`](../_review/strategy-review-260611/). La capa 1–3 y 8
> (rationale que perdura: positioning, value-prop, catálogo, oferta ROI, sales-motion) siguen aquí como fuente viva.

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

**Fase actual:** ✅✅ **BLUEPRINT COMPLETO + REVISADO (v1.1, 2026-06-11).** Las 8 capas
cerradas y revisadas por el fundador. Lo siguiente es **ejecución**: aplicar este plan
al código del sitio, capa por capa. Cada capa es el contrato de su ejecución.

### Changelog v1.1 — revisión del fundador (2026-06-11)
- **Proof eliminado** como sección/nav → casos absorbidos en **The Stack**, citando clientes **sin ROI** ("construimos herramientas, no garantizamos resultados").
- **Services reintroducida** como página propia: servicios de marketing **selectivos** ("solo si nos gusta tu proyecto") — encuadre de privilegio, no catálogo.
- **Nav v1.1:** Home · The Stack · Web · ROI Audit · Services · Contact (6 items).
- **Propiedad doble:** infraestructura + sistema; corre en la infra del cliente.
- AGLAYA "**principalmente**" instalaciones soberanas (deja aire a las otras líneas).
- Credibilidad = capacidad técnica demostrable (sistemas en vivo), no evidencia de ROI.
- Copy **y UX** crípticos (no solo copy) en el diagnóstico.
- Capacidad de equipo: Món + Ibai asumen todo — capa 8 intacta.
