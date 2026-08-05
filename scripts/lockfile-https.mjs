#!/usr/bin/env node
/**
 * Rewrite git+ssh GitHub specs back to git+https in package-lock.json.
 *
 * npm resolves GitHub git dependencies over ssh in the lockfile no matter what
 * package.json says, on every `npm install`. This repo has one such dependency
 * (@aglaya/design-tokens, pinned to a tag), so every install leaves the lockfile
 * pointing at a URL that keyless runners cannot fetch.
 *
 * It is not fatal — `.github/workflows/ci.yml` and `netlify.toml` both set git's
 * `insteadOf` env config, which redirects ssh to https before npm forks git
 * (verified: with the rewrite a keyless `git ls-remote` on the ssh URL succeeds,
 * without it, it fails). But relying on the net alone leaves the committed
 * lockfile lying about where it resolves from. This puts it back.
 *
 * Idempotent, and exits 0 with nothing to say when there is nothing to do, so it
 * is safe to run from anywhere.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOCKFILE = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package-lock.json');
const SSH = /git\+ssh:\/\/git@github\.com\//g;

const check = process.argv.includes('--check');
const before = readFileSync(LOCKFILE, 'utf8');
const after = before.replace(SSH, 'git+https://github.com/');
const count = before.match(SSH)?.length ?? 0;

if (before === after) {
  console.log('package-lock.json: all GitHub specs already resolve over https.');
  process.exit(0);
}

if (check) {
  console.error(
    `package-lock.json: ${count} git+ssh spec(s) that should read git+https.\n` +
      `Fix with:  npm run lockfile:https\n` +
      `Not fatal — ci.yml and netlify.toml rewrite ssh to https at install time —\n` +
      `but the committed lockfile should not misstate where it resolves from.`,
  );
  process.exit(1);
}

writeFileSync(LOCKFILE, after);
console.log(`package-lock.json: rewrote ${count} git+ssh spec(s) to git+https.`);
