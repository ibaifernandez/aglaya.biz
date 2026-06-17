# 08 — Costing model (the report's spine)

> Source: `deep-research` cost-benchmark pass, 2026-06-15 (111 agents, 28 sources,
> 92 claims → 25 verified, 17 confirmed / 8 refuted). US market / English.
> **Honesty rule baked in:** labor + invoice = FIRM; everything else = ASSUMPTION
> until manually sourced. The free report shows RANGES; the exact number is the
> paid ROI Audit.

## FIRM inputs (load-bearing, cited)

### Loaded labor cost (US)
- Base medians (BLS OOH, May 2024): **customer-support rep $20.59/hr** (p10 <$14.75, p90 >$30.16); **bookkeeping/accounting clerk $23.66/hr** ($49,210/yr).
- **Fully-loaded multiplier: ×1.40–1.43 mid** (band 1.25–1.45). SBA says verbatim "1.25–1.4× salary"; BLS ECEC Dec-2025 = ~1.43× private-industry (benefits ~30% of total comp). 1.25× = lean floor; 1.45–1.46× = civilian avg (runs high for SMB).
- Loaded examples (×1.43): support rep **≈$29.4/hr**, clerk **≈$33.8/hr**.
- Other roles (BLS OEWS May 2024 base median; ×1.43 → loaded):
  - Admin/ops assistant (43-6014): $22.82 → **≈$32.6/hr**
  - Sales rep (41-4012): $32.11 → **≈$45.9/hr**
  - Marketing analyst/coord (13-1161): $37.00 → **≈$52.9/hr** (alt PR 27-3031 $33.55 → ≈$48)
  - ⚠️ p10/p90 for these not pulled (bls.gov blocks fetch) — grab manually if ranges needed.

### Manual invoice processing (AP-derived, label as AR-approx)
- **~$15 manual vs ~$3 automated per invoice** (IOFM $15.97; APQC median ~$21, top-quartile $10; automated $2–5). ~70–80% savings.
- **~12–15 min manual touch-time** (~5 invoices/hr).
- ⚠️ These are accounts-PAYABLE benchmarks; our pain is AR/collections → use as approximate anchor, cite IOFM/APQC/Ardent directly (not the reseller blog).

### SaaS per-seat list prices (2026, vendor pages — gap-filled)
- CRM: **HubSpot Starter $15–20** · **Salesforce Pro $80** · **Pipedrive Lite $14** /seat/mo
- Billing: **QuickBooks Simple Start $38** · FreshBooks $23 · Bill.com ~$45/mo *(Bill.com soft)*
- BI: **Power BI Pro $14** · **Tableau Creator $75** (Explorer $42 / Viewer $15) · **Looker Studio $0** /seat/mo *(refutes the old $10–20 / $70–140 claims)*
- Scheduling: **Calendly Standard $10** · Email: **Brevo $9 / Mailchimp Essentials $13** (→ ~$75 at 5k contacts)
- **Typical SMB stack: ~$95/mo lean (1 seat each) → ~$300–400/mo realistic (3 seats + mid tiers).** *(per-tool firm; stack total soft — depends on seats/volume)*
- Automation tooling: Make Core $10.59/mo · Zapier Starter $29.99/mo.

## SOFT inputs (ranges only — flag in report)
- Sales non-selling time: **60–70% non-selling / ~8 hrs/wk/rep on admin** (Salesforce State of Sales 2026: 40% selling; SPOTIO 21% admin). ⚠️ Salesforce's prior editions said ~28–30% selling — use as directional RANGE.

## Leakage / error-cost benchmarks (gap-filled)
- **Lead response speed:** reply in **5 min vs 30 min ≈ 21× more likely to qualify** the lead (~100× to connect). HBR audit: 42-hr avg first response, 23% never reply. *(firm stat; underlying study dated 2007/2011)*
- **Late B2B payment:** **~50% of US B2B invoices paid late**, ~20 days past due, ~8% bad debt (Atradius Payment Practices Barometer 2024). *(firm)*
- **Manual data-entry error rate: ~1%** (0.01–0.55% with QC). *(soft rule-of-thumb)*

## Build cost / dev rate / maintenance / payback (gap-filled)
- **US dev rate:** BLS SOC 15-1252 median ≈ **$64/hr** (floor); onshore agency/freelance **$120–200+/hr** *(soft, Clutch/GoodFirms)*.
- **One-time build:** automation system **$15–60K** · internal tool/dashboard **$20–80K** · bespoke CRM/platform **$60–250K+** *(soft, vendor guides)*.
- **Maintenance: 15–20%/yr** of build cost (Gartner/Forrester rule) *(firm rule)*.
- **Payback buyers expect: ~12 mo "strong"; SMB 8–12 mo. TCO horizon: 3 yr** (build-vs-buy breaks even in 2–3 yr) *(convention)*.

## ⛔ Refuted — never cite these
Gartner "50% non-selling"; "48% never follow up"; "80% need 5 follow-ups"; "60% could save 6+ hrs/wk"; Power BI $10–20/seat; Tableau $70–140/seat; Make Pro/Teams tier figures.

## v1 COSTING FORMULA

```
STATUS-QUO COST (annual)
  = Σ tasks [ hours/week × 52 × loaded $/hr × #people ]   ← FIRM (BLS labor)
  + stacked SaaS (annual)                                  ← list prices firm; stack total soft
  + leakage cost (lost leads / late pay / errors)          ← benchmarked (firm-ish)

AGLAYA COST
  = build one-time ($15–250K by scope, amortize 3 yr)      ← ranges soft (vendor guides)
  + recurring infra/maintenance (15–20%/yr of build)       ← firm rule (Gartner/Forrester)

DELTA   = status-quo − AGLAYA recurring
PAYBACK = build one-time ÷ monthly status-quo savings (months)
```

**Worked anchor (firm part only):** support rep, 8 h/wk on repetitive admin, 1 person
→ 8 × 52 × $29.4 = **$12,230/yr** bleeding on that single task. Scale by #people /
add tasks → the report's headline range.

## Honesty line for the report (verbatim policy)
> Firm & cited: BLS labor rates + loaded multiplier, SaaS list prices, late-payment
> & lead-response benchmarks, maintenance rule. Soft (shown as ranges): hours-on-task,
> SaaS stack total, build-cost ranges, data-entry error rate. The **exact** figure
> is what the paid ROI Audit produces.

**Status: v1 model COMPLETE** (all 4 gaps filled, 2026-06-15). Defensible
end-to-end with honest firm/soft labeling. Ready to build the report template on.

This protects the brand (no fake precision) AND the value ladder (free = credible
range → audit = exact number).
