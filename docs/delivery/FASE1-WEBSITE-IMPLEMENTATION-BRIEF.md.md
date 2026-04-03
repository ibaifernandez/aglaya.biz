# FASE 1 — Website Operativa: Implementation Brief

> **Audience:** Claude Code / AI developer agent
> **Status:** Ready to implement
> **Last updated:** 2026-03-31
> **Prerequisite reading:** `CLAUDE.md`, `docs/BRAND-DNA.md`, `docs/SERVICES-AI.md`, `docs/IA-RULES.md`

---

## What This Is

Transform aglaya.biz from a Coming Soon page into a fully operational business website. The current Astro infrastructure (SSR, Netlify, Tailwind v4, i18n, hCaptcha, Resend) is solid and must be preserved. This is a **content + architecture build** on top of a working foundation — not a rewrite.

The site must function as the primary commercial asset of AGLAYA: filter out the wrong clients, compel the right ones, and funnel qualified prospects to a single contact point.

---

## Docs You Must Not Contradict

- `docs/BRAND-DNA.md` — Voice, positioning, glosario de poder. If copy you write conflicts with this, it's wrong.
- `docs/SERVICES-AI.md` — Service model, pricing, ROI Audit mechanics. Don't invent services or pricing.
- `docs/IA-RULES.md` — Component rules, styling rules, testing rules. Non-negotiable.
- `CLAUDE.md` — Tech stack, conventions, known gotchas. Read entirely before writing code.

---

## Site Structure

### Routes

```
/                        → EN Homepage (full operational site)
/es/                     → ES Homepage (full operational site)

/proof/                  → EN Proof index (all proof entries)
/proof/[slug]/           → EN Proof detail page
/es/proof/               → ES Proof index
/es/proof/[slug]/        → ES Proof detail page

/contact/                → EN Contact (ICP-filtered form)
/es/contact/             → ES Contact (ICP-filtered form)
```

### Files to Create

```
src/
├── pages/
│   ├── index.astro              ← REPLACE (full homepage, EN)
│   ├── es/
│   │   └── index.astro          ← REPLACE (full homepage, ES)
│   ├── proof/
│   │   ├── index.astro          ← NEW
│   │   └── [slug].astro         ← NEW
│   ├── es/
│   │   └── proof/
│   │       ├── index.astro      ← NEW
│   │       └── [slug].astro     ← NEW
│   ├── contact/
│   │   └── index.astro          ← NEW
│   └── es/
│       └── contact/
│           └── index.astro      ← NEW
├── content/
│   └── proof/                   ← NEW (Content Collections)
│       ├── pocuro.md
│       ├── leben.md
│       └── norden.md
├── components/
│   ├── ContactForm.astro        ← UPDATE (ICP filter integration)
│   ├── ProofCard.astro          ← NEW
│   ├── ProofGrid.astro          ← NEW
│   ├── SystemCard.astro         ← NEW
│   ├── ICPFilter.astro          ← NEW (see spec below)
│   ├── SectionHeader.astro      ← NEW (reusable section title block)
│   └── [existing components]   ← KEEP unchanged unless specified
└── i18n/
    └── translations.ts          ← UPDATE (all new strings)
```

### Files to Preserve

- `src/layouts/BaseLayout.astro` — Keep as-is. SEO, meta, Sentry, fonts all correct.
- `src/components/CookieBanner.astro` — Keep.
- `netlify/functions/contact.ts` — Keep. No changes.
- `astro.config.mjs` — Keep. Do not touch.
- `src/styles/global.css` — Extend (add new utility classes/sections). Do not remove existing tokens.
- `src/pages/404.astro` — Keep.

---

## Content Collections Setup

### 1. Enable Content Collections

Add to `astro.config.mjs` if not present:

```js
import { defineConfig } from 'astro/config';
// content collections are enabled by default in Astro 4+
// just create src/content/config.ts
```

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const proof = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.object({ en: z.string(), es: z.string() }),
    client: z.string(),
    industry: z.string(),
    challenge: z.object({ en: z.string(), es: z.string() }),
    solution_systems: z.array(z.string()), // must match SERVICES-AI.md system names
    results: z.array(z.object({
      metric: z.string(),
      label: z.object({ en: z.string(), es: z.string() }),
    })),
    featured: z.boolean().default(false),
    date: z.string(), // YYYY-MM
    ogImage: z.string().optional(),
  }),
});

export const collections = { proof };
```

### 2. Proof Entry Format

Each `.md` file in `src/content/proof/` follows this structure:

```md
---
title:
  en: "How POCURO Cut Unqualified Leads by 90% in 60 Days"
  es: "Cómo POCURO redujo los leads no calificados un 90% en 60 días"
client: POCURO
industry: Real Estate
challenge:
  en: "Sales team spending 70% of their time qualifying leads that would never convert. No system, no scoring, no visibility."
  es: "El equipo de ventas empleaba el 70% de su tiempo calificando leads que nunca iban a convertir. Sin sistema, sin scoring, sin visibilidad."
solution_systems:
  - Systemic Alchemy
  - AI Orchestration
results:
  - metric: "90%"
    label:
      en: "reduction in unqualified leads reaching sales"
      es: "reducción en leads no calificados llegando a ventas"
  - metric: "60 days"
    label:
      en: "to full system deployment"
      es: "hasta despliegue completo del sistema"
  - metric: "$18K/mo"
    label:
      en: "estimated manual work eliminated"
      es: "trabajo manual eliminado estimado"
featured: true
date: "2025-06"
---

[Full narrative content in English — the body of the proof document goes here.
Write in AGLAYA's voice: direct, evidence-first, no agency fluff.
Structure: Context → Problem (with numbers) → What we built → Results → What the client owns now.]
```

Create stub entries for `pocuro.md`, `leben.md`, and `norden.md`. Use placeholder numbers where real data isn't available — mark with `<!-- TODO: verify with client -->`. Do not invent metrics.

---

## Homepage Architecture

The homepage is the 90% of the site's commercial value. Every section has a job. Do not add sections. Do not remove sections.

### Section 1 — Header (Nav)

**Preserve** the existing header structure. Update nav links:

```html
<!-- Add to nav: -->
<a href="/proof/">Proof</a>
<a href="/contact/">Request Proposal</a>
<!-- Keep: language switcher, WhatsApp -->
```

ES nav: `/es/proof/`, `/es/contact/`

### Section 2 — Hero

**Replace** the Coming Soon hero entirely.

**Job:** State the core thesis with enough force to stop a fast scroller.

**EN copy:**

```
eyebrow:    "We build systems that empower your business while you sleep"
heading:    "The agency is dead.\nLong live the system."
subtext:    "Most teams don't need an agency. They need their own infrastructure.
             We build it. You own it. The system keeps running when we're not in the room."
cta:        "Request Proposal →"
cta_link:   /contact/
secondary:  "See the proof →"
secondary_link: /proof/
```

**ES copy:**

```
eyebrow:    "Construimos sistemas que potencian tu negocio mientras duermes"
heading:    "La agencia murió.\nQue viva el sistema."
subtext:    "La mayoría de equipos no necesitan una agencia. Necesitan su propia infraestructura.
             Nosotros la construimos. Tú la posees. El sistema sigue funcionando cuando no estamos."
cta:        "Solicitar propuesta →"
secondary:  "Ver la evidencia →"
```

**Design:** Keep the cinematic aesthetic of the current page (dark, scanline, cursor glow). Hero heading uses the same word-by-word animation pattern already in `global.css`. No "Coming Soon" label. No marquee in this position (marquee moves to Section 4).

### Section 3 — The Problem (Anti-Agency Statement)

**Job:** Disqualify the market, not sell to everyone. AGLAYA's anti-positioning.

**EN copy:**

```
eyebrow:    "Why not a typical agency"
heading:    "Agencies sell hours.\nWe sell sovereignty."
body:       "When you leave an agency, you lose everything they built — the accounts,
             the automations, the knowledge. With AGLAYA, you own the infrastructure.
             The system keeps running when we're not in the room."
```

**ES copy:** translate with equivalent force. Use "soberanía digital" (already in BRAND-DNA.md glosario).

**Design:** Full-width section, large quote-style heading, body text at secondary opacity.

### Section 4 — The 5 Systems

**Job:** Show the scope of work. Each system is a card with name, one-line definition, and 2–3 use cases.

**Data source:** `docs/SERVICES-AI.md` (sections: Systemic Alchemy, Narrative Delivery, Zero-Leak Architecture, AI Orchestration, Productive Friction).

**Component:** `SystemCard.astro`

```astro
---
interface Props {
  name: string;          // "Systemic Alchemy"
  tagline: string;       // "Manual processes → autonomous digital assets"
  useCases: string[];    // ["Lead qualification", "Reporting", "Onboarding"]
  lang: Lang;
}
---
```

**Layout:** 2-column grid (desktop), stacked (mobile). 5 cards total. No pricing on cards.

**Marquee:** The service keyword marquee from the current page moves here, **below** the cards, as a visual punctuation element.

### Section 5 — How It Works

**Job:** Explain the engagement model in 3 steps. Demystify, build trust.

**3 steps:**

```
Step 1: ROI Audit ($1,500)
"We map every manual process costing you time and money. Exact numbers, no guesswork.
 If we don't find $15K/month to automate, we tell you — and we don't sell you a retainer."

Step 2: System Build
"We design and build the automation architecture defined in the audit. You're involved,
 not managed. We build for sovereignty, not dependency."

Step 3: Ongoing Architecture ($8,000/month)
"We maintain, evolve, and expand the system. Weekly syncs. Real-time async updates.
 You own everything — we're the architects on retainer."
```

**ES:** translate all three steps.

**Design:** Numbered steps (1, 2, 3) in large brand-red numerals. Each step is a horizontal block with number, heading, body. No icons.

### Section 6 — Proof Gallery

**Job:** Show 3 proof entries as preview cards. Each card links to `/proof/[slug]`.

**Component:** `ProofCard.astro`

```astro
---
interface Props {
  client: string;
  industry: string;
  headline: string;       // proof title in current lang
  results: ProofResult[]; // top 2 results only (metric + label)
  slug: string;
  lang: Lang;
}
---
```

**Data source:** Frontmatter from `src/content/proof/` where `featured: true`.

**Layout:** 3-column grid (desktop), stacked (mobile). Each card: client name, industry tag, headline, 2 result metrics, "Read the proof →" link.

**Section heading (EN):** "Proof, not promises."
**Section heading (ES):** "Evidencia, no palabras."

### Section 7 — Anti-Client

**Job:** The deliberate exclusion filter. This section should make the wrong clients self-select out.

**EN heading:** "We don't work with everyone."

**EN body (render as a list of 4–5 hard statements):**

```
- If you see $8,000/month as a cost, not an investment with calculable ROI — we're not your agency.
- If you want a quick fix, not a system that outlasts the engagement — we're not your agency.
- If you need validation, not a perspective that challenges your assumptions — we're not your agency.
- If your company doesn't spend at least $15K/month on manual work that should be automatic — we're not your agency. Yet.
```

**ES:** translate with equivalent directness. Use "No somos tu agencia" as the recurring anchor.

**Design:** Dark section with brand-red accent. Each exclusion statement is a full-width line with a small "×" or dash prefix. No softening.

### Section 8 — Economics

**Job:** Set expectations on price without a pricing table. Justify the ROI before the prospect self-eliminates.

**EN heading:** "The math is simple."

**EN body:**

```
If your team spends $15,000/month on manual work —
and we eliminate 70% of it in 90 days —
that's $10,500/month recovered.
At $8,000/month, you're net positive from month one.

The ROI Audit tells you exactly what you're leaving on the table.
It costs $1,500. If we don't find $15K/month to automate, you don't pay for a retainer.
```

**ES:** translate. Keep the math as-is (USD).

**CTA:** "Start with the ROI Audit →" → `/contact/?type=roi-audit` (pre-selects inquiry type in form)

**Design:** Centered, large typographic treatment. The math should feel like an equation, not a pitch.

### Section 9 — Footer CTA

**EN heading:** "Ready to be uncomfortable?"
**EN subtext:** "Most agencies will tell you what you want to hear. We'll tell you what you need to know."
**CTA:** "Request Proposal →" → `/contact/`

**ES heading:** "¿Listo para la incomodidad?"
**ES subtext:** "La mayoría de las agencias te dirán lo que quieres escuchar. Nosotros te diremos lo que necesitas saber."

**Design:** Full-width section, brand-red background, white text. This is the only place brand-red is used as a background fill.

---

## /proof/ — Proof Index Page

**Job:** Grid of all proof entries. Each card links to the full proof page.

**EN heading:** "Proof."
**EN subtext:** "Results delivered. Systems that kept running after we left."

**ES heading:** "Evidencia."
**ES subtext:** "Resultados entregados. Sistemas que siguieron funcionando cuando nos fuimos."

**Component:** `ProofGrid.astro` — renders all entries from `src/content/proof/` sorted by `date` descending.

**SEO:** Title = "Proof — AGLAYA", description uses brand language. Full JSON-LD `CollectionPage`.

---

## /proof/[slug]/ — Proof Detail Page

**Job:** Full case narrative. Evidence-first. Reads like an engineering postmortem, not a case study brochure.

**Structure:**

1. Client name + industry + date
2. Results block (all metrics, prominent)
3. Challenge section (the problem before AGLAYA)
4. Solution section (what was built, which systems, key decisions)
5. What the client owns now (sovereignty section)
6. CTA: "Similar problem? Request an ROI Audit →"

**Data:** Frontmatter provides metadata/results. MDX body provides the narrative.

**SEO:** Title = "[Client] — [EN title] | AGLAYA", unique description per entry. JSON-LD `Article`.

---

## /contact/ — ICP-Filtered Contact Page

**Job:** Qualify first, collect info second. The wrong person should see the Anti-Client message before they waste their time filling out a form.

### ICP Filter Component — `ICPFilter.astro`

This is a 2-step form:

**Step 1 — Qualifier (shown first, always)**

```
Heading: "Before we talk — a few honest questions."

Question 1: "How many employees does your company have?"
Options:
  - < 20 employees
  - 20–200 employees   ← qualifies
  - 200+ employees

Question 2: "How much does your company spend monthly on manual, repetitive work?"
Options:
  - I'm not sure
  - < $5,000/month
  - $5,000–$15,000/month
  - > $15,000/month    ← qualifies

Question 3: "What brings you here?"
Options:
  - I need automation / systems built
  - I want to understand if AGLAYA is right for me
  - I'm a freelancer / agency looking to partner
  - Something else
```

**Step 1 logic (client-side):**

- If employees < 20 OR spend < $5K → show Anti-Client message (see below), hide form
- If employees = 20–200 AND spend > $15K → proceed to Step 2 (full contact form)
- All other combos → show "You might be a fit in the future" message + offer to stay in touch (minimal form: name + email only)

**Anti-Client message (shown when clearly not a fit):**

```
EN: "We're probably not your agency — yet.
     AGLAYA works with companies spending over $15,000/month on manual work.
     If that's not you today, bookmark this and come back when it is.
     There's no shame in it. That's the honest answer."

ES: "Probablemente no somos tu agencia — todavía.
     AGLAYA trabaja con empresas que gastan más de $15.000 al mes en trabajo manual.
     Si hoy no es tu caso, guarda esta página y vuelve cuando lo sea.
     No hay problema. Esa es la respuesta honesta."
```

**Step 2 — Contact Form (shown only to qualified prospects)**

Fields:

- Name (required)
- Email (required)
- Company name (required)
- What are you looking to solve? (textarea, required)
- How did you hear about us? (optional)
- Inquiry type (hidden field, pre-populated if arriving from `?type=roi-audit`)

**Form behavior:** Same as current — POST to `/.netlify/functions/contact`, hCaptcha validation, Resend confirmation.

**Update `netlify/functions/contact.ts`:** Add `company` and `inquiry_type` fields to the email template. The notification email should clearly display whether this is a qualified lead.

### Qualification URL parameter

If arriving at `/contact/?type=roi-audit`, pre-select "ROI Audit" in the inquiry type field.

---

## i18n — New Translation Keys

Add all new strings to `src/i18n/translations.ts`. Every string that appears in the UI must have both `en` and `es` entries. Naming convention: `section.element` (e.g., `hero.heading`, `proof.grid.heading`).

**Update existing keys that no longer match the new positioning:**

```ts
// OLD — remove or replace:
'hero.label': 'COMING SOON'  // → remove
'hero.eyebrow': 'Introducing AI·gency'  // → 'We build systems that empower your business while you sleep'
'hero.heading': 'The uncomfortable\nagency.'  // → 'The agency is dead. Long live the system.'
'hero.subtext': 'AI executes...'  // → 'Most teams don't need an agency. They need their own infrastructure. We build it. You own it. The system keeps running when we're not in the room.'
'contact.section.heading': 'Be the first to know.'  // → new contact page copy
'form.submit': 'Notify me'  // → 'Send'

// Marquee items — replace with 5 system names:
'marquee.items': [
  'Systemic Alchemy',
  'Narrative Delivery',
  'Zero-Leak Architecture',
  'AI Orchestration',
  'Productive Friction',
  // + repeat or add supporting terms
]
```

---

## Design Constraints

Follow `docs/IA-RULES.md` styling rules and `CLAUDE.md` known gotchas. Additional constraints for Fase 1:

1. **Brand red `#e8003d`** — Only on large headings (≥18px), decorative elements, and the Section 9 footer CTA background. Never on body text or small labels. Use `#ff4d70` for small accent text.
2. **No additional fonts** — Outfit (headings) + Inter (body). Already loaded.
3. **No JS frameworks** — All interactive elements (ICP filter, form) use vanilla JS in `<script is:inline>` or Astro client scripts. No React, no Vue.
4. **Animation** — All new sections with fade-in use the existing `data-animate="fade-up"` pattern from `global.css`. Include `prefers-reduced-motion` fallback.
5. **Section spacing** — Use existing spacing tokens. Sections are separated by `8rem` padding-block on desktop, `4rem` on mobile.
6. **Proof/Case pages** — Dark background throughout (same as rest of site). No white backgrounds anywhere on the site.
7. **Mobile-first** — All new components must be fully usable at 375px. Test every layout at mobile width.

---

## Testing Requirements

Per `docs/IA-RULES.md` and existing `tests/` patterns:

1. **E2E tests** — Create a Playwright test for each new page (`/proof/`, `/proof/[slug]`, `/contact/`).
2. **Accessibility** — Every new page must pass `AxeBuilder` with `wcag2a` and `wcag2aa` tags. Remember to exclude `.h-captcha` and `.marquee-wrap` from axe scans (see `CLAUDE.md`).
3. **ICP filter** — Unit test the qualification logic (each branch: qualified, not qualified, borderline).
4. **i18n parity** — Test that every EN translation key has an ES equivalent.
5. **Form** — The contact form E2E test must cover the 2-step ICP flow (qualify → submit).

---

## SEO — New Pages

Each new page needs:

1. Unique `<title>` and `<meta name="description">` via `BaseLayout.astro` props
2. `hreflang` pointing to its language counterpart (EN ↔ ES)
3. JSON-LD appropriate to the page type:
   - Homepage: `Organization` + `WebSite`
   - `/proof/`: `CollectionPage`
   - `/proof/[slug]`: `Article` (with `datePublished`, `author: AGLAYA`)
   - `/contact/`: `ContactPage`

OG images: reuse `/og-image.png` for all pages in Fase 1. Proof detail pages can use a generated or static OG image per entry — defer to Fase 2 if too complex.

---

## What This Is NOT

Do not build:

- A blog (`/blog/`) — Fase 2
- A `/services/` page — everything is on the homepage
- A `/about/` page — Fase 2
- A `/pricing/` page — pricing is on homepage, Section 8
- A separate `/roi-audit/` landing page — ROI Audit is explained in Section 5 ("How It Works")
- Any client portal, dashboard, or login functionality

---

## Completion Criteria

Fase 1 is complete when:

- [ ] Homepage (EN + ES) renders all 9 sections with correct copy
- [ ] `/proof/` index renders 3 proof cards (EN + ES)
- [ ] `/proof/[slug]` detail renders correctly for each entry (EN + ES)
- [ ] `/contact/` ICP filter works: correct branch for each qualification path
- [ ] Contact form submits successfully via Netlify Function, sends emails (EN + ES)
- [ ] All new pages pass Axe-core WCAG 2AA
- [ ] All new pages have E2E tests that pass in CI
- [ ] `npm run build` completes with zero errors
- [ ] Lighthouse score ≥ 90 on all metrics (Performance, Accessibility, SEO, Best Practices)
- [ ] All i18n keys have EN + ES parity
- [ ] No hardcoded strings outside `translations.ts`

---

## Appendix — Copy Stubs for Content Collections

### pocuro.md (Real Estate lead qualification)

*Full narrative to be written once real client data is confirmed. Use this structure:*

```
Challenge: Sales team manually qualifying 200+ leads/week. No scoring system.
           70% of sales time spent on leads with <5% close probability.

Solution:  AI-powered lead scoring system (Claude API + n8n) integrated with CRM.
           Automatic qualification based on 12 behavioral and demographic signals.
           Disqualified leads get an automated nurture sequence instead of sales contact.

Results:   90% reduction in unqualified leads reaching sales.
           Sales team capacity freed by ~30 hours/week.
           $18K/month estimated manual cost eliminated.

Systems:   Systemic Alchemy + AI Orchestration
```

### leben.md (Real Estate lifecycle automation)

*Full narrative to be written once real client data is confirmed. Use this structure:*

```
Challenge: Fragmented database with zero segmentation. Communications were generic,
           leading to an 8.68% Open Rate and massive lead leakage mid-funnel.

Solution:  Full reconstruction of the customer journey into automated lifecycle sequences.
           Implemented behavior-based triggers delivering specific content based on catalog interaction.

Results:   357% increase in Open Rate (from 8.68% to 39.63%).
           Automated re-engagement of 40% of the "cold" database.
           Consistent pipeline flow without manual intervention.

Systems:   Narrative Delivery + Zero-Leak Architecture
```

### norden.md (Real Estate list hygiene & delivery)

*Full narrative to be written once real client data is confirmed. Use this structure:*

```
Challenge: High deliverability issues. CRM was polluted with ghost leads,
           dragging Open Rate down to 7.56% and risking domain reputation.

Solution:  Execution of a "Full List Hygiene" protocol and redesign of automation logic.
           Decoupled technical infrastructure from "noisy" marketing lists and rebuilt reporting.

Results:   200% increase in Open Rate (from 7.56% to 22.70%).
           Recovered domain authority and inbox placement.
           Real-time reporting layer for decision-making.

Systems:   Zero-Leak Architecture + Productive Friction
```
