# Arquitectura del Sitio aglaya.biz — v1.0 (CERRADO 2026-06-11)

> **Estado:** ✅ CERRADO. Reestructura el sitio para que vehicule la escalera de
> capa 3. Trilingüe (EN `/`, ES `/es/`, PT `/pt/`) en toda página.
>
> **Nav nueva:** `Proof · The Stack · Web · [ROI Audit →]`. Línea Chile (Plan $230 +
> Scanner) fuera de aglaya.biz. ROI Audit = gamificación-diagnóstico; Contact simple.

---

## A. Problema de la arquitectura actual

La nav actual (Proof · Services · ROI Audit · Get a Quote) **mezcla peldaños** sin
jerarquía: "Get a Quote" (web, peldaño 2) y "ROI Audit" (entrada al núcleo, peldaño 3)
cuelgan al mismo nivel → el visitante no sabe cuál es su camino. Además:
- Home demasiado larga (diluye el mensaje, entierra el CTA).
- Services no cierra en su punto fuerte ("Productive friction").
- `/quote` es una página larga, no una landing.
- `/roi-audit` no tiene form real; "Request Proposal" desvía a `/contact`.

## B. Principio: una puerta por intención, no por peldaño

El visitante no piensa en "peldaños". Piensa en su dolor. La nav traduce dolor → puerta:

| Dolor del visitante | Puerta | Peldaño |
|---|---|---|
| "Estoy harto de alquilar mi infraestructura" | El Stack (núcleo) | 3 |
| "Quiero una web que sea mía" | Web / Quote | 2 |
| "Necesito cumplir la Ley 21.719 (Chile)" | Plan de Adecuación | 0-1 |
| "Demuéstramelo" | Proof | transversal |

## C. Jerarquía propuesta

```
Home (/)                          ← acortada: posicionamiento + 3 enemigos + Stack + proof + 1 CTA
├── The Stack (/services)         ← núcleo; cortar tras "Productive Friction"; CTA → ROI Audit
├── Proof (/proof)                ← casos
│   └── [caso] (/proof/{slug})    ← cada uno enlaza a su producto/puerta
├── Web (/quote)                  ← RECONVERTIR en landing (peldaño 2); destino desde proof de webs
├── ROI Audit (/roi-audit)        ← gamificación-diagnóstico comprensible + captura propia (entrada al núcleo)
├── Contact (/contact)            ← form SIMPLE y directo (ver capa 6)
└── Legal (/privacy · /cookies · /legal-notice)

# Plan de Adecuación $230 + Scanner: NO viven en aglaya.biz → en auditoria-ley21719.cl.
```

## D. Nav propuesta (4 + CTA)

- **Header:** `Proof` · `The Stack` · `Web` · **[CTA] ROI Audit →**
  - "Services" → renombrar **"The Stack"** (lo que vendes, no "servicios" — coherente con "NO VENDEMOS SERVICIOS").
  - "Get a Quote" → **"Web"** (puerta del peldaño 2).
  - CTA rightmost = ROI Audit (entrada al núcleo, el alto ticket).
  - WhatsApp + Request Proposal: revisar — "Request Proposal" hoy va a contact; debe ir a ROI Audit o a la captura correcta.
- **Footer:** Producto (The Stack, Web, Proof) · Compliance (Plan de Adecuación, Scanner) · Legal (Privacy, Cookies, Aviso) · Contacto.

## E. URL map

| Página | URL | Nav | Prioridad | Cambio |
|---|---|---|---|---|
| Home | `/` | Header (logo) | Alta | Acortar |
| The Stack | `/services` | Header | Alta | Cortar tras Productive Friction; renombrar |
| Proof index | `/proof` | Header | Alta | — |
| Caso | `/proof/{slug}` | — | Media | Cada uno enlaza a su puerta |
| Web (landing) | `/quote` | Header | Alta | Reconvertir a landing |
| ROI Audit | `/roi-audit` | Header CTA | Alta | Gamificación-diagnóstico + captura propia |
| Contact | `/contact` | Footer / CTAs | Media | Simplificar (capa 6) |
| Legal | `/privacy` `/cookies` `/legal-notice` | Footer | Baja | — |

## F. Decisiones — RESUELTAS (2026-06-11)

- [x] **Plan de Adecuación $230 + Scanner → viven en `auditoria-ley21719.cl`, NO en aglaya.biz.** aglaya.biz se simplifica: sin landing del Plan. La ruta Chile ocurre en el sitio del Scanner.
- [x] **ROI Audit = gamificación-diagnóstico comprensible** con captura propia (no desvía a contact). Es la entrada al núcleo. Absorbe el pendiente técnico #7 (ROIForm). Diseño concreto → capa 5/6.
- [x] **Contact = simple y directo.** El "juego de los especiales" se muda al ROI Audit, donde aporta (diagnóstico que da valor + califica).
- [x] **"Request Proposal"** → apunta al ROI Audit (no a contact).
- [x] Nav renombrada: Services→**The Stack**, Quote→**Web**.

> **Acción de limpieza:** `src/assets/images/infografia-ley-21719-{horizontal,vertical}.png`
> pertenecen al sitio del Scanner, no a aglaya.biz → mover al repo del Scanner o
> retirar de aglaya.biz (no commitear aquí).

→ Capa 4 cerrada. Subo a capa 5 (Páginas).
