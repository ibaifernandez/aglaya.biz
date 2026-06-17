// ROI diagnostic — costing model. Numbers traced to docs/roi-diagnostic/08-costing-model.md.
// Honesty rule: labor = FIRM (BLS OEWS May 2024 base median × loaded multiplier).
// Headline is a single ≈ midpoint estimate; we show a ±40% band as fine print and
// state plainly that the exact figure is the paid ROI Audit. (A raw bucket-edge
// range compounds to absurd widths — e.g. $144K–$1.1M — and reads as a scam.)

import type {
  Pain,
  PeopleBucket,
  HoursBucket,
  SpendBucket,
  MoneyRange,
} from './types';

// Loaded $/hr per pain → role doing the work (BLS base median × 1.43, doc 08).
//   reports   → marketing analyst/coord (13-1161) $37.00 → ≈$52.9
//   leads     → sales rep (41-4012)              $32.11 → ≈$45.9
//   invoices  → bookkeeping/acct clerk           $23.66 → ≈$33.8
//   copypaste → admin/ops assistant (43-6014)    $22.82 → ≈$32.6
//   admin     → admin/ops assistant              $22.82 → ≈$32.6
//   data      → admin/ops assistant              $22.82 → ≈$32.6
export const LOADED_RATE: Record<Pain, number> = {
  reports: 52.9,
  leads: 45.9,
  invoices: 33.8,
  copypaste: 32.6,
  admin: 32.6,
  data: 32.6,
};

// Bucket midpoints — the point estimate. People touching the task each week.
export const PEOPLE_MID: Record<PeopleBucket, number> = {
  p1: 1,
  p2_3: 2.5,
  p4_10: 6.5,
  p10plus: 12,
};

// Hours/week PER PERSON on the task (midpoints).
export const HOURS_MID: Record<HoursBucket, number> = {
  h_lt5: 3.5,
  h5_15: 10,
  h15_40: 22,
  h40plus: 42,
};

// Monthly tool spend → annual USD range (context, not the headline bleed).
export const SPEND_ANNUAL: Record<SpendBucket, [number, number]> = {
  s_lt100: [0, 1200],
  s100_500: [1200, 6000],
  s500_2k: [6000, 24000],
  s2kplus: [24000, 48000],
};

const WEEKS = 52;
const BAND = 0.4; // ±40% credible band around the midpoint
const round100 = (n: number) => Math.round(n / 100) * 100;

export interface LaborBleed {
  mid: number; // headline ≈ figure
  low: number; // mid × 0.6
  high: number; // mid × 1.4
}

// Annual labor bleed. Point estimate from midpoints × loaded rate, plus a band.
export function computeLaborBleed(
  pain: Pain,
  people: PeopleBucket,
  hours: HoursBucket,
): LaborBleed {
  const rate = LOADED_RATE[pain];
  const mid = PEOPLE_MID[people] * HOURS_MID[hours] * WEEKS * rate;
  return {
    mid: round100(mid),
    low: round100(mid * (1 - BAND)),
    high: round100(mid * (1 + BAND)),
  };
}

export function computeSaasSpend(spend: SpendBucket): MoneyRange {
  const [low, high] = SPEND_ANNUAL[spend];
  return { low, high };
}
