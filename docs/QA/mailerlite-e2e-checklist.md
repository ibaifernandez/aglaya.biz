# MailerLite E2E — production validation checklist (B1)

> Purpose: prove that every form, in every language, lands the lead in the
> correct MailerLite group AND triggers its automation (auto-reply / Email 0).
> Highest-priority QA after the contact↔ROI swap (PR #83) — we could be losing
> leads silently otherwise.
>
> Created 2026-06-15. Revised 2026-09-20, after the operator deleted the four
> qualification/quote groups and the code stopped writing to them: `/roi-audit`
> and `/quote` no longer touch MailerLite at all, so their rows are gone from the
> matrix below. Two flows remain: footer dispatch and the simple `/contact`.
>
> Which groups exist and which automations are on is **state** — ask MailerLite
> (`list_resources` / `list_automations`), do not trust the IDs written here.

## Pre-flight — already verified ✅

- All prod env vars SET (`netlify env:get … --context production`).
- Group IDs map to the right groups:

| Env var | ID (as read on 2026-09-20) | Group name |
|---|---|---|
| `MAILERLITE_SUSCRIPCIONES_GROUP_ID` | `122059327481579422` | `[AGLAYA.biz] (0) Dispatch (lista de difusión)` |
| `MAILERLITE_CONTACTO_GROUP_ID` | `190336414601184801` | `[AGLAYA.biz] Contacto` |

The four retired vars (`MAILERLITE_CUALIFICADOS_GROUP_ID`,
`MAILERLITE_NO_CUALIFICADOS_GROUP_ID`, `MAILERLITE_BORDERLINE_GROUP_ID`,
`MAILERLITE_COTIZACIONES_GROUP_ID`) are no longer read by any code. Delete them
from Netlify so nobody re-derives a routing that does not exist.

## Expected routing (from code)

| Form | What to do in the funnel | Expected group | Sequence |
|---|---|---|---|
| `/contact` (simple) | just submit | **Contacto** (`MAILERLITE_CONTACTO_GROUP_ID`) | auto-reply |
| footer **dispatch** | enter email, subscribe | Dispatch (`MAILERLITE_SUSCRIPCIONES_GROUP_ID`) | Email 0 |
| `/roi-audit` (any branch) | any score | **none** — MailerLite is not called | internal Resend notification + CRM |
| `/quote` | complete the calculator + submit | **none** — MailerLite is not called | internal Resend notification with the PDF |

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
| 4 | footer dispatch | EN | | ☐ | ☐ | ☐ | n/a | n/a |
| 5 | footer dispatch | ES | | ☐ | ☐ | ☐ | n/a | n/a |
| 6 | footer dispatch | PT | | ☐ | ☐ | ☐ | n/a | n/a |

`/roi-audit` and `/quote` are no longer part of this matrix — they write nothing
to MailerLite. Verify them against the internal Resend notification (and, for
`/roi-audit`, the CRM) instead.

**Minimum viable pass (do these first):** #1 (/contact EN) and #4 (dispatch EN).
If those work the wiring is sound; the rest is language coverage.

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
- Wrong group → bug in `getGeneralContactGroupId()` / `getDispatchGroupId()`
  wiring (code). Any MailerLite call at all from `/roi-audit` or `/quote` is a
  regression: `tests/unit/contact.test.ts` and `tests/unit/quote.test.ts` guard it.
