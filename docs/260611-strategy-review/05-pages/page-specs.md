# Specs de Página AGLAYA — v1.1 (revisión fundador 2026-06-11)

> **Estado:** ✅ CERRADO · revisado. Spec de rediseño (no código) por página.
> Cada página cierra en su punto fuerte y empuja UNA acción. Trilingüe.
>
> **Cambios v1.1:** Proof deja de ser página → casos **dentro de The Stack** (sin ROI).
> **Services** reintroducida (servicios selectivos). Home 8→6. Copy Y UX humanizados.

---

## 1. Home (`/`) — ACORTAR

**Problema:** 8 secciones (Hero · Problem · SystemsGrid · HowItWorks · ProofGrid ·
AntiClient · Economics · ICP-Filter). Diluye el mensaje y entierra el CTA.

**Estructura nueva (6 bloques):**
1. **Hero** — posicionamiento: instalaciones soberanas / "la agencia que confronta". CTA primario → ROI Audit.
2. **Los 3 enemigos** — condensar Problem + AntiClient: la agencia-alquiler, el SaaS-parásito, el modelo de horas.
3. **El Stack (teaser)** — qué es, en 1 bloque. Link "ver The Stack".
4. **Economics** — el anclaje "coste de NO poseer" (condensado).
5. **Ejemplos vivos** — 2-3 sistemas reales funcionando (ex-Proof), citados como capacidad, **sin métricas de ROI**. Link a The Stack. *(No es "evidencia"; es "esto construimos, así funciona".)*
6. **CTA final** — una sola: ROI Audit.

**Sale del home:** SystemsGrid detallado (→ The Stack), HowItWorks (→ The Stack/ROI), el ICP-Filter (→ ROI Audit). El formulario del home pasa a ser **contacto simple**; el complejo se va al ROI Audit.

---

## 2. The Stack (`/the-stack`) — NÚCLEO + CASOS ABSORBIDOS

**Antes `/services`.** Es la página del producto-norte. **Absorbe el antiguo Proof.**

**Objetivo:** presentar el Stack y sus 5 sistemas, ilustrarlos con casos reales
(citando clientes, SIN ROI), cerrar en Productive Friction, empujar al ROI Audit.

**Estructura nueva:**
1. **Hero** — "NO VENDEMOS SERVICIOS / vendemos infraestructura" (el copy que te encanta). Propiedad doble: infra + sistema (capa 2).
2. **Filosofía** — Identify → Build → Own.
3. **Los 5 sistemas** (01-05), cada uno **ilustrado con un caso real funcionando** (Pulse→Massiva, Outreach→Bill Capital, Web→DJ Amapola/Elm St., etc.). Marco: *"esto construimos, corre en vivo, esto es lo posible para ti"* — **nunca** "+X% de resultados". Cierra en **05 Productive Friction**.
4. **✂️ CORTE.** Fuera "Investment / Two entry points" + "Work Conditions".
5. **CTA final** — "Empieza con la auditoría" → ROI Audit.

**Núcleo 100% "Hablemos".** Sin cifras públicas. El $8K/mes + condiciones → página
oculta (noindex, no-nav), semilla de futura landing de conversión.

**Sobre las rutas `/proof/{slug}`:** los casos detallados pueden sobrevivir como
sub-páginas de cada sistema, enlazadas desde The Stack — pero reencuadradas como
capacidad, no como evidencia de ROI. (Detalle de ejecución.)

---

## 3. Web (`/quote`) — RECONVERTIR EN LANDING

**Objetivo:** landing del peldaño 2. Vender "tu web, en repo, es tuya desde el día 1"
y capturar vía el cotizador (que YA funciona — no se toca la lógica).

**Estructura nueva:**
1. **Hero landing** full-width: el sitio que posees, con disciplina (tests, CI/CD, Lighthouse 100). Ejemplos: DJ Amapola + Elm St.
2. **Por qué AGLAYA Web** — diferenciales (no WordPress/Webflow alquilado; entrega en repo; performance; seguridad).
3. **Cotizador** — el actual, **aprovechando el ancho** (no columna estrecha). Lógica intacta.
4. **Always included** — SEO, GA4, responsive, WCAG, repo.
5. **CTA / captura** — el form del cotizador (ya real).

---

## 4. ROI Audit (`/roi-audit`) — GAMIFICACIÓN-DIAGNÓSTICO

**Objetivo:** la puerta al núcleo. Diagnóstico interactivo que (a) entrega valor,
(b) califica al ICP, (c) captura de verdad (backend real → CRM). Absorbe #7.

**Estructura nueva:**
1. **Hero** — qué es el ROI Audit real (oferta de pago): 2 semanas, business case, honestidad ("si no encontramos $X, no vendemos").
2. **Diagnóstico gamificado** — el ICPFilter de 3 ejes (% manual, infra de datos, inversión growth), copy y UX humanizados, score visible.
3. **Resultado** — score + lectura. Califica ICP.
4. **Captura** (si califica) — backend real → CRM `source=aglaya-form-*`.
5. **No-fit** — mensaje honesto, redirige.

Mecánica fina → capa 6.

---

## 5. Services (`/services`) — SERVICIOS SELECTIVOS  *(NUEVA en v1.1)*

**Qué es:** la página de servicios de marketing puntuales — pero **con filtro de
privilegio**, no catálogo de horas.

**Encuadre (clave, para no diluir la marca):** *"No vendemos servicios… salvo si nos
caes bien y nos gusta tu proyecto."* No es "contrátanos"; es "puede que te dejemos
contratarnos". El filtro ES el mensaje — refuerza la categoría "agencia incómoda"
(te elegimos nosotros, no al revés). **Riesgo a evitar:** que se lea como agencia al
uso (lista de servicios estándar). Si huele a catálogo, diluye todo el posicionamiento.

**Estructura propuesta:**
1. **Hero** — el filtro como gancho ("solo si nos gusta tu proyecto").
2. **Qué hacemos** — los servicios, encuadrados como excepción selectiva, no como menú.
3. **CTA** — Contact / ROI Audit según encaje.

---

## 6. Contact (`/contact`) — SIMPLE

Formulario normal y corriente: nombre · email · mensaje · consentimiento. El "juego"
se muda al ROI Audit. Sin fricción.

---

## Estado de decisiones (v1.1)

- [x] **Proof eliminado como página** → casos absorbidos en The Stack, citando clientes **sin ROI**.
- [x] **Services reintroducida** como página de servicios selectivos.
- [x] **The Stack** = núcleo + casos (ilustración de capacidad, no evidencia). URL propuesta `/the-stack`.
- [x] Núcleo "Hablemos"; $8K oculto (semilla landing).
- [x] Home 8→6; formulario del home = contacto simple.

**Diferido a ejecución:** mecánica fina del ROI Audit (capa 6); destino de las rutas
`/proof/{slug}`; URL final de The Stack vs Services.
