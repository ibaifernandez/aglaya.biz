# Changelog

## [Unreleased]

### Added
- **SEO**: Legal pages (cookies, privacy policies) now return `noindex, nofollow` meta robots to prevent Google indexation
- **SEO**: Added `noindex` prop to `BaseLayout.astro` for granular control over page indexability
- **SEO**: Created explicit `robots.txt` to block crawlers from legal page paths

### Changed
- Updated `src/layouts/BaseLayout.astro` to support conditional `noindex` directive
- Updated legal pages (EN, ES, PT) to mark as non-indexable:
  - `/cookies/`, `/es/cookies/`, `/pt/cookies/`
  - `/privacy/`, `/es/privacidad/`, `/pt/privacidade/`

### Technical Details
- Legal pages now emit `<meta name="robots" content="noindex, nofollow" />` in HTML head
- `robots.txt` explicitly disallows crawlers from legal paths while allowing sitemap indexing
- All tests passing (26 unit tests, 20 E2E tests)
