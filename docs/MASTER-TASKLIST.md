# MASTER TASKLIST — aglaya.biz

> Living document. Single source of truth for everything outstanding.
> Last updated: **2026-07-15**. Production HEAD: `6d71707`.
>
> **Owner legend:** 🤖 = AI/code (Claude) · 🧑 = founder (Ibai, manual) · 🔁 = relay to another thread (CRM / Scanner)
> **Priority:** P0 = blocking / revenue-or-legal risk · P1 = important, do next · P2 = backlog / nice-to-have
> **Status:** ☐ open · ◐ in progress · ☑ done (kept briefly for context, then pruned)

---

## A. Consent ledger & CRM (cross-producer)

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| A1 | CRM confirms it **accepts the flat consent fields** on `/leads/capture` (no 422). | P0 | 🔁 CRM | ☑ | **DONE 2026-06-15** — verified in prod: `elmstproductions@gmail.com` submit landed a deal + a consent-ledger entry in the CRM Registro (purpose=contacto, legal_basis=legitimate-interest, regime=cl-21719, source=aglaya-form-open-channel, evidence_hash `sha256:5967c…`). CRM persists flat fields. |
| A2 | Signature and spec status of the OTHER producers — who has acknowledged which version of the canonical, and whether the CRM spec documents the consent fields. | — | 🔁 | 🔎 | **Not a task; a question.** Ask `firmas()` and `contrato("crm-ingestion")` (MCP `aglaya-atlas`): they open each ship's ledger live and cite the line they read. Rows A2–A5 used to sit here as ☐ with routes into two other repos — a signature lives in the signer's ledger, and reading it is one question, not four checkboxes waiting on somebody else. |
| A6 | (If a web preference-center ever ships) emit **DSR fichas** from aglaya.biz. Today DSRs arrive via `dpo-email`/`mailerlite-unsubscribe`, handled CRM/Scanner-side. | P2 | 🤖 | ☐ | Not needed yet; documented in IMPLEMENTS.md. |

## B. Email capture & tracking

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| B1 | **MailerLite E2E in prod** — submit one lead per form × 3 langs, confirm the right group + auto-reply fires. Tracked in [`docs/qa/automations-validation.csv`](qa/automations-validation.csv). (was task #9) | P0 | 🧑 | ◐ | **`/contact` ×3 + CRM PASS (2026-06-15)** — Contacto group, language branch, acuse per lang, deal+ficha all verified. **Pending:** roi-audit funnel ×3, footer dispatch ×3, quote ×3. **Antes de dar por roto el código:** ninguna de esas tres puede pasar si la automation de su grupo está apagada en MailerLite. Comprueba el interruptor primero (`list_automations` / dashboard) — el lead entra igual, el correo no sale. |
| B2 | **UTM / fbclid / gclid / landing_source pipeline** — `contact.ts` currently sends nulls (`// not implemented yet; separate PR`). Capture from URL params client-side and forward. | P1 | 🤖 | ☐ | DoD: a lead arriving with `?utm_source=...` lands those values in the CRM. File: `netlify/functions/contact.ts:360`. |
| B3 | Verify the **language of confirmation emails** matches submission `lang` across all forms (regression check after swap). | P2 | 🧑 | ☐ | Part of B1 matrix. |

## C. Legal / compliance

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| C1 | **Second Ley 21.719 scan** post-deploy; compare score vs baseline. (was task #18) | P1 | 🧑 | ☐ | DoD: documented score delta; new findings (if any) triaged into this list. |
| C2 | Keep `PRIVACY_POLICY_VERSION` (`src/legal/policy-version.ts`) and the privacy pages' "Last updated" in lockstep on any future policy edit. | P2 | 🤖 | ☐ | Standing rule, not a one-off. |

## D. Content & proof

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| D1 | **Massiva Pulse proof — editorial review** (deferred by founder; page is live). | P1 | 🧑 | ☐ | DoD: copy reviewed/approved; remove "subiendo" caveat. |
| D2 | **Massiva testimonial** — `massiva.md:119` still `> — [Testimonial pending · Talía Toledo, Massiva Chile]`. Authorization obtained; waiting on the quote text. | P1 | 🧑 | ☐ | DoD: real testimonial pasted, placeholder removed. |

## E. Strategy / blueprint (capas restantes)

> Source: `docs/260611-strategy-review/` (v1.1). Capas 1–6 (positioning, value-prop, products, site-arch, pages, forms) substantially shipped. Remaining:

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| E1 | **Capa 07 — Automations**: validate + harden the lead→CRM→nurture flows end to end (overlaps B1/A1). | P1 | 🧑+🤖 | ☐ | DoD: every funnel path provably delivers email + persists in CRM. |
| E2 | **Capa 08 — Sales**: define the post-capture sales motion (who follows up qualified leads, SLA, script). Pairs with `aglaya-os:roi-audit` / `aglaya-os:proposal`. | P2 | 🧑 | ☐ | DoD: documented playbook. |
| E3 | **Hidden $8K/mo pricing** — kept out of public site by decision. Future: a gated conversion landing; public stays "100% Hablemos". | P2 | 🧑+🤖 | ☐ | DoD: decision on if/when to build the gated landing. |

## F. Ops / housekeeping

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| F1 | GitHub API DNS workaround still required on this machine (`curl --resolve api.github.com:443:140.82.116.6` + `gh auth token`). Fix local DNS or accept as-is. | P2 | 🧑 | ☐ | Cosmetic; `git push` over SSH works fine. |
| F2 | Prune completed items from this list periodically; keep it lean. | P2 | 🤖 | ☐ | Standing. |

## G. Growth backlog

> Injertado 2026-07-16 desde `docs/OUTREACH-STRATEGY.md` (retirado: sus 12 líneas estaban 2 completadas, 2 muertas y el resto sin hogar). Sin orden definitivo; cada una es ejecutable de forma independiente.

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| G1 | **Kanban Sandbox público** — instancia del Kanban Desk con datos demo, para que el visitante explore el producto real. URL provisional `kanban.aglaya.biz/sandbox`. Origen: repo `aglaya-kanban-desk`. | P2 | 🧑+🤖 | ☐ | DoD: sandbox público navegable con datos de demostración. |
| G2 | **Estrategia de redes sociales** — canales, formatos, frecuencia y voz (LinkedIn principal). Repurposing de casos/servicios ya existentes. | P2 | 🧑 | ☐ | DoD: calendario editorial + voz definida. |
| G3 | **AI chatbot de cualificación** — widget conectado a la API de Claude que hace las preguntas del contacto en modo conversacional y transfiere a humano cuando el lead madura. | P2 | 🤖 | ☐ | DoD: cualifica en tiempo real y escala a humano. |
| G4 | **Playbook descargable** — PDF 8-10 pág. "Cómo auditar tus operaciones para AI", gateado por email. Base de contenido ya existe en `/services` y `/roi-audit`. | P2 | 🧑 | ☐ | DoD: PDF + portada + CTA de descarga gateada. |
| G5 | **Video proof** — screen recording de ~90s del Kanban Desk en acción. Sin producción compleja. Para LinkedIn, proof y propuestas. | P2 | 🧑 | ☐ | DoD: vídeo publicado y enlazado. |
| G6 | **Propuestas automatizadas** — plantilla branded que se completa desde los datos del lead cualificado. Proceso brief → template → propuesta en <2h. | P2 | 🧑+🤖 | ☐ | DoD: plantilla operativa; propuesta en <2h. |
| G7 | **Sistema de referidos** — formalizar lo informal: qué se ofrece a quien refiere, cómo se rastrea, cómo se comunica. | P2 | 🧑 | ☐ | DoD: documento/página con la mecánica. |
| G8 | **Herramienta pública gratuita** — algo pequeño y útil como producto independiente (tráfico orgánico + autoridad + lead gen pasivo). | P2 | 🧑+🤖 | ☐ | DoD: herramienta pública en vivo. |
| G9 | **Diferidos de Fase 2** — un blog (`/blog/`) y una página `/about/`; ambos se aplazaron en el brief de construcción y siguen sin existir. Decidir si se hacen. | P2 | 🧑 | ☐ | DoD: decisión explícita (construir o descartar). |

---

## Top of mind (do-next order)

1. **B1** — MailerLite E2E (revenue risk: could be losing leads silently after the swap).
2. **A1 / A2** — CRM confirms + documents flat consent fields (legal-evidence risk).
3. **C1** — second Ley 21.719 scan.
4. **D1 / D2** — Massiva editorial + testimonial.
5. Then **B2** (UTM pipeline), **A3–A5** (re-sign + close contract), **E1/E2**.

## Recently shipped (context, prune after a week)

- **Pruned 2026-07-15** (older than a week): PR #80–#84 (consent ledger v1.1.0, contact↔ROI swap, docs).
- PR #86–#97 — ICP qualifier UX polish + plain-language copy on `/roi-audit`.
- PR #98/#99/#101 — ROI Diagnostic lead-magnet: research → built → **parked** (PR #99 open; see [`roi-diagnostic/PARKED.md`](roi-diagnostic/PARKED.md)).
- PR #100 — crm-consent shared cross-producer golden vector pinned.
