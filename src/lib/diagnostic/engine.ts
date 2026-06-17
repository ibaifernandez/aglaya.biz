// ROI diagnostic — deterministic engine. answers → report. No LLM, no I/O.

import type { DiagnosticAnswers, DiagnosticReport, Tier } from './types';
import {
  computeLaborBleed,
  computeSaasSpend,
  LOADED_RATE,
  PEOPLE_MID,
  HOURS_MID,
} from './costing';

// Fit for a bespoke Stack build. Gates: scale (team) + fundability (spend) + bleed size.
export function computeTier(a: DiagnosticAnswers, bleedMid: number): Tier {
  const fundable = a.spend === 's500_2k' || a.spend === 's2kplus';
  const scale = a.team !== 't_solo';

  // Too small / nothing to build on → honest "not yet".
  if ((a.team === 't_solo' && a.spend === 's_lt100') || bleedMid < 12000) {
    return 'not_yet';
  }
  // Big bleed + fundable + real team → strong fit.
  if (scale && fundable && bleedMid >= 60000) {
    return 'qualified';
  }
  // Real bleed, one gate soft → could be a fit.
  return 'borderline';
}

export function computeDiagnostic(a: DiagnosticAnswers): DiagnosticReport {
  const bleed = computeLaborBleed(a.pain, a.people, a.hours);
  const saasSpend = computeSaasSpend(a.spend);
  const tier = computeTier(a, bleed.mid);
  return {
    pain: a.pain,
    tier,
    laborBleedMid: bleed.mid,
    laborBleed: { low: bleed.low, high: bleed.high },
    saasSpend,
    loadedRate: LOADED_RATE[a.pain],
    assumptions: {
      people: PEOPLE_MID[a.people],
      hours: HOURS_MID[a.hours],
      loadedRate: LOADED_RATE[a.pain],
    },
    flags: {
      patchwork: a.tool === 'patchwork',
    },
  };
}

// Tier → CRM/MailerLite routing vocab (reuses contact funnel taxonomy).
export function tierToIcpStatus(tier: Tier): 'QUALIFIED' | 'BORDERLINE' | 'OPEN_CHANNEL' {
  if (tier === 'qualified') return 'QUALIFIED';
  if (tier === 'borderline') return 'BORDERLINE';
  return 'OPEN_CHANNEL';
}
