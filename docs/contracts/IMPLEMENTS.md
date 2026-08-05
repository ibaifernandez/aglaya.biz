# IMPLEMENTS — aglaya.biz (PRODUCER)

Per-repo implementation ledger for the lead-capture contract. The canonical
contract lives in this same repo at
[`lead-capture-contract.md`](./lead-capture-contract.md); aglaya.biz both **owns**
and **signs** it. This file mirrors the signature for cross-repo symmetry: every
signatory keeps a ledger of the same name in its own repo (`crm-aglaya`,
`legal-reg-tech`). Where inside those repos, and what each one currently
declares, is theirs to say — ask `firmas()` (MCP `aglaya-atlas`), which opens
each ledger live and cites the line it read.

## Signed version

**v1.1.0** — acknowledged 2026-06-13.

## What aglaya.biz implements

| Contract clause | Implementation |
|---|---|
| §2 legal basis | Forms run on **legitimate interest** (Art. 6(1)(f)) — NOT consent. Recorded verbatim in every ledger entry. |
| §3 accountability record | `privacy_policy_version` + `privacy_policy_displayed_at` sent top-level on every CRM-bound lead (`src/legal/policy-version.ts`, `netlify/functions/contact.ts`). |
| §3-bis consent ledger | `buildConsentFields()` in `netlify/functions/_crm.ts`. Emits the §3-bis table fields **flat** (top-level, `payload.update(consent)` parity with Scanner). `evidence_hash = sha256(email␟purpose␟legal_basis␟notice_version␟granted_at␟source)`, U+001F sep, `sha256:` prefix. `source` + `notice_version` are hash inputs only, not stored fields. Golden hash locked in `tests/unit/crm-consent.test.ts`. |
| §3-bis DSR ledger | Not yet emitted by aglaya.biz. Web has no rights-request intake of its own; DSRs arrive via `dpo-email` / `mailerlite-unsubscribe`, handled by the CRM/Scanner side. To be added if a web preference-center ships. |
| §4 source taxonomy | `aglaya-form-{qualified,borderline,open-channel}` (lead source). Consent producer-prefix `aglayabiz-{contact,roi-audit}` (hash source only). |
| §5 retention + erasure↔retention | Privacy pages (EN/ES/PT) carry "Proof of Consent & Erasure": erase the use, keep the minimized proof (Art. 17(3)(b)/(e) GDPR / Ley 21.719). |

## Emitted consent values (current)

`legal_basis=legitimate-interest` · `regime=cl-21719` · `channel=web-form` ·
`status=granted` · `purpose∈{contacto, roi-audit}` ·
`consent_contract_version=1.1.0` · `subject_national_id=null` (web doesn't
collect national IDs).

## Open / pending (cross-producer)

Register real debt here, and only debt that is **ours**. This ledger sits in the
canonical contract's own repo, so anything written in this section reads as
authoritative to every other ship.

**Do not record another ship's status here.** Whether the CRM and the Scanner
have acknowledged the version this file signs, and whether the CRM spec
documents the consent fields, are statements those repos make about themselves.
They change without anyone touching this file, and a stale answer here goes on
sounding current. Ask instead:

| Quieres saber | Pregunta |
|---|---|
| Qué versión del canónico declara cada firmante | `firmas()` |
| Qué documenta hoy la API técnica del CRM | `contrato("crm-ingestion")` |
| Estado del canónico entre naves | `contrato("lead-capture")` |
| Quién depende de lo que vas a tocar | `quien_consume` |

Learned the expensive way: this section once carried two entries — one about the
signature triangle, one about the CRM versioning the consent fields — written as
answers. Both were satisfied the same day this file signed, and both kept asking
for 37 days anyway, five lines above a changelog that contradicted them. A
signature lives in the signer's ledger; read it there, at the moment you need it.

## Changelog

- **2026-08-05** — Cross-producer section rewritten as questions, and guarded.
  It had regrown two verdicts about other ships' status and carried routes into
  their repos; both are now banned by `tests/unit/implements-ledger-asks.test.ts`
  and `tests/unit/no-foreign-routes.test.ts`, which run in CI. The sections where
  this repo speaks about itself — including this changelog — are exempt by name.
- **2026-07-20** — Open/pending section closed. Both items had been satisfied on
  2026-06-13; the section was stale for 37 days while the changelog five lines
  below already said "v1.1.0 signed" — a self-contradiction in the most
  authoritative of the three ledgers. Verified against both counterpart repos
  before closing.
- **2026-06-13** — v1.1.0 signed. Consent ledger emission (PR #80), flat-payload
  fix (PR #81), §3-bis conformity fix (channel=web-form, drop non-table fields).
- **2026-06-01** — v1.0.1 (DPO-alias patch).
- **2026-05-29** — v1.0.0 SMOKED.
