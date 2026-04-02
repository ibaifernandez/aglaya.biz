# AGENTS.md — Agent Collaboration Guidelines

## The main current problems

Don't go any further, for here the main current problems lay:

1. En https://aglaya.biz/ el toogle de idioma cambia 50 veces bien, que le des seguidas.
2. Navega a https://aglaya.biz/#systems y también cambia 50 veces seguidas bien.
3. Navega a https://aglaya.biz/contact e igualmente... cambia 50 veces bien.
4. De ahí, navega a https://aglaya.biz/#proof (por ejemplo) y al darle al toogle de idioma... te devuelve a la página de inicio.

WTF.

Adicionalmente, el cursor ha pasado a ser un cudrado horrible en lugar del punto con un círculo a su alrededor que solía ser.

## Purpose
This document defines how AI agents should interact with this codebase, what roles they serve, and how to coordinate multi-agent workflows.

## Agent Roles

### 1. Code Agent (Primary)
- **Scope**: Writes, edits, and refactors source code in `src/`, `netlify/`, and `tests/`.
- **Rules**:
  - Always read a file before editing it.
  - Run `npm run build` after structural changes to verify no breakage.
  - Run `npm run test:unit` after modifying logic in `i18n/`, `netlify/functions/`, or component scripts.
  - Maintain bilingual parity: any new user-facing string must appear in both EN and ES in `translations.ts`.
  - Follow the brand identity: use `#e8003d` for brand accents and `#9FC243` for corporate elements.

### 2. Documentation Agent
- **Scope**: Maintains `docs/`, `README.md`, `CLAUDE.md`, `AGENTS.md`, and `CHANGELOG.md`.
- **Rules**:
  - Keep docs in sync with code changes.
  - Use imperative mood in changelogs ("Add feature", not "Added feature").
  - Update `docs/ROADMAP.md` when milestones are completed.
  - All documentation in English unless explicitly bilingual.
  - Include brand color references in documentation when relevant.

### 3. Design Agent
- **Scope**: Modifies styles, layout, animations, and visual components.
- **Rules**:
  - Respect the design token system in `global.css` (`@theme` block).
  - Brand color `#e8003d` is immutable unless explicitly authorized.
  - Use corporate color `#9FC243` for accent elements and corporate branding.
  - Maintain dark theme consistency (black/near-black backgrounds).
  - All animations must respect `prefers-reduced-motion`.
  - Test responsive layouts at 375px, 768px, 1024px, 1440px.

### 4. QA Agent
- **Scope**: Runs tests, audits accessibility, validates builds.
- **Rules**:
  - Run full test suite before declaring work complete.
  - Report Axe-core violations with severity and element selectors.
  - Verify both `/` and `/es/` routes for bilingual content.
  - Ensure brand colors and identity elements are consistent.

## Coordination Protocol
1. **Before starting work**: Read `CLAUDE.md` for project context and conventions.
2. **Before modifying UI**: Take a screenshot to understand current state.
3. **After completing work**: Update `docs/CHANGELOG.md` with changes made.
4. **Conflicts**: If two agents need to modify the same file, the Code Agent takes priority; others wait.

## File Ownership
| Path | Primary Owner |
|---|---|
| `src/pages/`, `src/components/`, `src/layouts/` | Code Agent |
| `src/styles/global.css` | Design Agent |
| `src/i18n/translations.ts` | Code Agent |
| `netlify/functions/` | Code Agent |
| `tests/` | QA Agent |
| `docs/`, `*.md` (root) | Documentation Agent |

## Quality Gates
Every change must satisfy:
- [ ] `npm run build` succeeds
- [ ] `npm run test:unit` passes
- [ ] Pages render correctly at mobile and desktop widths
- [ ] Both EN and ES routes work
- [ ] No Axe-core WCAG 2AA violations
- [ ] Brand identity elements (colors, logo) are consistent
