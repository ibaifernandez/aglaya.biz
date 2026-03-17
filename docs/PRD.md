# PRD — Product Requirements Document

## Product
**AGLAYA Website** — Corporate web presence for AGLAYA, a digital marketing agency branded as "The Uncomfortable Agency."

## Vision
A bilingual (EN/ES) website that is extraordinary in design, bulletproof in robustness, impeccable in accessibility, and uncompromising in security. Not just another agency website — a statement piece.

---

## Phase 1: Coming Soon Page (Current)

### Objective
Establish online presence, capture leads, and build anticipation before full site launch.

### Requirements

#### P0 — Must Have
| ID | Requirement | Status |
|---|---|---|
| CS-01 | Bilingual support (EN at `/`, ES at `/es/`) with full SEO parity | Done |
| CS-02 | Complete metadata: OG tags, Twitter Cards, JSON-LD, hreflang, canonical URLs | Done |
| CS-03 | Contact form with name, email, message fields | Done |
| CS-04 | Bot protection via Cloudflare Turnstile | Done |
| CS-05 | Email delivery via Resend (user confirmation + agency notification) | Done |
| CS-06 | Deployment on Netlify with auto-deploy from GitHub | Pending |
| CS-07 | Error tracking via Sentry | Partial |
| CS-08 | Uptime monitoring via UptimeRobot | Pending |
| CS-09 | WCAG 2AA accessibility compliance | Done |
| CS-10 | Responsive design (mobile-first, 375px → 1440px+) | Done |

#### P1 — Should Have
| ID | Requirement | Status |
|---|---|---|
| CS-11 | CSS animations that convey modernity and sophistication | Partial |
| CS-12 | Visual impact — the page must feel unlike typical "coming soon" pages | In Progress |
| CS-13 | Performance: Lighthouse score > 95 on all metrics | Pending |
| CS-14 | Security headers (CSP, HSTS, X-Frame-Options) via Netlify | Pending |

#### P2 — Nice to Have
| ID | Requirement | Status |
|---|---|---|
| CS-15 | Subtle particle/geometric background animation | Pending |
| CS-16 | Micro-interactions on form focus/submit | Pending |
| CS-17 | Custom 404 page | Pending |

---

## Phase 2: Full Website (Future)

### Objective
Complete agency website with service pages, portfolio, case studies, blog, and team section.

### High-Level Requirements
| ID | Requirement |
|---|---|
| FW-01 | Home page with hero, services overview, social proof, CTA |
| FW-02 | Services page with detailed offerings |
| FW-03 | Portfolio / Case studies with filterable grid |
| FW-04 | About / Team page |
| FW-05 | Blog with MDX support and categories |
| FW-06 | Contact page with enhanced form and map |
| FW-07 | CMS integration (Notion, Contentful, or Astro Content Collections) |
| FW-08 | Analytics (Plausible or Umami — privacy-first) |
| FW-09 | Performance budget: < 100KB initial JS, < 1s LCP |

---

## Non-Functional Requirements

### Security
- All forms protected by Turnstile
- Server-side input validation and sanitization
- CORS restricted to `https://aglaya.biz`
- No inline scripts in production (CSP-ready)
- Environment variables never exposed to client (except `PUBLIC_` prefixed)

### Performance
- Static-first architecture (Astro islands)
- Zero JS by default; hydrate only when necessary
- Image optimization via Astro `<Image>` component
- Font subsetting and preloading

### Accessibility
- WCAG 2.1 Level AA compliance minimum
- Keyboard navigable
- Screen reader compatible
- `prefers-reduced-motion` respected
- Sufficient color contrast (4.5:1 minimum)

### SEO
- Structured data (JSON-LD) on all pages
- Sitemap.xml auto-generated
- robots.txt configured
- Full hreflang implementation
- OG and Twitter Card meta on every page

---

## Target Audience
- Business owners and marketing directors seeking a bold, results-driven agency
- Tech-savvy professionals who appreciate design and attention to detail
- Bilingual audience (English-speaking international + Spanish-speaking LATAM/Spain)

## Success Metrics (Phase 1)
- Lead capture rate > 5% of visitors
- Lighthouse Performance > 95
- Zero accessibility violations (Axe-core)
- 99.9% uptime (UptimeRobot)
- < 2s Time to Interactive
