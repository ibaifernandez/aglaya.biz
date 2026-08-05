import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RULES, findStateClaims, reportStateClaims } from '../guards/state-claims';

/**
 * IMPLEMENTS.md — declares OUR signature, never anybody else's status.
 *
 * This ledger sits in the repo that OWNS the canonical lead-capture contract, so
 * whatever it says is read as authoritative by every other ship. That is exactly
 * what makes a stale line here expensive: on 2026-07-20 its "Open / pending"
 * section was found still asking for two things that had been satisfied on the
 * day this file signed — 37 days of a false "pending", five lines above a
 * changelog that contradicted it. It was cleaned by hand. Nothing stopped it
 * coming back, and by 2026-08-05 the same section had regrown a verdict about
 * the signature triangle and a "nothing pending on our side".
 *
 * THE EXEMPTION IS STRUCTURAL, NOT PER-LINE.
 *
 * A ledger that may not state anything is useless: declaring our own signed
 * version IS this file's job, and it is the source `firmas()` reads live. So the
 * sections where this repo speaks about ITSELF are exempt wholesale, and every
 * other section is scanned. A section added later is scanned by default — the
 * safe direction for a guard to fail in.
 *
 * WHAT THIS DOES NOT CATCH — the detector's limits are documented next to the
 * patterns in `tests/guards/state-claims.ts` and apply here unchanged. Notably:
 * a confident sentence with no shaped claim in it ("el triángulo quedó resuelto
 * hace poco") states just as much and matches nothing. Tripwire, not proof.
 *
 * SISTER GUARDS — `claude-md-fleet-section.test.ts` (same detector, the fleet
 * section of CLAUDE.md) and `no-foreign-routes.test.ts` (the routes those claims
 * used to travel with).
 */

const LEDGER = resolve(__dirname, '../../docs/contracts/IMPLEMENTS.md');

/**
 * Sections where aglaya.biz speaks about aglaya.biz. Exempt: this is the
 * signature itself, and the changelog is dated history of our own passes.
 */
export const OWN_VOICE_SECTIONS = [
  'Signed version',
  'What aglaya.biz implements',
  'Emitted consent values (current)',
  'Changelog',
];

/** Splits the ledger into `## ` sections. The preamble is scanned as `''`. */
export function sections(markdown: string): { heading: string; body: string }[] {
  const out: { heading: string; body: string }[] = [];
  let heading = '';
  let body: string[] = [];
  for (const line of markdown.split('\n')) {
    const match = /^## +(.*)$/.exec(line);
    if (match) {
      out.push({ heading, body: body.join('\n') });
      heading = match[1].trim();
      body = [];
    } else body.push(line);
  }
  out.push({ heading, body: body.join('\n') });
  return out;
}

/** Sections that speak about other ships, i.e. everything not exempt. */
export function scannedSections(markdown: string) {
  return sections(markdown).filter((s) => !OWN_VOICE_SECTIONS.includes(s.heading));
}

describe('IMPLEMENTS.md — asks the other ships, never answers for them', () => {
  const markdown = readFileSync(LEDGER, 'utf8');

  it('the ledger still has the sections this guard assumes', () => {
    // A rename would silently move a section into (or out of) the exemption.
    const headings = sections(markdown).map((s) => s.heading);
    for (const own of OWN_VOICE_SECTIONS) expect(headings).toContain(own);
    expect(headings).toContain('Open / pending (cross-producer)');
  });

  it('the exemption list is exactly the documented one', () => {
    // Widening it is allowed. Widening it without writing down what stops being
    // watched is how this file rotted the first time.
    expect(OWN_VOICE_SECTIONS).toEqual([
      'Signed version',
      'What aglaya.biz implements',
      'Emitted consent values (current)',
      'Changelog',
    ]);
  });

  it('has sections left to scan (the split itself can rot)', () => {
    const scanned = scannedSections(markdown);
    expect(scanned.map((s) => s.heading)).toContain('Open / pending (cross-producer)');
    expect(scanned.some((s) => s.body.trim().length > 200)).toBe(true);
  });

  it('carries no state claim outside its own voice', () => {
    const hits = scannedSections(markdown).flatMap((s) => findStateClaims(s.body));
    expect(
      hits,
      `State claim(s) in a cross-producer section of docs/contracts/IMPLEMENTS.md.\n` +
        `This ledger is authoritative to every other ship, so a stale line here is\n` +
        `not a note — it is a false answer with the contract owner's name on it.\n` +
        `Replace the answer with the question and the tool that answers it.\n\n` +
        `${reportStateClaims(hits)}\n`,
    ).toEqual([]);
  });

  it('still declares our own signature, which is the point of the file', () => {
    // The ban on answers must not become a gag on the one answer we owe.
    const own = sections(markdown).find((s) => s.heading === 'Signed version');
    expect(own?.body).toMatch(/\bv\d+\.\d+\.\d+\b/);
    // ...and that version would trip `pinned-version` if the exemption broke.
    expect(findStateClaims(own?.body ?? '').map((h) => h.id)).toContain('pinned-version');
  });

  it('routes the questions the deleted answers used to answer', () => {
    const cross = scannedSections(markdown)
      .map((s) => s.body)
      .join('\n');
    expect(cross).toContain('firmas()');
    expect(cross).toContain('contrato("crm-ingestion")');
    expect(cross).toContain('aglaya-atlas');
  });

  describe('the shapes this file actually carried are caught (mutants)', () => {
    const MUTANTS: { id: string; text: string }[] = [
      { id: 'triangle-verdict', text: 'The triangle has been closed since then.' },
      { id: 'nothing-pending', text: 'Nothing pending on our side.' },
      { id: 'shouty-verdict', text: 'CRM re-ack status `ACKNOWLEDGED ✓` — nothing to do.' },
      { id: 'verified-on-date', text: '### Closed 2026-06-13 (verified 2026-07-20)' },
      { id: 'pinned-version', text: 'The CRM spec is at v1.7.2 today.' },
      { id: 'live-in-prod', text: 'Scanner ledger + DSR export live in prod.' },
    ];

    for (const mutant of MUTANTS) {
      it(`flags ${mutant.id}`, () => {
        expect(findStateClaims(mutant.text).map((h) => h.id)).toContain(mutant.id);
      });
    }

    it('flags a relapse injected into the real cross-producer section', () => {
      const cross = scannedSections(markdown).find((s) =>
        s.heading.startsWith('Open / pending'),
      );
      const relapsed = `${cross?.body}\n\n- CRM + Scanner re-acknowledged v1.1.0; the triangle has been closed since then. Nothing pending on our side.\n`;
      const ids = findStateClaims(relapsed).map((h) => h.id);
      expect(ids).toContain('triangle-verdict');
      expect(ids).toContain('nothing-pending');
      expect(ids).toContain('pinned-version');
    });

    it('the exemption cannot launder a claim — it is per section, not per line', () => {
      // Same sentence, scanned when it sits in a cross-producer section.
      const laundered = sections(
        `## Changelog\n\nThe triangle has been closed since then.\n`,
      ).filter((s) => !OWN_VOICE_SECTIONS.includes(s.heading));
      expect(laundered.flatMap((s) => findStateClaims(s.body))).toEqual([]);

      const caught = scannedSections(
        `## Open / pending (cross-producer)\n\nThe triangle has been closed since then.\n`,
      );
      expect(caught.flatMap((s) => findStateClaims(s.body)).map((h) => h.id)).toContain(
        'triangle-verdict',
      );
    });

    it('every rule in the shared set is exercised by one guard or the other', () => {
      // A rule nobody drives is decoration. `captain-pass-date`, `scoreboard` and
      // `commercial-figure` have their mutants in claude-md-fleet-section.test.ts.
      const here = new Set(MUTANTS.map((m) => m.id));
      const elsewhere = new Set(['captain-pass-date', 'scoreboard', 'commercial-figure']);
      for (const rule of RULES) {
        expect(here.has(rule.id) || elsewhere.has(rule.id), `rule "${rule.id}" has no mutant`).toBe(
          true,
        );
      }
    });
  });
});
