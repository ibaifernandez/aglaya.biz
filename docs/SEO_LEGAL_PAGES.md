# SEO: Legal Pages Noindex Implementation

**Version:** v0.0.2  
**Date:** 2026-04-10  
**Status:** ✅ Deployed to production

---

## Overview

Legal and regulatory pages (cookies policies, privacy policies) no longer appear in Google search results. They are marked with `noindex, nofollow` metadata and blocked by `robots.txt`.

**Affected pages (all languages):**
- Cookie policies: `/cookies/`, `/es/cookies/`, `/pt/cookies/`
- Privacy policies: `/privacy/`, `/es/privacidad/`, `/pt/privacidade/`

---

## Implementation Details

### 1. Layout Enhancement

**File:** `src/layouts/BaseLayout.astro`

Added optional `noindex` prop to control page indexability:

```astro
interface Props {
  // ... existing props ...
  noindex?: boolean;
}

const { noindex = false } = Astro.props;

// In <head>:
<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
```

**Why:** Allows granular control over individual pages without hardcoding meta tags.

### 2. Legal Pages Configuration

**Files:**
- `src/pages/cookies.astro`
- `src/pages/privacy.astro`
- `src/pages/es/cookies.astro`
- `src/pages/es/privacidad.astro`
- `src/pages/pt/cookies.astro`
- `src/pages/pt/privacidade.astro`

Each legal page passes `noindex={true}` to BaseLayout:

```astro
<BaseLayout
  title="..."
  description="..."
  lang="en"
  alternateUrl={...}
  noindex={true}
>
```

### 3. robots.txt

**File:** `public/robots.txt`

Explicit disallow rules for crawler access:

```
User-agent: *
Allow: /
Disallow: /cookies/
Disallow: /es/cookies/
Disallow: /pt/cookies/
Disallow: /privacy/
Disallow: /es/privacidad/
Disallow: /pt/privacidade/
```

---

## Browser Output

**Cookies page (`/cookies/`):**
```html
<meta name="robots" content="noindex, nofollow" />
```

**Homepage (`/`):**
```html
<meta name="robots" content="index, follow" />
```

---

## Testing & Verification

- ✅ 26 unit tests passing
- ✅ 20 E2E + accessibility tests passing
- ✅ Build verification: `dist/cookies/index.html` contains `noindex, nofollow`
- ✅ Deploy preview tested
- ✅ Netlify auto-deploy to production completed

---

## Search Console Actions

After deployment, recommend:

1. **Remove from index** in Google Search Console:
   - Go to "Removals" → "Temporary removals"
   - Add URLs: `/cookies/`, `/privacy/`, and language variants
   - Select "Remove for now"

2. **Request URL inspection** for homepage to verify indexing is still active:
   - Check that homepage shows "Indexing allowed"

3. **Monitor robots.txt** in GSC:
   - "Coverage" → verify legal pages are blocked

---

## Future Enhancements

- Add `noindex` pages to sitemap exclusion if sitemap is generated
- Consider adding Terms of Service page (if created) to noindex pages
- Monitor GSC for any legal pages still appearing in results

---

## Related PRs

- #28: feat: block legal pages from Google indexation
- #29: chore: release v0.0.2

---

## Rollback Plan

If needed, revert is simple:

```bash
git revert ca0b25e ae15371
```

This will:
1. Remove `noindex` prop from legal pages
2. Restore default `index, follow` behavior
3. Delete `robots.txt`
