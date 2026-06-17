# 03 — Architecture: what we reuse from legal-reg-tech

Source: deep audit of `/Users/AGLAYA/Local Sites/legal-reg-tech` (2026-06-15).
That system turns a **passive web scan** into a **deterministic** compliance
report (Ley 21.719) — 100% rules-based, no LLM required; LLM only polishes prose.
We feed our diagnostic **richer input** (first-person answers), so the same
architecture yields a stronger, more personal output.

## The transferable patterns (the gold)

1. **Rules as data, not code.** legal-reg-tech defines controls in
   `backend/app/rules/matrix_v1.json` and evaluates them in
   `services/rules_engine.py`. → We define `diagnostic-rules.json` (bleed → severity
   → explanation → recommended sub-build → receipt) and a small evaluator.
2. **Contract-first stages (JSON Schema).** `scan_v1.schema.json` → `report_v1.schema.json`,
   validated between every stage (`schema_registry.py`). → We define
   `diagnostic-input.schema.json` (answers) and `diagnostic-output.schema.json`
   (the panfleto data), validated at the function boundary.
3. **Deterministic first, LLM optional.** The report is always built deterministically
   and schema-validated; if an LLM is enabled it only *rewrites prose* and the result
   is re-validated, else it falls back. No LLM in the critical path → no breakage, no
   cost dependency. (Matches our legal-reg-tech decision: deterministic engine.)
4. **Evidence tracing.** Every finding points back to its source. For us: every line
   of the panfleto traces to the answer that triggered it ("you said you do X by hand").
   Transparency = trust = brand.
5. **Scoring = weighted rule aggregation.** Risk/maturity score from matched-rule
   weights + severities. → A simple "bleed cost / opportunity score" the same way.

## What we DISCARD (scan/compliance-specific)

Crawler (Playwright), page analysis, sitemap/DNS preflight, the 5× consensus voting
(form answers are deterministic — ask once), tracker catalogs, and all Ley 21.719
domain content. None of it applies to a form-driven diagnostic.

## Stack decision: TS-native, NOT a Python fork

legal-reg-tech is Python/FastAPI/Railway/ReportLab. aglaya.biz is **Astro / TS /
Netlify Functions**. Reusing the Python code literally would drag a second runtime
+ Railway dependency onto a site that doesn't need it. The diagnostic is *much*
simpler than the scan engine (no crawl, no consensus). **Recommendation: rebuild
the patterns natively in TypeScript.**

Proposed shape (all within aglaya.biz's existing stack):

```
Astro page (/roi-audit)  ──►  gamified multi-step diagnostic (client component;
                              evolve the current ICPFilter into it, or embed Typeform)
        │ answers (JSON)
        ▼
Netlify Function  /diagnostic        (TypeScript)
   1. validate answers   → diagnostic-input.schema.json
   2. evaluate rules     → diagnostic-rules.json  (deterministic; the matrix pattern)
   3. score + select sub-builds + receipts
   4. assemble panfleto data → diagnostic-output.schema.json
   5. (optional) LLM polish of prose, re-validate, else fallback
   6. capture: email → MailerLite group + CRM lead (+ consent ficha, reuse _crm.ts)
        │
        ▼
Deliverable:
   • instant on-screen personalized panfleto (HTML, branded), AND/OR
   • PDF emailed (pdfkit STANDALONE build — see CLAUDE.md gotcha, ENOENT otherwise)
```

Reused aglaya.biz building blocks: `netlify/functions/_crm.ts` (lead + consent
ficha), `_mailerlite.ts` (group routing), `_sentry.ts`, the i18n system
(EN/ES/PT), the brand tokens in `global.css`. PDF: pdfkit standalone (already a
documented pattern here) — keeps it in-stack, no Railway.

## Why first-person input beats the scan

The scan infers from a public surface (lossy, hedged with "coverage_confidence").
The diagnostic gets the truth from the operator directly → higher confidence,
no crawl noise, no consensus needed, and the output can be *prescriptive and
personal* ("you told us X") rather than *observational* ("we detected X").

## Minimum viable build (when we execute)

1. `diagnostic-rules.json` — ~15–25 rules over the bleed taxonomy (doc 02).
2. `diagnostic-input` / `diagnostic-output` JSON schemas + a tiny validator.
3. TS evaluator (the matrix pattern) + scorer.
4. Panfleto renderer (HTML on-screen first; PDF later).
5. Wire capture to `_crm.ts` / `_mailerlite.ts`.
6. Gamified front-end (evolve ICPFilter, or Typeform embed — see doc 04).
