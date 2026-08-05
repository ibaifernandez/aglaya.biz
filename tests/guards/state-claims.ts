/**
 * STATE CLAIMS — the shapes that rot, in one place.
 *
 * Extracted from `tests/unit/claude-md-fleet-section.test.ts` (which was their
 * only consumer) because a second document now needs the same detector:
 * `docs/contracts/IMPLEMENTS.md`, the signature ledger of the canonical
 * contract this repo owns. Two callers, one rule set — a rule that bites in one
 * document and not the other is how a guard quietly becomes decoration.
 *
 * NOT a `.test.ts` on purpose: `vitest.config.ts` globs `tests/unit/**\/*.test.ts`,
 * so a shared module living here is imported, never collected twice.
 *
 * BILINGUAL. The fleet section is Spanish, the contract ledger is English, and
 * the same claim rots in either language. Patterns that were Spanish-only when
 * they had a single Spanish caller now match both. Every added alternation has
 * a mutant in `tests/unit/implements-ledger-asks.test.ts`.
 *
 * WHAT THIS DOES NOT CATCH — stated plainly so a green tick is never read as a
 * guarantee it never gave:
 *   - Obvious, shaped claims: yes. Dates of a pass, prices, loose versions,
 *     scoreboards, ALL-CAPS verdicts, "live in prod", "nothing pending".
 *   - Subtle prose: no. "El triángulo quedó resuelto hace poco" states just as
 *     much and matches nothing here. There is no regex for a confident sentence.
 *   - Quoted spans («…») are exempt, because a document that forbids a pattern
 *     has to be able to name it. A real claim smuggled inside guillemets walks past.
 * A tripwire on the shapes we actually got burned by, not a proof.
 */

export type Rule = { id: string; why: string; pattern: RegExp };

export const RULES: Rule[] = [
  {
    id: 'captain-pass-date',
    why: 'a captain-pass date is a snapshot; it is stale the day after and reads current forever',
    pattern: /(?:últim[oa]|ultim[oa])\s+pase|pase\s+del\s+capit[áa]n/i,
  },
  {
    id: 'verified-on-date',
    why: '"verified on <date>" ages into a false guarantee — ask the tool instead',
    pattern: /(?:verificad[oa]|verified)[^.\n]{0,40}\d{4}-\d{2}-\d{2}/i,
  },
  {
    id: 'commercial-figure',
    why: "prices and offers live in the captain's atlas, never here — ask verdad_comercial()",
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
    // Case-sensitive on purpose: "Estado de un contrato" in a question table is fine.
    pattern:
      /\b(?:CERRAD[OA]|ABIERT[OA]|PENDIENTES?|BLOQUEAD[OA]|COMPLETAD[OA]|EN CURSO|RESUELT[OA]|CLOSED|ACKNOWLEDGED|COUNTERSIGNED|DONE)\b/,
  },
  {
    id: 'triangle-verdict',
    why: 'the signature triangle is exactly what rotted here before — firmas() opens each ledger live',
    pattern: /(?:tri[áa]ngulo|triangle)[^.\n]{0,40}\b(?:cerrad|resuelt|complet|closed|resolved)/i,
  },
  {
    id: 'nothing-pending',
    why: '"nothing pending" is unverifiable the moment it is written — ask flags() / parked()',
    pattern:
      /nada\s+pendiente|sin\s+pendientes|nothing\s+(?:is\s+)?pending|nothing\s+pending\s+on/i,
  },
  {
    id: 'live-in-prod',
    why: 'deployment state changes without touching this file — ask repo_estado() / servicios()',
    pattern:
      /encendid[oa]|activ[oa]\s+en\s+prod|live\s+en\s+prod|desplegad[oa]\s+en\s+prod|en\s+(?:producci[óo]n|prod)\s+desde|live\s+in\s+prod/i,
  },
];

/**
 * Guillemets quote dead patterns by name so a rule can forbid them; scanning
 * inside them would make a document flag itself. Stripped, not ignored — see
 * the limits noted above.
 */
export function stripQuotedExamples(text: string): string {
  return text.replace(/«[^»]*»/g, '«»');
}

/** Returns the rules a chunk of text violates, with the offending line. */
export function findStateClaims(
  text: string,
  options: { only?: string[]; except?: string[] } = {},
): { id: string; line: string }[] {
  const active = RULES.filter(
    (r) =>
      (!options.only || options.only.includes(r.id)) &&
      (!options.except || !options.except.includes(r.id)),
  );
  const scannable = stripQuotedExamples(text);
  const hits: { id: string; line: string }[] = [];
  for (const line of scannable.split('\n')) {
    for (const rule of active) {
      if (rule.pattern.test(line)) hits.push({ id: rule.id, line: line.trim() });
    }
  }
  return hits;
}

/** Human-readable failure report for a set of hits. */
export function reportStateClaims(hits: { id: string; line: string }[]): string {
  return hits
    .map((h) => `  [${h.id}] ${RULES.find((r) => r.id === h.id)?.why ?? ''}\n    → ${h.line}`)
    .join('\n\n');
}
