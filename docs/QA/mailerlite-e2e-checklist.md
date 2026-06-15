# MailerLite E2E — production validation checklist (B1)

> Purpose: prove that every form, in every language, lands the lead in the
> correct MailerLite group AND triggers its automation (auto-reply / Email 0).
> Highest-priority QA after the contact↔ROI swap (PR #83) — we could be losing
> leads silently otherwise.
>
> Created 2026-06-15. Prod HEAD: `5479049`.

## Pre-flight — already verified ✅

- All prod env vars SET (`netlify env:get … --context production`).
- Group IDs map to the right groups:

| Env var | ID | Group name |
|---|---|---|
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | `122059327481579422` | `[AGLAYA.biz] Suscripciones` |
| `MAILERLITE_NO_CUALIFICADOS_GROUP_ID` | `184811629055051480` | `[AGLAYA.biz] No cualificados` |
| `MAILERLITE_CUALIFICADOS_GROUP_ID` | `184811572071237368` | `[AGLAYA.biz] Cualificados` |
| `MAILERLITE_BORDERLINE_GROUP_ID` | `184811588007494791` | `[AGLAYA.biz] Borderline` |
| `MAILERLITE_COTIZACIONES_GROUP_ID` | `186446693070276318` | `[AGLAYA.biz] Cotizaciones` |
| `MAILERLITE_CONTACTO_GROUP_ID` | `190336414601184801` | `[AGLAYA.biz] Contacto` |

## Expected routing (from code)

| Form | What to do in the funnel | Expected group | Sequence |
|---|---|---|---|
| `/contact` (simple) | just submit | **Contacto** (`MAILERLITE_CONTACTO_GROUP_ID`) | auto-reply |
| `/roi-audit` → **qualified** | manual 80, data=CRM, investment $15K–40K | Cualificados | auto-reply |
| `/roi-audit` → **borderline** | manual 55, data=spreadsheet, investment $5K–15K | Borderline | auto-reply |
| `/roi-audit` → **blocked/open** | manual 20, data=none, investment <$5K | No cualificados | auto-reply |
| footer **dispatch** | enter email, subscribe | Suscripciones | Email 0 |
| `/quote` | complete the calculator + submit | Cotizaciones | auto-reply |

## Critical caveats (read before testing)

1. **`resubscribe: false`.** If the test email already exists in MailerLite, the
   automation will NOT re-fire and the group may not change. **Use a fresh,
   unique email per cell.** Gmail plus-aliases work and all land in one inbox:
   `youraddress+ml-<form>-<lang>@gmail.com` (e.g. `…+ml-contact-en@gmail.com`).
2. **CRM excludes gmail plus-aliases** (normalization). So for the CRM half of
   the check (contact / roi-audit), a gmail plus-alias will return
   `201 excluded:true` with no deal — that's expected, NOT a bug. To also verify
   CRM landing, use one non-plus / non-gmail address.
3. **hCaptcha** must be solved in the browser — this is why the test is manual
   (scripted POSTs get 422). Submit through the real UI.
4. Confirmation-email **language** must match the page language (`lang`).

## Test matrix — fill in as you go

Legend: ☐ todo · ✅ pass · ❌ fail (note what happened)

| # | Form | Lang | Test email | Fn 200? | Right group? | Auto-reply? | Lang OK? | CRM? |
|---|------|------|-----------|---------|--------------|-------------|----------|------|
| 1 | /contact | EN | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2 | /contact | ES | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3 | /contact | PT | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4 | /roi-audit qualified | EN | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 5 | /roi-audit qualified | ES | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6 | /roi-audit qualified | PT | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7 | /roi-audit borderline | EN | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 8 | /roi-audit borderline | ES | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 9 | /roi-audit borderline | PT | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 10 | /roi-audit blocked | EN | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 11 | /roi-audit blocked | ES | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 12 | /roi-audit blocked | PT | | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13 | footer dispatch | EN | | ☐ | ☐ | ☐ | n/a | n/a |
| 14 | footer dispatch | ES | | ☐ | ☐ | ☐ | n/a | n/a |
| 15 | footer dispatch | PT | | ☐ | ☐ | ☐ | n/a | n/a |
| 16 | /quote | EN | | ☐ | ☐ | ☐ | ☐ | n/a |
| 17 | /quote | ES | | ☐ | ☐ | ☐ | ☐ | n/a |
| 18 | /quote | PT | | ☐ | ☐ | ☐ | ☐ | n/a |

**Minimum viable pass (do these first):** #1 (/contact EN — the new path), #4
(qualified EN), #13 (dispatch EN). If those work, the wiring is sound; the rest
is language/branch coverage.

## How the "Right group?" column gets verified objectively

After you submit a batch, Claude can query the MailerLite API with the prod key
(via `netlify env:get`) and confirm, per test email, which group(s) it landed in
and whether an automation ran — no need to eyeball the MailerLite UI. Just paste
the list of test emails you used.

## On failure

- Fn ≠ 200 → check Sentry (`stage=mailerlite-sync` or function error) + Netlify
  function logs.
- Right group but no auto-reply → the MailerLite **automation** for that group is
  off / misconfigured (fix in MailerLite UI, not in code).
- Wrong group → bug in `getContactGroupIds` / `icp_status` wiring (code).
