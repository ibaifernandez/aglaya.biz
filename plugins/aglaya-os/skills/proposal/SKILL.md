---
name: proposal
description: >
  Use this skill when the user wants to "write a proposal for [client]", "generate a retainer
  proposal", "prepare the offer for [company]", "draft the contract proposal", "send proposal
  to [client]", or "put together the offer". Also triggers on "hazme una propuesta para",
  "prepara la oferta para [cliente]", or "escribe la propuesta de retainer".
  This skill produces a full AGLAYA retainer proposal grounded in ROI Audit findings —
  not a generic service menu, but a specific business case with a precise offer.
version: 0.1.0
---

# Proposal Skill

Produce a retainer proposal that makes the $8,000/month decision feel like arithmetic, not negotiation.

## Core Principle

A proposal from AGLAYA is not a service menu. It is the conclusion of an argument that started with the ROI Audit. By the time the client reads the proposal, the math should already be obvious. The proposal's job is to confirm the decision and specify the terms.

## Required Input

Before drafting, confirm you have:
- ROI Audit findings (process map, cost quantification, priority tree)
- Client name and decision-maker
- Top 3 processes identified for automation
- Total monthly cost of manual work identified
- Proposed system architecture (high-level)

If the ROI Audit has not been done, flag this. A proposal without audit findings is a service pitch. AGLAYA does not send service pitches.

## Proposal Structure

### 1. The Number (one paragraph)
Open with the total monthly cost identified in the audit. Not the potential — the measured cost. "In two weeks, we mapped [X] processes in your organization consuming [Y] hours/month at a fully-loaded cost of $[Z]/month."

### 2. What We Build (one page)
Describe the three priority automations from the audit. For each:
- Current state (what the team does manually today)
- Proposed system (what AGLAYA builds)
- Projected monthly saving (conservative estimate)

No jargon. No tech stack details at this stage. Business language.

### 3. The Engagement Model
- **Retainer:** $8,000/month, minimum 3 months
- **What's included:** Weekly sync, full access to the AGLAYA team (not an account manager), continuous build + maintenance + evolution, impact dashboard
- **What's not included:** Generic social media management, content production unconnected to systems
- **Capacity note:** AGLAYA takes a maximum of 2 retainer clients simultaneously. This is a deliberate constraint that guarantees quality of involvement.

### 4. The Business Case (table)
| | Month 1 | Month 2 | Month 3 | Month 6 | Year 1 |
|---|---|---|---|---|---|
| AGLAYA Investment | $8,000 | $8,000 | $8,000 | $8,000 | $96,000 |
| Projected Savings | $[X] | $[X+] | $[X+] | $[X++] | $[Annual] |
| Net Position | $[±] | $[±] | $[±] | $[±] | $[±] |

Use conservative estimates from the audit. Savings should always exceed investment by Month 2 at worst.

### 5. Terms and Next Steps
- Payment: bank transfer or Wise, first of the month
- Contract: 3-month initial commitment, monthly auto-renewal thereafter
- Exit: 30 days notice. Client keeps everything built.
- Start: ROI Audit deducted from Month 1 invoice if applicable
- To proceed: signed agreement + first month's payment

### 6. The Filter Clause (one sentence)
End with this: "If at any point during the engagement you feel the systems we build are not delivering the projected value, we'll tell you before you do."

This is not a guarantee — it is a signal of confidence and alignment.

## Tone

Confident, not salesy. Precise, not verbose. The proposal should read like a surgeon's recommendation after diagnosis: "Here is what we found. Here is what we fix. Here is what it costs. Here is what you get back."

No "we are excited to work with you." No "we believe this partnership will be transformative." State the case. Let the math speak.

## Language

Match the language of the client's audit interaction. If the audit was in Spanish, the proposal is in Spanish. If English, English.

Reference `references/proposal-structure.md` for full template with formatting guidelines and business case calculation examples.
