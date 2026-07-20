# IMPLEMENTS — aglaya.biz (PRODUCER)

Per-repo implementation ledger for the lead-capture contract. The canonical
contract lives in this same repo at
[`lead-capture-contract.md`](./lead-capture-contract.md); aglaya.biz both **owns**
and **signs** it. This file mirrors the signature for cross-repo symmetry with
`crm-aglaya/docs/contracts/IMPLEMENTS.md` and
`legal-reg-tech/docs/contracts/IMPLEMENTS.md`.

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

None. Both former items were already closed on 2026-06-13 — the same day this
file signed v1.1.0 — but the section kept asking for them until 2026-07-20.
Verified and closed below.

### Closed 2026-06-13 (verified 2026-07-20)

- **CRM + Scanner re-acknowledge v1.1.0.** Both signed the same day:
  `crm-aglaya/docs/contracts/IMPLEMENTS.md` §"v1.1.0 — 2026-06-13
  (re-acknowledge: consent-ledger ficha + DSR)", status `ACKNOWLEDGED ✓`;
  `legal-reg-tech/docs/contracts/IMPLEMENTS.md` — "Version implemented: v1.1.0",
  "Acknowledged: 2026-06-13". The triangle has been closed since then.
- **CRM versions the consent fields in `crm-ingestion-api.md`.** Done in that
  spec's **v1.4.0** (2026-06-13): §10 "Ficha de consentimiento (consent-ledger)"
  documents the **flat** wire convention, all §3-bis fields, `evidence_hash`
  (canonical formula, U+001F sep, append-once dedup) and
  `consent_contract_version`. The spec is at **v1.7.2** today; §10.2 (2026-06-30)
  further pins `evidence_hash` as an opaque string. Nothing pending on our side.

Why this mattered: this ledger is the canonical contract's own repo, so a stale
"pending" here reads as authoritative to every other ship. Register real debt in
this section; do not leave closed items standing.

## Changelog

- **2026-07-20** — Open/pending section closed. Both items had been satisfied on
  2026-06-13; the section was stale for 37 days while the changelog five lines
  below already said "v1.1.0 signed" — a self-contradiction in the most
  authoritative of the three ledgers. Verified against both counterpart repos
  before closing.
- **2026-06-13** — v1.1.0 signed. Consent ledger emission (PR #80), flat-payload
  fix (PR #81), §3-bis conformity fix (channel=web-form, drop non-table fields).
- **2026-06-01** — v1.0.1 (DPO-alias patch).
- **2026-05-29** — v1.0.0 SMOKED.
