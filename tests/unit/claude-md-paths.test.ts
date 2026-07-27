import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * CLAUDE.md — pointers must still point.
 *
 * Two failure modes, both observed on 2026-07-26:
 *
 *  1. ROUTES INTO SOMEBODY ELSE'S REPO. The fleet section named four files
 *     inside the captain's atlas (`atlas/contratos/README.md`,
 *     `atlas/repos/aglaya.biz/`, `atlas/tablero.md`, `atlas/gtm.md`). He
 *     reorganised; all four died; they kept reading like valid addresses. We
 *     cannot test another repo's layout from here, and chasing it would break
 *     again on the next reorg. So the rule is structural: the fleet section
 *     writes ONE captain route — the orchestrator repo root — and everything
 *     else is asked to the `aglaya-atlas` MCP, which answers live and cites
 *     its source.
 *
 *  2. ROUTES INTO OUR OWN REPO that our own reorganisations moved. Those we
 *     CAN check, so we do: every repo-relative path this file cites must exist.
 *
 * SCOPE — only paths that are unambiguously repo-relative: markdown link
 * hrefs, and backticked tokens starting with a known top-level directory.
 * Bare filenames (`contact.ts`, `_crm.ts`) are prose, not addresses, and
 * matching them would resolve to nothing and cry wolf. Paths into other repos
 * (`crm-aglaya/…`) and into `node_modules/` are out of reach by definition.
 */

const REPO_ROOT = resolve(__dirname, '../..');
const CLAUDE_MD = resolve(REPO_ROOT, 'CLAUDE.md');
const SECTION_HEADING = '## AGLAYA · Flota — el capitán';

/** Top-level directories that make a token an address into THIS repo. */
const OWN_DIRS = ['src', 'netlify', 'tests', 'docs', 'public', 'scripts'];

const markdown = readFileSync(CLAUDE_MD, 'utf8');

function fleetSection(text: string): string {
  const start = text.indexOf(SECTION_HEADING);
  if (start === -1) return '';
  const rest = text.slice(start + SECTION_HEADING.length);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

/** Repo-relative paths cited as markdown links or as backticked tokens. */
export function citedOwnPaths(text: string): string[] {
  const found = new Set<string>();

  for (const [, href] of text.matchAll(/\]\(([^)\s#]+)\)/g)) {
    if (/^(?:https?:|mailto:|\/)/.test(href)) continue;
    found.add(href);
  }

  for (const [, token] of text.matchAll(/`([^`\s]+\/[^`\s]*)`/g)) {
    const clean = token.replace(/[),.]+$/, '');
    if (OWN_DIRS.includes(clean.split('/')[0])) found.add(clean);
  }

  return [...found].filter((p) => OWN_DIRS.includes(p.split('/')[0]));
}

describe('CLAUDE.md — every repo-relative path it cites still exists', () => {
  it('finds paths to check at all (the check itself can rot)', () => {
    // If an edit ever makes the extractor blind, an empty pass would look green.
    const paths = citedOwnPaths(markdown);
    expect(paths).toContain('docs/contracts/lead-capture-contract.md');
    expect(paths).toContain('netlify/functions/_crm.ts');
    expect(paths.length).toBeGreaterThan(5);
  });

  it('resolves each one on disk', () => {
    const dead = citedOwnPaths(markdown).filter((p) => !existsSync(resolve(REPO_ROOT, p)));
    expect(
      dead,
      `CLAUDE.md points at file(s) this repo no longer has:\n` +
        dead.map((p) => `  → ${p}`).join('\n') +
        `\nFix the pointer or drop it. A dead route reads as a live one.\n`,
    ).toEqual([]);
  });

  it('flags a moved pointer (mutant)', () => {
    // The shape of the failure: a doc renamed, its link left behind.
    const relapsed = 'Ledger: [`docs/contracts/IMPLEMENTOS.md`](docs/contracts/IMPLEMENTOS.md).';
    const dead = citedOwnPaths(relapsed).filter((p) => !existsSync(resolve(REPO_ROOT, p)));
    expect(dead).toEqual(['docs/contracts/IMPLEMENTOS.md']);
  });

  it('the extractor does not invent addresses out of prose', () => {
    // Bare filenames and other ships' repos are named in prose all over this
    // file; treating them as addresses would fail on day one.
    const paths = citedOwnPaths('Ver `contact.ts` y `crm-aglaya/docs/contracts/x.md`, ojo con `node_modules/pdfkit/js/data/`.');
    expect(paths).toEqual([]);
  });
});

describe('CLAUDE.md fleet section — one captain route, the rest is asked', () => {
  const section = fleetSection(markdown);

  it('the fleet section still exists', () => {
    expect(section, `"${SECTION_HEADING}" not found in CLAUDE.md`).not.toBe('');
  });

  it('cites no path inside the captain\'s atlas', () => {
    // We cannot verify another repo's layout from here, so we do not address it.
    const offenders = section
      .split('\n')
      .filter((line) => /(?:^|[\s`([])atlas\/\S/i.test(line))
      .map((line) => line.trim());
    expect(
      offenders,
      `The fleet section addresses file(s) inside the captain's atlas.\n` +
        `That layout is his to change and has changed before, silently.\n` +
        `Ask the \`aglaya-atlas\` MCP instead — it answers live and cites source.\n\n` +
        offenders.map((l) => `  → ${l}`).join('\n') +
        '\n',
    ).toEqual([]);
  });

  it('still writes the orchestrator repo root, and only that', () => {
    expect(section).toContain('aglaya-orchestrator');
    expect(section).toMatch(/\/Users\/AGLAYA\/Local Sites\/aglaya-orchestrator`/);
    // No deeper route into it: the root is the whole allowance.
    expect(section).not.toMatch(/aglaya-orchestrator\/\S/);
  });

  it('routes the questions those dead paths used to answer', () => {
    expect(section).toContain('contrato("lead-capture")');
    expect(section).toContain('ficha("aglaya.biz")');
    expect(section).toContain('verdad_comercial');
    expect(section).toContain('donde_pregunto');
  });

  // The mutant: a relapse must be caught, not merely described.
  it('flags an atlas route reinjected into the section', () => {
    const relapsed = `${section}\n- La verdad comercial vive en \`atlas/gtm.md\`.\n`;
    const offenders = relapsed.split('\n').filter((line) => /(?:^|[\s`([])atlas\/\S/i.test(line));
    expect(offenders.length).toBe(1);
  });
});
