# OUTREACH STRATEGY
## AGLAYA — Growth & Expansion Backlog

12 líneas de acción priorizables. Sin orden definitivo. Cada una es ejecutable de forma independiente.

---

### 01 — Kanban Sandbox (público)
**Tipo:** Producto · Engineering  
**Origen:** `/Users/AGLAYA/Local Sites/aglaya-kanban-desk`

Desplegar una instancia pública del Kanban Desk con datos de demostración. El visitante entra, explora, entiende. No hay demo más convincente que el producto real funcionando. URL provisional: `kanban.aglaya.biz/sandbox`.

---

### 02 — Automatizaciones en Mailerlite ✅
**Tipo:** Ops · Marketing  

Conectar el formulario de Dispatch (footer) a Mailerlite. Secuencia de bienvenida automatizada, segmentación por idioma (EN/ES/PT), cadencia de envío definida. Base para el Dispatch real.

**COMPLETADO — 2026-05-13.** MailerLite conectado y activo en producción. 5 automations activas: (1) Dispatch Entry Protocol — Cualificado, (2) Dispatch Entry Protocol — General, (3) Borderline, (4) No Cualificado, (5) Cotización. Segmentación por idioma (EN/ES/PT) operativa vía campo `language`. Resend no interviene en comunicaciones a suscriptores — MailerLite es el único canal de email hacia usuarios.

---

### 03 — Estrategia de Redes Sociales
**Tipo:** Distribución · Brand  

Definir canales, formatos, frecuencia y voz para LinkedIn (principal) + otros. Calendario editorial. Repurposing del contenido ya existente (casos de estudio, servicios, ROI Audit) en formatos de red.

---

### 04 — ROI Audit Interactivo
**Tipo:** Producto · Lead Gen  

La página `/roi-audit/` existe pero es estática. Convertirla en una calculadora real: horas/mes × coste por hora × tareas automatizables = número concreto. El lead ve su problema cuantificado antes de hablar con nosotros.

---

### 05 — AI Chatbot de Cualificación
**Tipo:** Producto · Conversión  

Widget en la web conectado a la API de Claude. Hace las preguntas del formulario de contacto en modo conversacional. Cualifica en tiempo real. Transfiere a humano cuando el lead está maduro. Más conversiones, menos fricciones.

---

### 06 — Automatización del Dispatch ✅
**Tipo:** Contenido · Ops  

El Dispatch Entry Protocol (v2) está documentado y listo para carga en MailerLite (`docs/brand/mkt/DISPATCH-ENTRY-PROTOCOL-v2.md`): 3 emails × 3 idiomas, arquitectura Day 0/2/5/9, regla de exclusión vía `onboarding_active`, ruteo por campo `language`.

**COMPLETADO — 2026-05-13.** Automations 1 y 2 activas (Dispatch Entry Protocol Cualificado y General). Emails 1–3 × 3 idiomas configurados y activos en MailerLite. `onboarding_active` se establece en `1` al entrar y se resetea a `0` al completar Email 3 (día 9). Ver `docs/brand/mkt/DISPATCH-ENTRY-PROTOCOL-v2.md` y `docs/brand/mkt/MAILERLITE-AUTOMATIONS-MASTER.md` para copy completo.

---

### 07 — Recuperar Norden
**Tipo:** Contenido · Proof  
**Archivo:** `src/content/proof/norden.md` (noindex activo)

El proyecto existe. El trabajo es real. Con fotografía de calidad del espacio físico resultante, es el caso de estudio más visual del portfolio. Requiere: fotos + revisión de copy + quitar noindex.

---

### 08 — Playbook Descargable
**Tipo:** Contenido · Lead Magnet  

PDF de 8-10 páginas: "Cómo auditar tus operaciones para AI". El contenido base ya existe en `/services/` y `/roi-audit/`. Necesita diseño, portada y CTA de descarga gateada (email). Lead gen pasivo.

---

### 09 — Video Proof
**Tipo:** Contenido · Distribución  

Screen recording de 90 segundos del Kanban Desk en acción. Sin producción compleja. Para LinkedIn, para la proof page, para propuestas comerciales. El formato de mayor consumo en B2B LATAM en 2026.

---

### 10 — Propuestas Automatizadas
**Tipo:** Ops · Comercial  

Plantilla branded (Notion / Google Slides / PDF) que se completa a partir de los datos del lead cualificado. Menos tiempo por propuesta, más consistencia de marca, velocidad de cierre mayor. Proceso: brief → template → propuesta en <2h.

---

### 11 — Sistema de Referidos
**Tipo:** Growth · Comercial  

Formalizar lo que ahora es informal. Definir: qué se ofrece a quien refiere un cliente (descuento, comisión, crédito de servicio), cómo se rastrea, cómo se comunica. Una página o documento interno basta para empezar.

---

### 12 — Herramienta Pública Gratuita
**Tipo:** Producto · Growth · Autoridad  

Publicar algo pequeño y útil como producto independiente: calculador de ROI, generador de prompts para ops, auditor de procesos, lo que sea. Tráfico orgánico, autoridad técnica, lead gen pasivo. La mejor carta de presentación para una AI·gency es una herramienta que la gente use.

---

## Estado

| # | Línea | Estado |
|---|---|---|
| 01 | Kanban Sandbox | `PENDIENTE` |
| 02 | Automatizaciones Mailerlite | `COMPLETADO` |
| 03 | Estrategia Redes Sociales | `PENDIENTE` |
| 04 | ROI Audit Interactivo | `PENDIENTE` |
| 05 | AI Chatbot Cualificación | `PENDIENTE` |
| 06 | Automatización Dispatch | `COMPLETADO` |
| 07 | Recuperar Norden | `PENDIENTE` |
| 08 | Playbook Descargable | `PENDIENTE` |
| 09 | Video Proof | `PENDIENTE` |
| 10 | Propuestas Automatizadas | `PENDIENTE` |
| 11 | Sistema de Referidos | `PENDIENTE` |
| 12 | Herramienta Pública Gratuita | `PENDIENTE` |

---

*Última actualización: 2026-05-13*
