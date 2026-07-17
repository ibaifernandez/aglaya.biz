# AGLAYA Lead-Capture & Data-Protection Contract

- **Version:** 1.1.0
- **Status:** ACTIVE — SMOKED ✓ (lead-capture verified 2026-05-29; consent-ledger E2E pending first aglaya.biz ficha; see §11)
- **Canonical home:** this file (`aglaya.biz/docs/contracts/lead-capture-contract.md`)
- **Last updated:** 2026-06-13

This is the single source of truth governing how any AGLAYA product captures
leads and consent/accountability evidence into CRM AGLAYA, and the
data-protection model that backs it. It is product-agnostic: aglaya.biz is the
first signatory; Scanner 21.719 and future products implement the same contract.

> **Sync rule.** This file is the canonical copy. Each signatory product records,
> in its own repo, the **version + commit SHA** of the contract it implements
> (see §10). When this file changes, bump the version (§8) and notify every
> signatory thread so they re-acknowledge against the new SHA. Two products are
> "in sync" when their acknowledgements point at the same version.

---

## 1. Parties

- **Producers** (emit leads): aglaya.biz; Scanner 21.719; future AGLAYA products.
- **Consumer** (ingests leads): CRM AGLAYA, endpoint `POST /leads/capture`.

## 2. Legal basis

- **Inbound request forms** (contact / ROI audit / quote / scan request, etc.)
  → **legitimate interest** (GDPR Art. 6(1)(f); LGPD Art. 10; Ley 21.719). The
  privacy checkbox is a **required acknowledgement of notice**, worded
  "I have read / tomo conocimiento" — **never** "I accept / consent". A required
  checkbox cannot be valid consent (EDPB Guidelines 05/2020 + GDPR Art. 7(4)).
- **Newsletter / marketing opt-in** (e.g. Dispatch) → **consent**
  (GDPR Art. 6(1)(a); LGPD Art. 7-I). Opt-in is genuinely optional.

## 3. Accountability record (GDPR Art. 5(2)) — every submission

| Field | Type | Origin |
|---|---|---|
| `privacy_policy_version` | string, ISO date (`"2026-05-25"`) | Single source of truth per product, bound to the "last updated" date shown on that product's privacy notice. |
| `privacy_policy_displayed_at` | string, ISO-8601 UTC | Sealed server-side by the producer when the submission is accepted. |

- **Durable home:** the lead's row in CRM AGLAYA.
- The producer SHOULD also emit an interim structured log line at submission.
- This evidences *which notice was shown*, not consent (the basis is legitimate
  interest for these forms).

## 3-bis. Consent & DSR ledger (v1.1.0)

Beyond §3, producers emit an immutable **consent-ledger entry** on every "yes"
and a **DSR entry** on every rights request / revocation. Append-once; the CRM
dedups by `evidence_hash`. Egress is **non-blocking** (best-effort; never bounces
the visitor — for Node producers via the same `Promise.allSettled` path as the
CRM lead dispatch; for the Scanner via RQ, per its 2026-06-10 postmortem).
Technical source of truth: `legal-reg-tech/backend/app/services/consent_ledger.py`.

**Consent record** (`build_consent_fields`):

| Field | Type / values |
|---|---|
| `purpose` | what the basis is for (e.g. `contacto`, `roi-audit`, `newsletter`) |
| `legal_basis` | GDPR Art. 6 vocab: `consent` · `contract` · `legitimate-interest` · `legal-obligation` · `vital-interest` · `public-task` |
| `regime` | `cl-21719` (Chile, active) · `eu-gdpr` (EU/Spain) |
| `channel` | `web-form` · `double-opt-in` · `import` · `api` |
| `status` | `granted` (immutable on creation) |
| `granted_at` | ISO-8601 UTC, server-sealed (same instant as notice display) |
| `evidence_hash` | `sha256:<64hex>` over `email␟purpose␟legal_basis␟notice_version␟granted_at␟source` (U+001F separator) — deterministic; dedup key |
| `consent_contract_version` | `"1.1.0"` |
| `subject_national_id` | optional `{value, type: rut\|dni\|nif\|passport, country: ISO-3166}` |

`source` uses the producer prefix `aglayabiz-<form>` (Scanner: `scanner21719-*`).

**DSR record** (`build_dsr_fields`):

| Field | Type / values |
|---|---|
| `entry_kind` | `"dsr"` |
| `request_type` | `access` · `rectification` · `erasure` · `objection` · `withdraw-consent` · `portability` · `restriction` |
| `status` | `received` (CRM → in-progress \| resolved \| rejected) |
| `requested_at` | ISO-8601 UTC |
| `legal_deadline` | optional, profile-specific |
| `relates_to` | optional, target consent id |
| `source` | `mailerlite-unsubscribe` · `dpo-email` · `preference-center` · `panel-operator` |
| `regime`, `evidence_hash`, `subject_national_id` | as above |

## 4. API contract — `POST /leads/capture`

- **Auth:** header `X-CRM-API-Key`.
- **Body** (all fields except `email` nullable):

  ```
  email (required), name, company, phone, title, source, notes,
  lead_score (0..100 | null), language ('en'|'es'|'pt' | null),
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  fbclid, landing_source,
  privacy_policy_version, privacy_policy_displayed_at
  ```

- **`source`** taxonomy: `<product>-<channel>-<segment>`
  (e.g. `aglaya-form-qualified`, `aglaya-website-form`, future
  `scanner21719-form-*`).
- **Response:** `201` with `{ contact_id, deal_id, lead_score, language, excluded }`.
- **Behaviours:**
  - `excluded: true` (+ `deal_id: null`) = intentional server-side drop
    (blocklist / gmail plus-alias normalization). The producer must treat this
    as success, not error.
  - `2xx + excluded:false + deal_id:null` = contract anomaly → capture.
  - `4xx` = malformed producer payload → capture. `5xx`/network = CRM down →
    capture. Dispatch is best-effort and must never bounce the visitor.

## 5. Retention — unified public-facing wording

> Lead and contact records are retained while the commercial relationship is
> active or for up to 24 months from the last documented interaction (whichever
> comes first); formalized contracts (won clients) are preserved for 7 years in
> line with Chilean commercial and tax record-keeping law. Data is deleted
> within 30 days of a verified deletion request.

Internal retention granularity (open / won / lost / backups) may be finer but
must never exceed the public ceiling above.

**Erasure ↔ retention (v1.1.0; GDPR Art. 17(3)(b)/(e); Ley 21.719).** On an erasure
request: (1) the DSR is recorded as a new ledger entry (§3-bis); (2) the actual
*use* of the data (newsletter, account, marketing) is erased; (3) the *minimized
proof* — that the subject consented to a purpose on a date and, where applicable,
withdrew it later — is retained for the applicable limitation period, as a legal
obligation and defence of claims. **Erase the use, keep the proof.** Each producer's
privacy notice must state this (aglaya.biz: section "Proof of Consent & Erasure" in
`/privacy/`, all three languages).

## 6. Data-subject rights

- Channel: `dpo@aglaya.biz` (ACTIVE — alias created 2026-06-01, routes to `info@aglaya.biz`).
  Privacy pages (EN/ES/PT) updated to reflect this address for DPO contact,
  rights exercise, and transfer-safeguard requests.

## 7. Operational gotchas (binding)

- **Secrets scanning.** `SENTRY_ORG` / `SENTRY_PROJECT` are Sentry **slugs, not
  secrets**, but the project slug (`aglaya-biz`) equals a brand string that
  recurs in code. Netlify secrets scanning fails the build when a secret value
  appears in source/output. Mitigation: omit these keys from the scan
  (`SECRETS_SCAN_OMIT_KEYS`) and never embed an env-var value in a source
  literal.
- **Sentry source-map upload** errors non-fatally ("Project not found", a
  separate slug misconfig); it does NOT fail builds.

## 8. Versioning

- SemVer for this contract.
- **Patch:** wording/clarification. **Minor:** additive (new optional field,
  new source prefix). **Major:** breaking (field removed/retyped, behaviour
  change) → every signatory must re-acknowledge before adopting.

## 9. Extending to a new product

A new producer (e.g. Scanner 21.719):
1. Implements §2 (legal basis) and §3 (accountability record).
2. Registers a `source` prefix under §4 (`<product>-<channel>-<segment>`).
3. Points its accountability record at its own `privacy_policy_version` source.
4. Signs §10. No legal renegotiation — the model is inherited.

## 10. Signatories

| Party | Status | Implements | Reference |
|---|---|---|---|
| **aglaya.biz** | signed | v1.1.0 | web forms → `/leads/capture`; DPO-alias patch (`b360b5d`); **v1.1.0**: consent-ledger emission (P2) + privacy clause (P5b) + this contract (P5a); signature ledger in [`IMPLEMENTS.md`](./IMPLEMENTS.md) |
| **CRM AGLAYA** | countersigned | v1.1.0 (consumer) | ledger + DSR + PDF export live in prod; accepts optional consent fields (backward-compatible, dedup by `evidence_hash`); formal v1.1.0 re-ack in `crm-aglaya/docs/contracts/IMPLEMENTS.md` **pending** |
| **Scanner 21.719** | signed | v1.1.0 | orchestrator of this rollout; emits ficha at 4 points + unsubscribe webhook, E2E in prod; `build_consent_fields`/`build_dsr_fields` are the technical source of truth |

Producers run **different legal bases by design** (§2 + §9): aglaya.biz forms on
legitimate interest, Scanner 21.719 on consent under Ley 21.719 — the ledger records
the actual `legal_basis` per entry. Each forwards its own `privacy_policy_version`;
the CRM persists it verbatim. DPO channel `dpo@aglaya.biz` is shared.

> **v1.1.0 re-sign status (updated 2026-07-17, verified by the AGLAYA captain):**
> Scanner 21.719 **recorded v1.1.0** in its `IMPLEMENTS.md` on 2026-06-13 (its §10 row
> above reads `signed | v1.1.0` — closed). aglaya.biz signed on merge of the
> consent-ledger PR. **Only live pending:** CRM's formal v1.1.0 re-ack in
> `crm-aglaya/docs/contracts/IMPLEMENTS.md` (its row reads `countersigned` meanwhile).

## 11. Verification log

- **v1.0.0 — SMOKED ✓ (2026-05-29).** End-to-end round-trip via the
  open-channel funnel on prod aglaya.biz. The Astro server sealed
  `privacy_policy_displayed_at=2026-05-29T20:13:11.899Z` and forwarded
  `privacy_policy_version=2026-05-25` in the `/leads/capture` payload; CRM
  AGLAYA persisted both verbatim on deal #59 / contact #30, and
  `POST /contacts/export` echoed them. Backward compatibility confirmed: a
  pre-existing scanner-sourced deal on the same contact retains NULL on both
  fields (scanner / cal.com / operator-manual paths unaffected). CRM status
  commit `421acc2`.
- **v1.0.1 — RE-SMOKED ✓ (2026-06-11), post CRM independence.** After the CRM
  became a standalone multi-producer service, the round-trip was re-verified
  against the unchanged railway-direct endpoint
  (`crm-aglaya-production.up.railway.app/.../leads/capture`). Open-channel funnel
  submission (`source=aglaya-form-open-channel`, email `mon@aglaya.biz`): the
  Astro server sealed `privacy_policy_displayed_at=2026-06-11T02:37:13Z` and
  forwarded `privacy_policy_version=2026-05-25`, `language=en`; the CRM persisted
  all fields verbatim on the test deal (since deleted). Producer side green:
  function returned 200, zero `crm_outcome:failed|rejected|anomaly` in Sentry.
  Confirms the integration survives the CRM independence with no producer change.
