# 05 — Demand research (Phase 1: qualitative map)

> Source: `deep-research` workflow, 2026-06-15 (107 agents, 25 sources fetched,
> 85 claims → 25 adversarially verified, 19 confirmed / 6 refuted).
> **Status: Phase 1 (qualitative + competitor + methodology). NO hard search-volume
> or CPC numbers yet — those need Phase 2 (Keyword Planner / Ahrefs).**

## Why this matters

We built Scanner 21.719 then found ~zero keyword volume — the classic build-trap.
This flips it: find where commercial demand already exists, then aim paid ads
there. The research delivers the demand MAP and the customer LANGUAGE; it does not
(and cannot, without a keyword tool) deliver volume/CPC.

## Headline findings (verified)

1. **No hard numbers obtained.** Every demand conclusion rests on competitor
   positioning (commercial-intent *treatment*, not measured volume) or SaaS-
   marketplace counts (tool-buyer interest, not ad-search demand). Hard figures
   require pulling the keyword strings below through Keyword Planner (paid account
   = exact, not ranges) + cross-check Ahrefs, scoped per market.
2. **Zero/low volume ≠ zero demand.** Keyword tools underreport long-tail/niche
   B2B (same term varies ~9× across Google/Semrush/Ahrefs). Validates the Scanner
   lesson AND warns us not to discard niche clusters on a single zero reading.
3. **🇲🇽 Mexico = strongest-evidenced market.** Live competitors (gabrielneuman.com
   `/cuanto-cuesta/`, add.com.mx) build commercial pages on the literal query
   *"¿cuánto cuesta automatizar un proceso en una empresa?"*, with an established
   done-for-you price band (**$15K–$35K MXN per bounded automation**) and ready ad
   angles. They cover exactly our clusters (support WhatsApp bots, sales CRM/lead
   follow-up, CFDI invoicing/cobranza, auto-reporting, marketing scheduling).
4. **🇪🇸 Spain = unevidenced.** All four Spain-specific demand claims (javadex.es)
   were REFUTED in verification. Currently a blank — validate from scratch.
5. **🇺🇸 US/English = indirect demand, wedge tension.** G2 Winter-2026 fastest-
   growing: Lead Capture, SMS Marketing, AI Chatbots, E-Commerce, Web Security;
   Capterra billing/invoicing large+active (1,638 products, ~12,898 reviews/yr).
   BUT this measures SaaS-tool appetite → cuts toward DIY, *against* our bespoke
   wedge. Validate intent ("automation software" = buy tool, vs "automation
   agency/service/done-for-you" = hire us).
6. **Wedge validated as a POSITION** (managed design/testing/maintenance vs self-
   service no-code), not as demand volume.

## Market priority (demand-first)

| Rank | Market | Why | Action |
|---|---|---|---|
| 1 | **🇲🇽 Mexico (ES)** | Live competitor proof + literal keywords + price band + cluster match | Validate volumes, then ads first here |
| 2 | **🇺🇸 US (EN)** | Real but indirect (SaaS); higher CPC/competition; bigger ticket | Validate buy-vs-hire intent; lean managed/done-for-you |
| 3 | **🇪🇸 Spain (ES)** | No evidence yet | Validate the MX ES query family at geo=Spain before spending |

*(Note: site speaks EN/ES/PT. Mexico = ES = direct fit. Brazil/PT not researched
this round.)*

## Candidate keyword strings → validate in Phase 2 (NOT yet volume-checked)

### 🇲🇽 Mexico — commercial / ready-to-buy (ES)
- `cuánto cuesta automatizar un proceso en una empresa`
- `cuánto cuesta una consultoría de IA empresarial`
- `cuánto cuesta implementar n8n` / `make` / `zapier`
- `agencia de automatización para pymes`
- `automatizar cobranza CFDI SAT`
- `bot whatsapp atención al cliente 24/7`
- `CRM que califica leads automáticamente`

### 🇲🇽 Mexico — cluster priority (by competitor-evidenced angle)
1. **Ops/admin** — "tareas repetitivas que consumen 15–30 horas semanales"
2. **Finance** — invoicing / cobranza CFDI 4.0
3. **Customer/support** — WhatsApp FAQ bots 24/7
4. **Sales** — CRM lead follow-up / qualification
5. **Data** — auto-reporting ("reportes que se actualizan solos")

### 🇺🇸 US — commercial (EN), expect SaaS competition
- `done-for-you automation service`
- `managed workflow automation`
- `automate invoicing for small business`
- `lead capture automation`
- `hire automation agency`

### 🇪🇸 Spain
Build the same ES family as Mexico; validate fresh at geo=Spain. No demand claim survived.

## Phase 2 — the hard numbers (next, needs a tool)

Pull every string above through **Google Keyword Planner** (active Google Ads
account → exact figures, not ranges) and cross-check **Ahrefs**, scoped:
- USA: geo `2840`, language `1000` (English)
- Spain / Mexico: respective geo constants, language `1003` (Spanish)
- Endpoint: Google Ads API `GenerateKeywordHistoricalMetrics` (avg monthly searches + competition index + top-of-page bid as CPC proxy).

Then: cross demand (real volume/CPC) × our 40 pains (doc 02) → final demand-first
ad shortlist per market.

## Open questions (carry-over)

- Actual volume/CPC per string per market (the core unanswered question).
- Does Spain have any real demand, or is it create-the-category (= expensive)?
- US: are SMBs searching to BUY a tool or HIRE a builder? (intent-segment the keywords)
- Real buyer VOICE (Reddit/Quora/LinkedIn) per market — Phase 1 returned mostly
  vendor marketing; genuine customer phrasing for ad copy still needs social-listening mining.

## Caveats (do not overclaim)

Mexico findings rest on TWO competitor pages; the hour/peso figures come largely
from one article — **ad angles to test, not market truths**. US findings = vendor
press + directory (supply/reviews, not searcher intent), US-English only. Nothing
here proves Spain. The wedge is a position, not a volume. **Validate before spend.**
