import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * GUARDIAN OF THE GUARDIAN — the seal's watchdog.
 *
 * aglaya.biz is one of three producers that seal the cross-producer
 * `evidence_hash` (contract §3-bis). Scanner 21.719 and consent-ledger-wp seal
 * the same digest; the CRM dedups by it. If the three drift apart, dedup breaks
 * silently — no error anywhere, just duplicate consent entries nobody notices.
 *
 * `crm-consent.test.ts` freezes our end of that seal. The fleet's docs say the
 * hash is "frozen by a golden test", and every ship's `sello()` check reads our
 * file to confirm it still pins the literal. But reading a file proves the test
 * EXISTS, not that it RUNS — `sello()` says so itself: "un test que existe pero
 * está en skip pasaría este chequeo". A guardian can rot three ways while the
 * whole fleet keeps quoting it as a guarantee:
 *
 *   1. deleted or renamed          → nothing pins the literal anymore
 *   2. present but never executed  → `.skip`, `.todo`, or an `.only` ANYWHERE
 *                                    else in that file, which silently narrows
 *                                    the run and leaves ours mute (the vitest
 *                                    flavour of the trap — see `allowOnly`)
 *   3. present, executed, toothless → an early `return`, a commented-out or
 *                                    otherwise dead assertion. Green, and blind.
 *
 * This file closes all three, and never trusts a file read where it can help it:
 *
 *   - it re-derives the digest from the spec text, independently of our own
 *     implementation, so `_crm.ts` and the golden test would have to drift the
 *     SAME wrong way to stay green;
 *   - it EXECUTES the golden test in a child vitest run and demands that exact
 *     test report `passed` — skipped, missing, or renamed all fail here;
 *   - it proves the assertion still bites by running a MUTANT of the golden
 *     file with one digit of the literal flipped, and demanding it turn red.
 *     A gutted assertion passes the mutant and fails this test. That is the
 *     difference between a guardian that exists and a guardian that watches.
 *
 * Deliberately NOT a git hook: `main` is protected and CI runs `npm run
 * test:unit` on every PR, so a test here is enforced on every clone and every
 * contributor. A local hook is weaker — it does not travel.
 *
 * If this file goes red: do NOT edit the literal to make it green. A mismatch
 * means a producer diverged. Coordinate with Scanner and consent-ledger-wp
 * (canonical: `docs/contracts/lead-capture-contract.md` §3-bis) before touching
 * field order, separator, or email normalization.
 */

const GOLDEN_FILE = resolve(__dirname, 'crm-consent.test.ts');
const MUTANT_FILE = resolve(__dirname, '__seal-mutant.gen.test.ts');

/** The one literal the whole fleet is pinned to. Frozen 2026-07-13. */
const SHARED_GOLDEN_HASH =
  'sha256:21d20c700ac844f5c02482bc758630bbac4384b89bd7088e7998bded903f9967';

/** Full name of the assertion that must stay alive, as vitest reports it. */
const GOLDEN_TEST_NAME =
  'cross-producer evidence_hash matches the shared golden vector (Scanner + plugin PHP + aglaya.biz)';

type VitestJson = {
  numTotalTests: number;
  testResults: { assertionResults: { fullName: string; status: string }[] }[];
};

/**
 * Run vitest on a single file in a child process and return the JSON report.
 * `ok` is false when the run failed — which is the expected outcome for a mutant.
 */
function runVitestOn(file: string): { ok: boolean; report: VitestJson | null } {
  // Strip the parent runner's env so the child boots a clean vitest.
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith('VITEST')) delete env[key];
  }

  let stdout = '';
  let ok = true;
  try {
    stdout = execFileSync(
      process.execPath,
      [resolve(__dirname, '../../node_modules/vitest/vitest.mjs'), 'run', file, '--reporter=json'],
      { cwd: resolve(__dirname, '../..'), env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
  } catch (err) {
    ok = false;
    stdout = (err as { stdout?: string }).stdout ?? '';
  }

  // The JSON reporter may be preceded by banner lines; take the last JSON object.
  const start = stdout.indexOf('{');
  let report: VitestJson | null = null;
  if (start !== -1) {
    try {
      report = JSON.parse(stdout.slice(start)) as VitestJson;
    } catch {
      report = null;
    }
  }
  return { ok, report };
}

function statusOfGoldenTest(report: VitestJson | null): string | undefined {
  return report?.testResults
    .flatMap((r) => r.assertionResults)
    .find((a) => a.fullName === GOLDEN_TEST_NAME)?.status;
}

describe('consent seal — the golden test is alive, not just present', () => {
  it('re-derives the shared vector from the spec, independently of _crm.ts', () => {
    // Canonical formula, transcribed from the contract rather than imported:
    // sha256(email ␟ purpose ␟ legal_basis ␟ notice_version ␟ granted_at ␟ source),
    // U+001F separator, `sha256:` prefix. Same neutral vector the other two
    // producers seal. If our implementation drifts, it drifts away from THIS.
    const canonical = [
      'subject@example.com',
      'scanner-ley-21719',
      'consent',
      '2026-06-01',
      '2026-01-15T00:00:00Z',
      'scanner21719-web',
    ].join('');

    expect(`sha256:${createHash('sha256').update(canonical, 'utf8').digest('hex')}`).toBe(
      SHARED_GOLDEN_HASH,
    );
  });

  it('the golden file exists and still pins the shared literal', () => {
    expect(existsSync(GOLDEN_FILE)).toBe(true);
    expect(readFileSync(GOLDEN_FILE, 'utf8')).toContain(SHARED_GOLDEN_HASH);
  });

  it('the golden file has no .skip / .todo / .only muting it', () => {
    const src = readFileSync(GOLDEN_FILE, 'utf8');
    // `.only` is the subtle one: on ANY test in the file it silences every
    // other test there, ours included, without a word. `allowOnly: false` in
    // vitest.config.ts turns that into an error everywhere, not just in CI.
    expect(src).not.toMatch(/\b(it|test|describe)\.(skip|todo|only|skipIf|runIf)\b/);
    expect(src).not.toMatch(/\b(it|test|describe)\.each\b.*\.(skip|only)\b/);
  });

  it('executes the golden test and demands it report passed', () => {
    const { ok, report } = runVitestOn(GOLDEN_FILE);
    expect(report, 'child vitest produced no parsable JSON report').not.toBeNull();
    expect(ok, 'the golden test file did not pass').toBe(true);
    // Named lookup: a rename breaks this even though the suite stays green.
    expect(statusOfGoldenTest(report)).toBe('passed');
  });

  it('proves the assertion bites: a one-digit mutant of the literal must go red', () => {
    const src = readFileSync(GOLDEN_FILE, 'utf8');
    // Flip one hex digit of the pinned literal. Nothing else changes.
    const mutated = src.replace(SHARED_GOLDEN_HASH, SHARED_GOLDEN_HASH.replace(/21d20c70/, '21d20c71'));
    expect(mutated, 'mutation did not apply — the literal moved?').not.toBe(src);

    try {
      writeFileSync(MUTANT_FILE, mutated, 'utf8');
      const { ok, report } = runVitestOn(MUTANT_FILE);
      // If a mutated literal still passes, the assertion is dead weight:
      // gutted, returned-past, or comparing something else entirely.
      expect(ok, 'the golden assertion is toothless — a wrong hash still passed').toBe(false);
      expect(statusOfGoldenTest(report)).toBe('failed');
    } finally {
      rmSync(MUTANT_FILE, { force: true });
    }
  });
});
