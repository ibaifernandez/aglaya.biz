import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RULES, findStateClaims } from '../guards/state-claims';

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
 * WHERE THE RULES LIVE — `tests/guards/state-claims.ts`, since 2026-08-05, when
 * `docs/contracts/IMPLEMENTS.md` became a second consumer. The limits of the
 * detector (what it catches, what walks past) are documented there, next to the
 * patterns, so they cannot drift away from them.
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
