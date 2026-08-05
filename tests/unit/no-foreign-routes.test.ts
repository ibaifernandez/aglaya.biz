import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';

/**
 * NO ROUTES INTO SOMEBODY ELSE'S REPO.
 *
 * `tests/unit/claude-md-paths.test.ts` already bans atlas routes — inside the
 * fleet section of `CLAUDE.md`, and nowhere else. That scope was honest when it
 * was written (the relapse we had suffered was in that section) and wrong by the
 * time anyone checked the rest: on 2026-08-05 a sweep found deep routes into two
 * other ships sitting in `docs/`, in the signature ledger of the contract this
 * repo OWNS, and in `CLAUDE.md` itself — every one of them outside the guard.
 *
 * The rule, from `CLAUDE.md`'s own corolario: **routes into THIS repo, yes — and
 * they are checked. Routes into another ship, only the root of its repo; the
 * rest is asked to the `aglaya-atlas` MCP,** which answers live and cites its
 * source. A path into another repo is an address we cannot verify from here and
 * that its owner may reorganise without telling us. It does not stop reading
 * like a valid address when it dies. That is the whole failure mode.
 *
 * SCOPE — `CLAUDE.md` plus `docs/`, `src/`, `netlify/`. Prose and code alike: a
 * dead address in a comment misleads exactly as well as one in a document.
 *
 * NOT SCANNED, and why (the list is asserted below so it cannot grow in silence):
 *
 *   - `tests/` — the guards quote dead patterns in order to forbid them, and
 *     `tests/unit/crm-consent.test.ts` cites the Scanner's and the plugin's test
 *     files as the provenance of a shared golden vector. Scanning here would
 *     make the guards flag themselves, and the exemption needed to prevent that
 *     is a laundering hole. Cost of the exclusion: a foreign route added to a
 *     test file walks past. Accepted; tests are not where anybody looks for an
 *     address.
 *   - `docs/ops/CHANGELOG.md` — a dated historical log. Its entries describe
 *     what was true on a stated day and are frozen by construction; a citation
 *     inside one is evidence, not a pointer to follow.
 *   - `docs/contracts/lead-capture-contract.md` — the canonical contract. Editing
 *     it is a governed act (§8: bump the version, re-sign every signatory), so a
 *     hygiene guard must not be able to force an unversioned edit of a signed
 *     artifact. It carries two foreign citations today; closing them is a
 *     contract change and belongs in its own, versioned pass.
 */

const REPO_ROOT = resolve(__dirname, '../..');

const SCAN_ROOTS = ['CLAUDE.md', 'docs', 'src', 'netlify'];
const SCAN_EXTENSIONS = ['.md', '.ts', '.astro', '.mjs', '.js'];

/** Excluded files, each for a reason spelled out in the header above. */
export const NOT_SCANNED = [
  'docs/ops/CHANGELOG.md',
  'docs/contracts/lead-capture-contract.md',
];

/**
 * Other ships of the fleet. Only the repo ROOT of each may be written here; a
 * root is a stable name, a path into it is a guess about somebody else's layout.
 */
const FOREIGN_SHIPS = [
  'aglaya-orchestrator',
  'crm-aglaya',
  'legal-reg-tech',
  'consent-ledger-wp',
  'aglaya-design-system',
];

/** A route into the captain's atlas — the original sin, in any document. */
const ATLAS_ROUTE = /(?:^|[\s`([<"'])atlas\/\S/i;

/**
 * A route deeper than another ship's repo root. The leading boundary keeps
 * `@aglaya/design-tokens` (an npm package, not a path) and mid-word matches out.
 */
const FOREIGN_DEEP_ROUTE = new RegExp(
  `(?:^|[\\s\`([<"'])(?:${FOREIGN_SHIPS.join('|')})/[A-Za-z0-9_.-]`,
);

export type Offence = { file: string; line: number; rule: string; text: string };

/** Every scannable file under the scan roots, repo-relative, minus the exclusions. */
export function filesToScan(root = REPO_ROOT): string[] {
  const found: string[] = [];

  const walk = (abs: string) => {
    for (const entry of readdirSync(abs)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      const child = join(abs, entry);
      if (statSync(child).isDirectory()) walk(child);
      else if (SCAN_EXTENSIONS.some((ext) => entry.endsWith(ext))) found.push(child);
    }
  };

  for (const target of SCAN_ROOTS) {
    const abs = resolve(root, target);
    if (statSync(abs).isDirectory()) walk(abs);
    else found.push(abs);
  }

  return found
    .map((abs) => relative(root, abs))
    .filter((rel) => !NOT_SCANNED.includes(rel))
    .sort();
}

/** Scans one file's text. Exported so the mutants can drive it without touching disk. */
export function findForeignRoutes(text: string, file = '<inline>'): Offence[] {
  const offences: Offence[] = [];
  text.split('\n').forEach((line, i) => {
    if (ATLAS_ROUTE.test(line))
      offences.push({ file, line: i + 1, rule: 'atlas-route', text: line.trim() });
    if (FOREIGN_DEEP_ROUTE.test(line))
      offences.push({ file, line: i + 1, rule: 'foreign-deep-route', text: line.trim() });
  });
  return offences;
}

describe('no routes into another ship’s repo', () => {
  const files = filesToScan();

  it('actually has files to scan (the sweep itself can rot)', () => {
    // A broken walker would return nothing and the ban would pass vacuously.
    expect(files.length).toBeGreaterThan(40);
    expect(files).toContain('CLAUDE.md');
    expect(files).toContain('docs/contracts/IMPLEMENTS.md');
    expect(files).toContain('netlify/functions/_crm.ts');
  });

  it('the exclusion list is exactly the documented one', () => {
    // If this fails, somebody widened the blind spot. Widening is allowed; doing
    // it without writing down what stops being watched is not.
    expect(NOT_SCANNED).toEqual([
      'docs/ops/CHANGELOG.md',
      'docs/contracts/lead-capture-contract.md',
    ]);
  });

  it('finds none', () => {
    const offences = files.flatMap((file) =>
      findForeignRoutes(readFileSync(resolve(REPO_ROOT, file), 'utf8'), file),
    );

    expect(
      offences,
      `Route(s) into a repo this one does not own:\n\n` +
        offences.map((o) => `  [${o.rule}] ${o.file}:${o.line}\n    → ${o.text}`).join('\n\n') +
        `\n\nWrite the ship's repo root and ask the \`aglaya-atlas\` MCP for the rest —\n` +
        `it reads live and cites its source. A path into somebody else's layout\n` +
        `dies on their reorg and keeps reading like a live address.\n`,
    ).toEqual([]);
  });

  describe('each ban bites (mutants)', () => {
    it('flags an atlas route', () => {
      const hits = findForeignRoutes('La verdad comercial vive en `atlas/gtm.md`.');
      expect(hits.map((h) => h.rule)).toEqual(['atlas-route']);
    });

    it('flags a deep route into every ship on the list', () => {
      for (const ship of FOREIGN_SHIPS) {
        const hits = findForeignRoutes(`Ver \`${ship}/docs/contracts/IMPLEMENTS.md\`.`);
        expect(hits.map((h) => h.rule), `${ship} walked past`).toContain('foreign-deep-route');
      }
    });

    it('allows the repo root, which is the whole allowance', () => {
      expect(findForeignRoutes('El capitán es el repo `aglaya-orchestrator`.')).toEqual([]);
      expect(findForeignRoutes('La API la posee el CRM (repo `crm-aglaya`).')).toEqual([]);
    });

    it('does not fire on the scoped npm package or on our own paths', () => {
      // `@aglaya/design-tokens` is a package name; `docs/…` is ours to check
      // elsewhere. A guard that cries wolf gets switched off.
      expect(findForeignRoutes('Tokens desde `@aglaya/design-tokens`.')).toEqual([]);
      expect(findForeignRoutes('Ledger en [`docs/contracts/IMPLEMENTS.md`](docs/contracts/IMPLEMENTS.md).')).toEqual([]);
      expect(findForeignRoutes('Standalone build: `node_modules/pdfkit/js/data/`.')).toEqual([]);
    });

    it('flags a relapse injected into a real file', () => {
      // Delta, not absolute: this must keep proving the ban bites even if the
      // file it is injected into ever legitimately gains an exemption.
      const real = readFileSync(resolve(REPO_ROOT, 'docs/contracts/IMPLEMENTS.md'), 'utf8');
      const before = findForeignRoutes(real, 'IMPLEMENTS.md');
      const relapsed = `${real}\n\nRe-firmado en \`crm-aglaya/docs/contracts/IMPLEMENTS.md\`.\n`;
      const after = findForeignRoutes(relapsed, 'IMPLEMENTS.md');
      expect(after.length).toBe(before.length + 1);
      expect(after.at(-1)?.rule).toBe('foreign-deep-route');
    });
  });
});
