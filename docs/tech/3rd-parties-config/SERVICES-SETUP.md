---
status: superseded
domain: architecture
owner: engineering
source_of_truth: false
supersedes: []
superseded_by:
  - docs/tech/3RD-PARTIES-CONFIG.md
last_reviewed: 2026-07-15
consumable_by_agents: true
---

# SERVICES-SETUP — Superseded

This file described the original “coming soon” service stack and is no longer authoritative.

Do **not** use this document to configure production.

Use these instead:

- `docs/tech/3RD-PARTIES-CONFIG.md` — master third-party source of truth (incl. platform status, Sentry alerts, Migadu DNS)
- `docs/tech/3rd-parties-config/NETLIFY-CONFIG.md` — Netlify runtime/build setup
- `docs/ops/PRODUCTION-VALIDATION.md` — smoke tests and release criteria

## Why this file was superseded

The original version of this document referenced an obsolete stack, including:

- Cloudflare Turnstile instead of hCaptcha
- the old “coming soon” contact model
- incomplete Sentry and email-routing assumptions

Those instructions are intentionally retired to protect the single source of truth.
