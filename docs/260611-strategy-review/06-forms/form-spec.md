# Specs de Formularios AGLAYA — v1.0 (CERRADO 2026-06-11)

> **Estado:** ✅ CERRADO. Contacto simple (ya lo es) + diagnóstico gamificado en el
> ROI Audit = el ICPFilter existente, movido, humanizado y con backend real.
> Tono: "confrontar sin confundir". El ROIForm/LTV fake se jubila.

---

## A. Hallazgo: el "juego" ya existe (mal ubicado y críptico)

Hoy hay **dos** filtros que se pisan:

1. **ICPFilter** (en el HOME) — el buen juego: 3 ejes (% trabajo manual, infraestructura
   de datos, inversión en growth) → score ponderado → 3 ramas (qualified / borderline /
   blocked). Mecánica sólida. **Problemas:** copy **y UX** crípticos + está en el home
   (debe ir al ROI Audit, capa 4). El backend sí es real (dispatcha al CRM vía contact.ts).
2. **ROIForm** (en /roi-audit) — un filtro pobre de **1 pregunta** (LTV) con submit
   **falso** (setTimeout). Redundante e inferior al ICPFilter.

**Decisión de diseño:** **fusionar** — el ICPFilter ES la gamificación-diagnóstico;
se **mueve al ROI Audit**, se le **traduce el copy a humano**, y el **ROIForm/LTV se
jubila**. El contacto se queda simple. Así se cumple la visión del fundador (capa 4:
"contacto simple + ROI Audit gamificado comprensible") sin construir nada nuevo: se
reordena y se reescribe lo que ya hay.

---

## B. Contacto (`/contact`) — ya es simple, mantener

`ContactForm` ya es mínimo y correcto: **nombre · email · mensaje · consentimiento**.
La confusión que reportó el fundador venía del **ICPFilter en el home**, no de este
form. Acción: mantener; asegurar labels claros y jerarquía visual (ux-heuristics).

---

## C. ROI Audit — diagnóstico gamificado (el ICPFilter, reubicado y humanizado)

**Mecánica (ya existe, se conserva):**
- **3 ejes** (preguntas comprensibles, ver traducción §D):
  1. % de trabajo semanal aún manual (slider 0-100).
  2. Infraestructura de datos (nada / hojas / CRM / data lake).
  3. Inversión mensual en growth (rangos).
- **Score visible** como **"medidor de señal"** (no número crudo): el visitante VE
  subir su señal de oportunidad conforme responde. Eso es la capa de juego.
- **3 resultados** (con copy humano, §D): califica → captura; borderline → captura
  con matiz; no-fit → mensaje honesto + redirige (a Web, o "vuelve cuando…").

**Backend real (mata el fake):** la captura usa el flujo real de `contact.ts` →
CRM con `source=aglaya-form-{qualified,borderline,open-channel}` + campos GDPR
(contrato, capa 7). **Reposición del ROIForm setTimeout. Absorbe el pendiente #7.**

**Capa de juego (form-cro):** medidor de señal animado, feedback incremental al
completar cada eje, % de progreso, cambio de tono según probabilidad. Sin perder
claridad — la queja fue "no se entiende qué se espera".

---

## D. Traducción de copy: críptico → humano (lo que pidió el fundador)

| Hoy (críptico) | Propuesta (humano, sin perder filo) |
|---|---|
| "Manual entropy carries a massive cost" | "El trabajo manual te está costando dinero cada semana" |
| "Data stream too thin" | "Todavía no tienes datos suficientes para que esto funcione" |
| "Architectural overkill risk / bottleneck intensity" | "Tu operación aún no tiene suficiente cuello de botella para que te demos ventaja" |
| "Insufficient investment mass" | "Tu presupuesto está por debajo de lo que el sistema necesita para rentar" |
| "No durable signal layer exists" | "No tienes una base de datos real (solo hojas de cálculo o nada)" |
| "Strategic scale signal" (rango inversión) | "Listo para desplegar a escala" |

**Principio:** el filo "incómodo" se mantiene en la TESIS (te decimos la verdad
aunque duela), no en la JERGA. Confrontar ≠ confundir.

---

## E. Estado de decisiones

**Resuelto:**
- [x] **Fusión validada:** ICPFilter (3 ejes + score) se mueve al ROI Audit, humanizado; el ROIForm/LTV se jubila; backend real (absorbe #7). Contacto se queda simple.
- [x] **Tono del copy: "confrontar sin confundir"** — filo en la tesis, claridad en las palabras, cero jerga. La tabla §D es la guía de traducción.

**Diferido a ejecución (no bloquea):**
- [ ] **Estética del medidor de señal** (barra animada vs consola legible) → se decide al construir el componente.

Capa 6 cerrada. Subo a capa 7 (Automatizaciones).
