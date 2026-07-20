import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * FLEET SECTION — no fixed state claims.
 *
 * `CLAUDE.md`'s fleet section is the first thing a new thread reads before
 * touching anything cross-ship. Written state rots there in a specific way: it
 * caduca alone and keeps sounding authoritative after it is dead. That is not a
 * hypothesis — this file carried three at once (a "triangle closed" verdict, an
 * "OPEN: consent fields undocumented" note five weeks stale, and a captain's
 * pass date), all cleaned by hand in PR #112. Nothing stopped them coming back.
 *
 * So: state is not written here, it is asked. The section carries questions and
 * the tool that answers each one. This test fails if answers reappear.
 *
 * SCOPE — the fleet section only, deliberately.
 * A repo-wide sweep is the wrong instrument and would have died on day one:
 * `nvm use v23.4.0`, `engines: >=22.12.0`, `crm-ingestion-api v1.4.0` and the
 * §3-bis contract version are all legitimate elsewhere in this same file. A
 * check that cries wolf gets switched off, and then it guards nothing. Narrow
 * and trusted beats broad and muted. Widen only when a real regression escapes.
 *
 * WHAT THIS DOES NOT CATCH — say it plainly so nobody reads a green tick as a
 * guarantee it never gave:
 *   - Obvious, shaped claims: yes. Dates of a pass, prices, loose versions,
 *     scoreboards, ALL-CAPS verdicts, "live in prod".
 *   - Subtle prose: no. "El triángulo quedó resuelto hace poco" states just as
 *     much and matches nothing here. There is no regex for a confident sentence.
 *   - Quoted spans («…») are exempt, because the section names dead patterns in
 *     order to forbid them. A real claim smuggled inside guillemets walks past.
 * This is a tripwire on the shapes we actually got burned by, not a proof.
 */

const CLAUDE_MD = resolve(__dirname, '../../CLAUDE.md');
const SECTION_HEADING = '## AGLAYA · Flota — el capitán';

/** The fleet section: its heading through the next `## ` heading, or EOF. */
function fleetSection(markdown: string): string {
  const start = markdown.indexOf(SECTION_HEADING);
  if (start === -1) return '';
  const rest = markdown.slice(start + SECTION_HEADING.length);
  const next = rest.search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next);
}

/**
 * Guillemets quote dead patterns by name so the rule can forbid them; scanning
 * inside them would make the section flag itself. Stripped, not ignored — see
 * the limits noted above.
 */
function stripQuotedExamples(text: string): string {
  return text.replace(/«[^»]*»/g, '«»');
}

type Rule = { id: string; why: string; pattern: RegExp };

const RULES: Rule[] = [
  {
    id: 'captain-pass-date',
    why: 'a captain-pass date is a snapshot; it is stale the day after and reads current forever',
    pattern: /(?:últim[oa]|ultim[oa])\s+pase|pase\s+del\s+capit[áa]n/i,
  },
  {
    id: 'verified-on-date',
    why: '"verified on <date>" ages into a false guarantee — ask the tool instead',
    pattern: /verificad[oa][^.\n]{0,40}\d{4}-\d{2}-\d{2}/i,
  },
  {
    id: 'commercial-figure',
    why: 'prices and offers live in the captain\'s atlas (atlas/gtm.md), never here — ask verdad_comercial()',
    pattern: /(?:US\$|\$|USD|CLP|EUR)\s?\d/i,
  },
  {
    id: 'pinned-version',
    why: 'who signed which version is state — ask firmas() / contrato(), do not pin it in prose',
    pattern: /\bv?\d+\.\d+\.\d+\b/,
  },
  {
    id: 'scoreboard',
    why: 'counts and tallies (7/7, 3 naves, 2 pendientes) are a snapshot of a moving number',
    pattern: /\b\d+\s*\/\s*\d+\b|\b\d+\s+(?:naves|contratos|pendientes|firmantes|PRs?|issues?)\b/i,
  },
  {
    id: 'shouty-verdict',
    why: 'an ALL-CAPS verdict is the loudest way to be confidently out of date — ask flota_estado() / contradicciones()',
    // Case-sensitive on purpose: "Estado de un contrato" in the question table is fine.
    pattern: /\b(?:CERRAD[OA]|ABIERT[OA]|PENDIENTES?|BLOQUEAD[OA]|COMPLETAD[OA]|EN CURSO|RESUELT[OA])\b/,
  },
  {
    id: 'triangle-verdict',
    why: 'the signature triangle is exactly what rotted here before — firmas() opens each ledger live',
    pattern: /tri[áa]ngulo[^.\n]{0,40}\b(?:cerrad|resuelt|complet)/i,
  },
  {
    id: 'nothing-pending',
    why: '"nothing pending" is unverifiable the moment it is written — ask flags() / parked()',
    pattern: /nada\s+pendiente|sin\s+pendientes|nothing\s+pending/i,
  },
  {
    id: 'live-in-prod',
    why: 'deployment state changes without touching this file — ask repo_estado() / servicios()',
    pattern: /encendid[oa]|activ[oa]\s+en\s+prod|live\s+en\s+prod|desplegad[oa]\s+en\s+prod|en\s+(?:producci[óo]n|prod)\s+desde/i,
  },
];

/** Returns the rules a chunk of section text violates, with the offending line. */
export function findStateClaims(sectionText: string): { id: string; line: string }[] {
  const scannable = stripQuotedExamples(sectionText);
  const hits: { id: string; line: string }[] = [];
  for (const line of scannable.split('\n')) {
    for (const rule of RULES) {
      if (rule.pattern.test(line)) hits.push({ id: rule.id, line: line.trim() });
    }
  }
  return hits;
}

describe('CLAUDE.md fleet section — asks state, never asserts it', () => {
  const markdown = readFileSync(CLAUDE_MD, 'utf8');
  const section = fleetSection(markdown);

  it('the fleet section still exists', () => {
    expect(section, `"${SECTION_HEADING}" not found in CLAUDE.md`).not.toBe('');
  });

  it('still routes to the captain by question, not by answer', () => {
    // Without these, there is nothing to ask and the ban on answers is a gag.
    expect(section).toContain('aglaya-atlas');
    expect(section).toContain('firmas()');
    expect(section).toMatch(/\| Quieres saber \| Pregunta \|/);
    expect(section).toMatch(/el estado no se escribe en prosa, se pregunta/);
  });

  it('carries no fixed state claims', () => {
    const hits = findStateClaims(section);
    const report = hits.map((h) => {
      const why = RULES.find((r) => r.id === h.id)?.why ?? '';
      return `  [${h.id}] ${why}\n    → ${h.line}`;
    });
    expect(
      hits,
      `Fixed state claim(s) in the fleet section of CLAUDE.md.\n` +
        `State caduca alone and keeps sounding authoritative. Replace the answer\n` +
        `with the question and the tool that answers it.\n\n${report.join('\n\n')}\n`,
    ).toEqual([]);
  });

  it('does not fire on the legitimate versions elsewhere in CLAUDE.md', () => {
    // The false positive the scope exists to avoid. If someone widens this
    // check to the whole file, this test explains what breaks and why.
    expect(markdown).toContain('nvm use v23.4.0');
    expect(section).not.toContain('nvm use');
    expect(findStateClaims(section)).toEqual([]);
  });

  // The mutant: every rule must bite. A rule that never fires is decoration,
  // and a scanner of decorations is exactly the guardian that exists without
  // watching. Each string below is a shape this file actually carried, or the
  // nearest realistic relapse of one.
  describe('each rule bites (mutants)', () => {
    const MUTANTS: { id: string; text: string }[] = [
      { id: 'captain-pass-date', text: '**Último pase del capitán: 2026-07-17** — huella colocada.' },
      { id: 'verified-on-date', text: 'Verificado por el capitán 2026-07-17 — nada que hacer.' },
      { id: 'commercial-figure', text: 'El Plan de Adecuación se vende a $230 y el Scanner es gratis.' },
      { id: 'pinned-version', text: 'El canónico va por v1.1.0 y las tres naves lo firman.' },
      { id: 'scoreboard', text: 'Cohesión 7/7 tras el último lote; 3 naves al día.' },
      { id: 'shouty-verdict', text: 'Registro de contratos: CERRADO. Nada que revisar aquí.' },
      { id: 'triangle-verdict', text: 'El triángulo de firmas del canónico quedó cerrado el 13 de junio.' },
      { id: 'nothing-pending', text: 'Revisado de arriba abajo: nada pendiente por parte del capitán.' },
      { id: 'live-in-prod', text: 'El MCP del atlas está encendido en prod desde el lote anterior.' },
    ];

    for (const mutant of MUTANTS) {
      it(`flags ${mutant.id}`, () => {
        expect(findStateClaims(mutant.text).map((h) => h.id)).toContain(mutant.id);
      });
    }

    it('flags a relapse injected into the real section', () => {
      const relapsed = `${section}\n\n**Último pase del capitán: 2026-08-01** — triángulo CERRADO, nada pendiente.\n`;
      const ids = findStateClaims(relapsed).map((h) => h.id);
      expect(ids).toContain('captain-pass-date');
      expect(ids).toContain('shouty-verdict');
      expect(ids).toContain('nothing-pending');
    });

    it('the guillemet exemption does not launder a real claim on its own line', () => {
      // Quoting the dead pattern is allowed (the rule does it); asserting it is not.
      expect(findStateClaims('Una nota que dice «triángulo cerrado» ya no vale.')).toEqual([]);
      expect(findStateClaims('El triángulo está cerrado, confirmado.').map((h) => h.id)).toContain(
        'triangle-verdict',
      );
    });
  });
});
