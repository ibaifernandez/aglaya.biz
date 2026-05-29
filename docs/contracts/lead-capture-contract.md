# AGLAYA Lead-Capture & Data-Protection Contract

- **Version:** 1.0.0
- **Status:** ACTIVE
- **Canonical home:** this file (`aglaya.biz/docs/contracts/lead-capture-contract.md`)
- **Last updated:** 2026-05-29

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

## 6. Data-subject rights

- Channel: `info@aglaya.biz` (ACTIVE). `dpo@aglaya.biz` is aspirational — a
  single-point swap once the alias exists.

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
| **aglaya.biz** | signed | v1.0.0 | web forms → `/leads/capture`; PR #64 (`0b63257`) |
| **CRM AGLAYA** | pending countersign | v1.0.0 | schema + `crm_deals` columns + tests (`c91b11a`); data-subject endpoints (`065988b`); legal docs (`f45e90a`) |
| Scanner 21.719 | not yet | — | — |

To countersign, the CRM thread confirms this file's content matches its
implementation and records the contract version + this file's commit SHA in
`crm-aglaya` (suggested: `docs/contracts/IMPLEMENTS.md`).
