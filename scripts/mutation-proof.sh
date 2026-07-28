#!/usr/bin/env bash
#
# THE proof. Everything else this repo checks about the design system can be
# satisfied by a good copy; only this cannot.
#
# It moves a colour at the source (the installed @aglaya/design-tokens), rebuilds
# this site WITHOUT touching a single file of this repo, and asserts the painted
# pixel moved with it — in the CSS, in the HTML <meta>, and in the web manifest.
# A vendored copy passes every other check and fails this one by construction.
#
# It also asserts the converse: that the rebuild changed nothing tracked in git.
# If a repo file had to change for the colour to change, that is not consumption.
#
# Usage: npm run tokens:mutation-proof
set -euo pipefail

cd "$(dirname "$0")/.."

PKG="node_modules/@aglaya/design-tokens"
CANON="$PKG/colors_and_type.css"
SENTINEL="#123456"

if [[ ! -f "$CANON" ]]; then
  echo "FAIL: $CANON not found. Run npm ci first." >&2
  exit 1
fi

ORIGINAL="$(grep -oE -- '--color-brand:\s*#[0-9a-fA-F]{6}' "$CANON" | head -1 | grep -oE '#[0-9a-fA-F]{6}')"
if [[ -z "$ORIGINAL" ]]; then
  echo "FAIL: could not read --color-brand from the canon. Package shape changed." >&2
  exit 1
fi

BACKUP="$(mktemp)"
cp "$CANON" "$BACKUP"

# Astro/Vite keep a build cache keyed on this repo's own files, so a change that
# happens only inside node_modules can be served stale. CI never sees it (fresh
# checkout, fresh install); a laptop does. Clearing it here is what makes the
# proof honest — and it is why bumping the token tag locally needs a cold build.
cold_build() {
  rm -rf dist .astro node_modules/.vite node_modules/.astro
  npm run build >/dev/null
}

restore() {
  cp "$BACKUP" "$CANON"
  rm -f "$BACKUP"
  ( cd "$PKG" && node scripts/build-tokens.mjs >/dev/null 2>&1 ) || true
  cold_build >/dev/null 2>&1 || true
  echo "→ source and build restored to $ORIGINAL"
}
trap restore EXIT

echo "== 1/4 baseline build (brand = $ORIGINAL) =="
cold_build
grep -rqF -- "$ORIGINAL" dist/_astro/*.css \
  || { echo "FAIL: baseline CSS does not contain $ORIGINAL — nothing is painting the brand." >&2; exit 1; }
GIT_BEFORE="$(git status --porcelain)"

echo "== 2/4 mutating the SOURCE: $ORIGINAL -> $SENTINEL (no repo file touched) =="
perl -pi -e "s/\Q$ORIGINAL\E/$SENTINEL/g" "$CANON"
( cd "$PKG" && node scripts/build-tokens.mjs >/dev/null )

echo "== 3/4 rebuilding this site =="
cold_build

echo "== 4/4 asserting the pixel moved =="
fail=0

assert_contains() { # <file-glob-description> <needle> <files...>
  local what="$1" needle="$2"; shift 2
  if grep -rqF -- "$needle" "$@"; then
    echo "  ok   $what carries $needle"
  else
    echo "  FAIL $what does not carry $needle" >&2
    fail=1
  fi
}

assert_absent() {
  local what="$1" needle="$2"; shift 2
  if grep -rqF -- "$needle" "$@"; then
    echo "  FAIL $what still carries the old $needle — something in this repo is a copy" >&2
    grep -rlF -- "$needle" "$@" | sed 's/^/       /' >&2
    fail=1
  else
    echo "  ok   $what no longer carries the old $needle"
  fi
}

assert_contains "stylesheet"   "$SENTINEL" dist/_astro/*.css
assert_absent   "stylesheet"   "$ORIGINAL" dist/_astro/*.css
assert_contains "page <meta>"  "$SENTINEL" dist/index.html
assert_contains "web manifest" "$SENTINEL" dist/site.webmanifest

GIT_AFTER="$(git status --porcelain)"
if [[ "$GIT_BEFORE" == "$GIT_AFTER" ]]; then
  echo "  ok   no tracked file changed to make the colour move"
else
  echo "  FAIL the working tree changed during the mutation — that is a copy, not a dependency" >&2
  diff <(echo "$GIT_BEFORE") <(echo "$GIT_AFTER") >&2 || true
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  echo >&2
  echo "MUTATION PROOF FAILED: this site is copying the brand, not consuming it." >&2
  exit 1
fi

echo
echo "MUTATION PROOF PASSED: the brand moved at the source and this site followed."
