---
name: outreach
description: >
  Use this skill when the user wants to "draft outreach to a prospect", "write a LinkedIn message
  to [company/person]", "prepare cold email for [company]", "write outreach for AGLAYA",
  "draft a prospecting message", or any request to contact a potential client on behalf of AGLAYA.
  Also triggers on "escribe un mensaje a", "redacta outreach para", or "cómo contacto a [empresa]".
  This skill produces prospect outreach — LinkedIn DMs or cold emails — in AGLAYA's voice,
  filtered strictly by ICP criteria.
version: 0.1.0
---

# Outreach Skill

Produce prospect outreach for AGLAYA that opens conversations, not sales pitches.

## Core Principle

AGLAYA does not pitch. It asks a surgical question that makes the prospect think "this person understands my problem." The goal of the first message is one thing: a reply. Not a meeting, not a sale. A reply.

## ICP Filter — Run This First

Before drafting anything, confirm the prospect qualifies:

- Company has 20–200 employees
- Decision-maker is Founder, CEO, COO, or Director (Ops or Marketing)
- Company likely spends >$15K/month on manually-operated processes
- Industry: real estate, fintech, e-commerce, SaaS, professional services

If the prospect does NOT fit the ICP, do not draft outreach. Flag the mismatch and explain why.

## Two Formats

### LinkedIn DM (primary channel)

**Message 1 — The Surgical Question (under 80 words)**

Structure:
1. One specific observation about their business (not a compliment — an insight)
2. One question that names a pain they probably have
3. No pitch, no link, no "would love to connect"

**Message 2 — Follow-up (7 days later, under 60 words)**

Reference something specific from their recent activity (post, company news, job posting). Reframe the question if no reply. Still no pitch.

**Message 3 — The Offer (only if still no reply)**

Offer the ROI Audit directly: "Two weeks. We map every manual process costing your team time. If we don't find $15K/month in automatable work, we tell you. If we do, we build it." Provide contact.

### Cold Email

**Structure:**
1. Subject: specific + curiosity-inducing (no "quick question" or "following up")
2. Opening: one concrete observation about their business (job posting, growth signal, industry context)
3. Pain naming: "Companies your size in [industry] typically spend $X/month on [process]. Most don't realize it."
4. Proof: one result from a similar client (POCURO: 90% reduction in unqualified leads)
5. CTA: ROI Audit offer — not a free call, a paid engagement that signals seriousness

**Length:** 120–180 words maximum.

## Tone Rules

- No "I hope this finds you well"
- No "I came across your profile"
- No "I'd love to pick your brain"
- No hollow compliments about their company
- Every sentence must be about them, not about AGLAYA

## Language

Default to English. Use Spanish only if the prospect's company and LinkedIn presence are Spanish-language.

## Output Format

Present:
1. The draft (LinkedIn DM or email)
2. A one-line rationale for the opening hook
3. An alternative version if the opening is debatable

Reference `references/icp-and-messaging.md` for detailed ICP firmographics and example message patterns.
