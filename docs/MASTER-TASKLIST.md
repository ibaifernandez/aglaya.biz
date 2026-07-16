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
| A2 | CRM **versions the consent fields** in `crm-ingestion-api.md` (undocumented as of v1.3.0). | P0 | 🔁 CRM | ☐ | DoD: spec lists `purpose, legal_basis, regime, channel, status, granted_at, evidence_hash, consent_contract_version, subject_national_id` + dedup-by-`evidence_hash` behaviour. |
| A3 | **Re-sign v1.1.0** in `crm-aglaya/docs/contracts/IMPLEMENTS.md`. | P1 | 🔁 CRM | ☐ | DoD: §10 of canonical can mark CRM `countersigned v1.1.0`. |
| A4 | **Re-sign v1.1.0** in `legal-reg-tech/docs/contracts/IMPLEMENTS.md`. | P1 | 🔁 Scanner | ☐ | DoD: §10 marks Scanner `signed v1.1.0`. |
| A5 | Once A1–A4 done, flip §10 of `lead-capture-contract.md` to "all three on v1.1.0" + add §11 verification-log entry. | P1 | 🤖 | ☐ | Depends: A1–A4. |
| A6 | (If a web preference-center ever ships) emit **DSR fichas** from aglaya.biz. Today DSRs arrive via `dpo-email`/`mailerlite-unsubscribe`, handled CRM/Scanner-side. | P2 | 🤖 | ☐ | Not needed yet; documented in IMPLEMENTS.md. |

## B. Email capture & tracking

| ID | Task | Pri | Owner | Status | Depends on / Definition of done |
|----|------|-----|-------|--------|-------------------------------|
| B1 | **MailerLite E2E in prod** — submit one lead per form × 3 langs, confirm the right group + auto-reply fires. Tracked in [`docs/qa/automations-validation.csv`](qa/automations-validation.csv). (was task #9) | P0 | 🧑 | ◐ | **`/contact` ×3 + CRM PASS (2026-06-15)** — Contacto group, language branch, acuse per lang, deal+ficha all verified. **Pending:** roi-audit funnel ×3, footer dispatch ×3, quote ×3. |
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
