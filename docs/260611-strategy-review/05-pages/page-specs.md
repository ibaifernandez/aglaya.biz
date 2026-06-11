# Specs de Página AGLAYA — v1.0 (CERRADO 2026-06-11)

> **Estado:** ✅ CERRADO. Spec de rediseño (no código) por página, derivado de las
> capas 1-4. Cada página cierra en su punto fuerte y empuja UNA acción. Trilingüe.
>
> **Resumen:** Home 8→6 secciones · The Stack cierra en Productive Friction (núcleo
> "Hablemos", $8K oculto) · Web=landing del cotizador · ROI Audit=gamificación con
> backend real. Mecánica fina del ROI Audit → capa 6.

---

## 1. Home (`/`) — ACORTAR

**Problema:** 8 secciones (Hero · Problem · SystemsGrid · HowItWorks · ProofGrid ·
AntiClient · Economics · ICP-Filter). Diluye el mensaje y entierra el CTA. El
formulario ICP vive aquí (debe irse al ROI Audit, capa 4).

**Objetivo:** enganchar con el posicionamiento, nombrar el dolor, mostrar el Stack,
probar, y empujar UNA acción (ROI Audit). No contarlo todo — el detalle vive en The Stack.

**Estructura nueva (6 bloques):**
1. **Hero** — posicionamiento: instalaciones soberanas / "la agencia que confronta". CTA primario → ROI Audit; secundario → Proof.
2. **Los 3 enemigos** — condensar Problem + AntiClient en el dolor central: la agencia-alquiler, el SaaS-parásito, el modelo de horas. Corto y punzante.
3. **El Stack (teaser)** — qué es, en 1 bloque. NO los 5 sistemas detallados (eso es The Stack). Link "ver The Stack".
4. **Economics** — el anclaje "coste de NO poseer" (mantener, condensado). Es el argumento económico que cierra.
5. **Proof** — el grid actual (1-2-1). Cada caso a su puerta.
6. **CTA final** — una sola: ROI Audit.

**Sale del home:** SystemsGrid detallado (→ The Stack), HowItWorks/Protocol (→ The
Stack o ROI Audit), el ICP-Filter form (→ ROI Audit).

---

## 2. The Stack (`/services`) — CORTAR + RENOMBRAR

**Problema:** "Services" como nombre (contradice "NO VENDEMOS SERVICIOS"); arrastra
"Investment / Two entry points" + "Work Conditions" (7 condiciones) tras el punto
fuerte (SYSTEM_05 Productive Friction).

**Objetivo:** presentar el Stack y sus 5 sistemas, cerrar en Productive Friction,
empujar al ROI Audit.

**Estructura nueva:**
1. **Hero** — "NO VENDEMOS SERVICIOS / vendemos infraestructura" (mantener — es el copy que te encanta).
2. **Filosofía** — Identify → Build → Own (mantener).
3. **Los 5 sistemas** (01-05), cerrando en **05 Productive Friction · "Strategic challenge to expose truth"**.
4. **✂️ CORTE AQUÍ.** Eliminar/ocultar "Investment / Two entry points" y "Work Conditions".
5. **CTA final** — "Empieza con la auditoría" → ROI Audit. *(El fundador pidió: a lo sumo dejar el CTA del final. Se queda.)*

**✅ Decisión (2026-06-11): núcleo 100% "Hablemos".** The Stack público NO muestra
cifras. CTA único → ROI Audit. **Pero nada se tira:** el bloque "Investment + Work
Conditions" ($8K/mes + las 7 condiciones) se **mueve a una página oculta**
(noindex, fuera de nav y sitemap — como el journal de DJ Amapola), guardada como
**semilla de una futura landing de conversión** del núcleo. Recuperable cuando se
quiera activar.

---

## 3. Web (`/quote`) — RECONVERTIR EN LANDING

**Problema:** página larga en columna estrecha (max-w-4xl), no aprovecha el ancho;
es un formulario, no una landing que venda.

**Objetivo:** landing del peldaño 2 (Web). Vender "tu web, en repo, es tuya desde el
día 1" y capturar vía el cotizador (que YA funciona, backend real — no se toca la lógica).

**Estructura nueva:**
1. **Hero landing** — full-width, vendedor: el sitio que posees, soberano, con disciplina (tests, CI/CD, Lighthouse 100). Prueba: DJ Amapola + Elm St.
2. **Por qué AGLAYA Web** — los diferenciales (no WordPress/Webflow alquilado; entrega en repo; performance; seguridad).
3. **Cotizador** — el actual, pero **aprovechando el ancho** (steps en layout más horizontal/amplio, no columna estrecha). Lógica de precio intacta.
4. **Always included** — el bloque actual (SEO, GA4, responsive, WCAG, repo).
5. **CTA / captura** — el form del cotizador (ya real).

**Enlace de entrada:** desde el proof de webs (DJ Amapola, Elm St.) → aquí.

---

## 4. ROI Audit (`/roi-audit`) — GAMIFICACIÓN-DIAGNÓSTICO

**Problema:** el ROIForm es un ICP-filter de 1 pregunta (LTV: <$1K / $1-10K / >$10K)
con submit **simulado** (setTimeout 1500ms, sin backend). "Request the audit" enlaza
a /contact. No hay diagnóstico real ni captura real.

**Objetivo:** la puerta al núcleo. Una **gamificación comprensible**: un diagnóstico
interactivo que (a) entrega valor al visitante (un mini-resultado), (b) califica al
ICP del núcleo, (c) captura de verdad (backend real → CRM). Absorbe el pendiente #7.

**Estructura nueva (propuesta):**
1. **Hero** — qué es el ROI Audit (oferta de entrada): 2 semanas, entregable, honestidad ("si no encontramos $X, no vendemos").
2. **El diagnóstico gamificado** — varias preguntas comprensibles (no solo LTV): p.ej. inversión en growth, infraestructura de datos, % trabajo manual, dependencia SaaS. Cada respuesta suma a un **score de fricción/oportunidad** visible.
3. **Resultado** — el visitante ve su score + lectura ("tu carga manual aún no alcanza la intensidad…" para los que no califican, en tono incómodo pero claro). Califica ICP.
4. **Captura** (si califica) — nombre, email, empresa + consentimiento. **Backend real** → CRM con `source=aglaya-form-*` (contrato capa 7). Reposición del ROIForm fake.
5. **Mensaje de no-fit** — para los que no califican: honesto, redirige (a Web, o "vuelve cuando…").

**⚠️ Decisión:** la mecánica exacta de la gamificación (qué preguntas, cómo se
puntúa, qué resultado se muestra) → §Huecos. Debe ser **comprensible** (la queja del
fundador sobre el funnel actual: críptico). Equilibrio: personalidad incómoda + claridad.

---

## 5. Proof (`/proof`, `/proof/{slug}`) — CADA CASO A SU PUERTA

**Problema menor:** los CTA de proof apuntan genéricamente a /contact.

**Objetivo:** cada caso empuja a SU puerta (capa 4): webs (DJ Amapola, Elm St.) →
/quote; Pulse/Outreach/Kanban → The Stack / ROI Audit; legal-reg-tech → (Scanner, sitio aparte).

**Acción extra:** actualizar el "$12" obsoleto del Scanner en el proof legal-reg-tech.

---

## Estado de decisiones

**Resuelto:**
- [x] **The Stack $8K/mes** → núcleo 100% "Hablemos" en público; $8K + condiciones a página oculta (noindex, no-nav), semilla de futura landing de conversión.

**Diferido (no bloquea el cierre de la capa):**
- [ ] **ROI Audit — mecánica de la gamificación** (qué preguntas, scoring, resultado) → **capa 6 (Formularios)**, donde toca el diseño fino. Enfoque ya fijado: diagnóstico comprensible con score + captura real.
- [ ] **Confirmar secciones que salen del home** (SystemsGrid → The Stack, HowItWorks → The Stack/ROI, AntiClient → condensar) → propuesta vigente; se materializa al ejecutar el home.

Capa 5 cerrada (specs definidas). Subo a capa 6 (Formularios).
