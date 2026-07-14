# ROI Diagnostic — PARKED (resume here)

> **Status: parked 2026-06-18.** Built, working, tested — not merged. Shelved to
> focus elsewhere. This file is the breadcrumb on `main`; the real work + a full
> handoff live on the branch below. Nothing is lost.

## Where the work lives

- **Branch:** `feat/roi-diagnostic-leadmagnet`
- **PR:** [#99](https://github.com/ibaifernandez/aglaya.biz/pull/99) — **OPEN, mergeable, CI was green.** Not merged (waiting on final founder review).
- **Full handoff (on that branch):** `docs/HANDOFF-2026-06-18.md` — read this first when resuming. Covers product logic, the 10-question flow, engine, files, done-vs-pending, broader AGLAYA context, and next moves.
- **Design docs (already on `main`):** `docs/roi-diagnostic/` 01–08 + README. The blueprint `09-leadmagnet-blueprint.md` is on the branch only.

## To resume

```bash
git checkout feat/roi-diagnostic-leadmagnet
# read docs/HANDOFF-2026-06-18.md
npm run dev   # → http://localhost:4321/diagnostic/
```

Then either keep building on the branch, or rebase/merge PR #99 when ready.

## One-paragraph state (so you don't have to reopen everything)

A free ~3-minute gamified quiz at **`/diagnostic`** (EN/ES/PT) that gives a prospect a
credible $ number for their manual work and pulls them toward the paid ROI Audit → the
Stack build. **10 varied questions**, multi-select first (which areas bleed you), email
gate at the **end**, per-area breakdown + priority + headcount/hours equivalence (no
revenue asked — reads as a quote-grab). Deterministic engine in `src/lib/diagnostic/`
(numbers from `docs/roi-diagnostic/08-costing-model.md`), component
`src/components/ROIDiagnostic.astro`, function `netlify/functions/diagnostic.ts` (reuses
CRM/MailerLite + consent ledger). Standalone route — the existing `/roi-audit` funnel is
untouched. **84 unit + 39 e2e green.**

## Top pending when we come back (from the handoff)

1. Founder review → merge PR #99.
2. **Rename "ROI Audit"** — founder dislikes the name; CTAs still say it. (The one flagged blocker.)
3. PDF-by-email (pdfkit **standalone** build — see CLAUDE.md gotcha).
4. Dedicated CRM `source` for diagnostic leads (currently reuses funnel sources).
5. Validate on 5–10 real buyers / a ~$300 US-English ad test before scaling.
6. Decide: replace `/roi-audit` or coexist.

> ⚠️ Local stash `wip csv` holds an unrelated change to
> `docs/QA/automations-validation.csv` set aside during this session — recover or drop
> when convenient (`git stash list`).
