# IA-RULES — Information Architecture & AI Interaction Rules

## 1. Information Architecture

### URL Structure
```
https://aglaya.biz/              → English (default locale)
https://aglaya.biz/es/           → Spanish
https://aglaya.biz/services/     → (Phase 2) Services
https://aglaya.biz/es/servicios/ → (Phase 2) Services in Spanish
https://aglaya.biz/portfolio/    → (Phase 2) Portfolio
https://aglaya.biz/blog/         → (Phase 2) Blog
https://aglaya.biz/contact/      → (Phase 2) Contact
```

### SEO Hierarchy
Every page must implement:
1. **`<title>`** — unique, descriptive, under 60 characters
2. **`<meta name="description">`** — unique, under 160 characters
3. **`<link rel="canonical">`** — self-referencing canonical URL
4. **`hreflang` links** — all language variants + x-default
5. **Open Graph** — og:title, og:description, og:image, og:url, og:type, og:locale
6. **Twitter Card** — twitter:card, twitter:title, twitter:description, twitter:image
7. **JSON-LD** — Organization (global), WebPage (per page), BreadcrumbList (inner pages)

### Content Model
```
Page
├── lang: 'en' | 'es'
├── title: string
├── description: string
├── ogImage: string (1200x630)
├── sections: Section[]
│   ├── hero: { heading, subtext, cta }
│   ├── features: { items[] }
│   ├── form: { ContactForm }
│   └── marquee: { items[] }
└── metadata: { canonical, hreflang[], structuredData }
```

---

## 2. AI Interaction Rules

### Language Rules
- **Code**: Always in English (variables, functions, comments, commit messages)
- **User-facing content**: Always bilingual via `src/i18n/translations.ts`
- **Documentation**: English, unless the document is explicitly bilingual
- **Git commits**: English, imperative mood ("Add feature", "Fix bug")

### Component Creation Rules
1. Every new component must be an `.astro` file unless it requires client-side state.
2. Props must have a TypeScript interface.
3. User-facing text must come from the i18n system, never hardcoded.
4. Components must be self-contained with scoped styles when possible.
5. ARIA attributes are required for all interactive elements.

### Styling Rules
1. Use Tailwind utility classes as the primary styling method.
2. Custom CSS goes in `<style>` blocks (scoped) or `global.css` (shared).
3. Design tokens from `@theme` block must be used for brand colors, fonts, and spacing.
4. Never use `!important`.
5. Animations must include `@media (prefers-reduced-motion: reduce)` fallbacks.

### Testing Rules
1. Every new page must have E2E coverage in `tests/`.
2. Every new serverless function must have unit tests.
3. Accessibility audit (Axe-core) is mandatory for all page tests.
4. Translation keys must be tested for EN/ES parity.

### Security Rules
1. All user input must be validated server-side in Netlify Functions.
2. Email format validation uses regex + trim + lowercase.
3. Turnstile token verification is mandatory before processing forms.
4. CORS is restricted to `https://aglaya.biz`.
5. No user-provided data is rendered as raw HTML (XSS prevention).
6. Environment variables with secrets are never prefixed with `PUBLIC_`.

### Performance Rules
1. No JavaScript frameworks (React, Vue, etc.) — Astro islands only when needed.
2. Images must use Astro's `<Image>` component for optimization.
3. Fonts are loaded with `display=swap` and preconnected.
4. Third-party scripts (Turnstile, Sentry) loaded async/defer.
5. Target: < 50KB total CSS, < 10KB JS (excluding third-party), LCP < 2s.
