# 04 — Open questions / decisions pending

Concept is documented; these need founder calls before/while building.

## Product / UX

1. **Front-end: bespoke vs. Typeform embed.**
   - Bespoke (evolve the current ICPFilter): full control, brand-native, no rent, no external script breaking the dark aesthetic. More build.
   - Typeform/Tally embed: fast, gamified out of the box, but rented, off-brand styling, data leaves the stack, harder to wire to CRM/consent.
   - *Leaning bespoke* (brand + control + the engine lives in our function anyway).

2. **Capture gate timing.**
   - Email *before* result vs. **teaser → email unlocks the full panfleto**.
   - *Leaning teaser-then-unlock* (converts better, feels earned).

3. **Deliverable format.**
   - Instant on-screen panfleto only? + PDF to email? Both?
   - *Leaning*: on-screen first (MVP), PDF email as fast-follow.

4. **How "honest" is the rough number?**
   - The free diagnostic gives an *approximate* cost-of-bleed. How do we compute it
     credibly (hours/week × loaded rate? ranges?) without faking precision — and
     without cannibalizing the paid audit's exact number? Needs a costing model.

5. **One bleed or several?** Let them pick the top 1, or rank a few? More = richer
   panfleto + better routing, but more friction. Probably "pick your top 1–2".

## Positioning

6. **Dilution guardrail.** Exactly how we phrase "bespoke / anything buildable"
   without sounding like a generic dev shop. (See doc 01.) Needs copy work —
   candidate for `obviously-awesome` / `hundred-million-offers` skills.

7. **Readiness vs. honesty.** Final language for "we assemble fast" that conveys
   readiness via receipts without claiming pre-built. Brand-critical.

## Technical

8. **TS-native vs. reuse Python.** Doc 03 recommends TS-native. Confirm we do NOT
   want a Railway/Python dependency on aglaya.biz. (Strong lean: TS-native.)

9. **LLM polish: in or out?** Deterministic panfleto is the floor. Do we add an
   optional Claude pass for prose/personalization (with fallback), or keep it 100%
   deterministic like legal-reg-tech ended up? Cost vs. polish.

10. **Costing model source.** Where do the hours/cost benchmarks come from (so the
    rough number is defensible)? Founder input / industry ranges.

## Scope / sequencing

11. **Does this replace the current ICPFilter, or sit alongside it first?** The
    current qualifier works and is now clean. The diagnostic is a bigger swing —
    build behind a flag / on a branch, validate, then replace.

12. **Relationship to MailerLite automations.** New diagnostic → which group(s) +
    which auto-reply sequence? (Ties into the in-flight B1 MailerLite validation.)

## Not in scope (explicitly)

- Legal Reg·Tech / Consent Ledger (Scanner 21.719's offer; Chile-only).
- The paid ROI Audit's exact-number engine (that's the next rung, separate).
