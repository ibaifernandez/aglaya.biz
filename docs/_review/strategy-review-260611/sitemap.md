# Arquitectura del Sitio aglaya.biz — v1.1 (revisión fundador 2026-06-11)

> **Estado:** ✅ CERRADO · revisado por el fundador. Vehicula la escalera de capa 3.
> Trilingüe (EN `/`, ES `/es/`, PT `/pt/`) en toda página.
>
> **Cambios v1.1:** Proof desaparece como sección → sus casos se **absorben en The
> Stack** (citando clientes, SIN ROI). **Services** vuelve como página propia
> (servicios selectivos). Nav: `Home · The Stack · Web · ROI Audit · Services · Contact`.

---

## A. Principio: una puerta por intención, no por peldaño

El visitante no piensa en "peldaños". Piensa en su dolor. La nav traduce dolor → puerta:

| Dolor del visitante | Puerta |
|---|---|
| "Estoy harto de alquilar mi infraestructura" | **The Stack** (núcleo) |
| "Quiero una web que sea mía" | **Web** |
| "Necesito servicios de marketing" | **Services** ("te los prestamos, solo si nos gusta tu proyecto") |
| "Necesito cumplir la Ley 21.719 (Chile)" | Plan de Adecuación (en el sitio del Scanner) |

> **Proof ya no es una puerta.** La prueba de capacidad vive **dentro de The Stack**:
> los casos reales (Massiva, Bill Capital, DJ Amapola, Elm St.) se citan como
> ilustración de lo que construimos — nunca como métricas de ROI. *"Construimos
> herramientas, no garantizamos resultados"* (capa 2).

## B. Jerarquía propuesta

```
Home (/)                          ← acortada: posicionamiento + 3 enemigos + Stack + 1 CTA
├── The Stack (/the-stack)        ← núcleo: los 5 sistemas + casos como ilustración (sin ROI); cierra en Productive Friction; CTA → ROI Audit
├── Web (/quote)                  ← landing del cotizador (peldaño 2)
├── ROI Audit (/roi-audit)        ← gamificación-diagnóstico + captura propia (entrada al núcleo)
├── Services (/services)          ← servicios de marketing SELECTIVOS ("solo si nos gusta tu proyecto")
├── Contact (/contact)            ← form SIMPLE y directo (capa 6)
└── Legal (/privacy · /cookies · /legal-notice)

# Plan de Adecuación $230 + Scanner: NO viven en aglaya.biz → en auditoria-ley21719.cl.
# /proof y /proof/{slug}: se replantean — los casos viven dentro de The Stack. Ver capa 5.
```

> **⚠️ Decisión de URL (a confirmar en ejecución):** "The Stack" hereda el rol de
> la antigua `/services`; como Services vuelve a existir, propongo **The Stack →
> `/the-stack`** y **Services → `/services`**. (Alternativa: The Stack se queda en
> `/services` y Services va a otra URL.) Trivial; se cierra al construir.

## C. Nav (6 items)

- **Header:** `Home` · `The Stack` · `Web` · `ROI Audit` · `Services` · `Contact`.
  - Si en algún momento aprieta (límite sano de 7), **ROI Audit** y **Contact** son candidatos a pasar a CTA/botón en vez de item de menú.
  - "Request Proposal" → apunta al **ROI Audit** (no a contact).
- **Footer:** Producto (The Stack, Web) · Servicios (Services) · Compliance (Scanner, enlace externo) · Legal · Contacto.

## D. URL map

| Página | URL | Nav | Prioridad | Cambio v1.1 |
|---|---|---|---|---|
| Home | `/` | Header (logo) | Alta | Acortar |
| The Stack | `/the-stack` | Header | Alta | Núcleo + casos absorbidos (sin ROI); cortar tras Productive Friction |
| Web (landing) | `/quote` | Header | Alta | Reconvertir a landing |
| ROI Audit | `/roi-audit` | Header / CTA | Alta | Gamificación-diagnóstico + captura propia |
| Services | `/services` | Header | Media | **Reintroducida**: servicios selectivos |
| Contact | `/contact` | Header / Footer | Media | Simplificar (capa 6) |
| Legal | `/privacy` `/cookies` `/legal-notice` | Footer | Baja | — |

## E. Decisiones — RESUELTAS

- [x] **Proof eliminado como sección/nav.** Casos → dentro de The Stack, citando clientes sin ROI.
- [x] **Services reintroducida** como página propia: servicios de marketing selectivos ("solo si nos gusta tu proyecto") — encuadre de privilegio/filtro, no catálogo de horas (refuerza la marca incómoda).
- [x] **Nav v1.1:** Home · The Stack · Web · ROI Audit · Services · Contact.
- [x] Plan de Adecuación $230 + Scanner → fuera de aglaya.biz (auditoria-ley21719.cl).
- [x] ROI Audit = gamificación con captura propia (absorbe #7). Contact simple. "Request Proposal" → ROI Audit.

> **Acción de limpieza:** `infografia-ley-21719-{horizontal,vertical}.png` pertenecen
> al repo del Scanner, no a aglaya.biz.

→ Capa 4 (revisada). Ver capa 5 (Páginas).
