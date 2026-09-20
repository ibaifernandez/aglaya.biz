// ROI diagnostic — deterministic engine. answers → report. No LLM, no I/O.

import type { DiagnosticAnswers, DiagnosticReport, Tier } from './types';
import {
  computeLaborBleed,
  computeSplits,
  computeEquivalent,
  computeSaasSpend,
  PEOPLE_MID,
  HOURS_MID,
} from './costing';

// Fit for a bespoke Stack build. Gates: scale (team) + fundability (spend) + bleed size.
export function computeTier(a: DiagnosticAnswers, bleedMid: number): Tier {
  const fundable = a.spend === 's500_2k' || a.spend === 's2kplus';
  const scale = a.team !== 't_solo';

  if ((a.team === 't_solo' && a.spend === 's_lt100') || bleedMid < 12000) {
    return 'not_yet';
  }
  if (scale && fundable && bleedMid >= 60000) {
    return 'qualified';
  }
  return 'borderline';
}

export function computeDiagnostic(a: DiagnosticAnswers): DiagnosticReport {
  const areas = a.areas.length ? a.areas : [a.worst];
  const bleed = computeLaborBleed(areas, a.worst, a.people, a.hours);
  const splits = computeSplits(bleed.mid, areas, a.worst);
  const equivalent = computeEquivalent(a.people, a.hours);
  const saasSpend = computeSaasSpend(a.spend);
  const tier = computeTier(a, bleed.mid);

  return {
    areas,
    worst: a.worst,
    tier,
    laborBleedMid: bleed.mid,
    laborBleed: { low: bleed.low, high: bleed.high },
    blendedRate: bleed.rate,
    splits,
    equivalent,
    saasSpend,
    assumptions: {
      people: PEOPLE_MID[a.people],
      hours: HOURS_MID[a.hours],
      blendedRate: bleed.rate,
    },
    flags: {
      patchwork: a.tool === 'patchwork' || a.tried === 'zapier',
    },
    frequency: a.frequency,
    tried: a.tried,
    volume: a.volume,
  };
}

// Tier → CRM/MailerLite routing vocab (reuses contact funnel taxonomy).
export function tierToIcpStatus(tier: Tier): 'QUALIFIED' | 'BORDERLINE' | 'OPEN_CHANNEL' {
  if (tier === 'qualified') return 'QUALIFIED';
  if (tier === 'borderline') return 'BORDERLINE';
  return 'OPEN_CHANNEL';
}
