// ROI diagnostic — costing model. Numbers traced to docs/roi-diagnostic/08-costing-model.md.
// Honesty rule: labor = FIRM (BLS OEWS May 2024 base median × loaded multiplier).
// Headline is a single ≈ midpoint + a ±40% band shown as fine print; exact = paid audit.
// Multi-area: blended loaded rate (worst weighted ×2). Volume (Q10) is narrative
// color only — NOT summed into the headline (the per-unit cost overlaps labor).

import type {
  Pain,
  PeopleBucket,
  HoursBucket,
  SpendBucket,
  MoneyRange,
  AreaSplit,
} from './types';

// Loaded $/hr per pain → role doing the work (BLS base median × 1.43, doc 08).
export const LOADED_RATE: Record<Pain, number> = {
  reports: 52.9,
  leads: 45.9,
  invoices: 33.8,
  copypaste: 32.6,
  admin: 32.6,
  data: 32.6,
};

// Bucket midpoints — the point estimate.
export const PEOPLE_MID: Record<PeopleBucket, number> = {
  p1: 1,
  p2_3: 2.5,
  p4_10: 6.5,
  p10plus: 12,
};

// Hours/week PER PERSON on this manual work (across the selected areas).
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
const BAND = 0.4; // ±40% credible band
const PRODUCTIVE_HOURS_YEAR = 1800; // ≈ FTE productive hours (2080 − PTO/overhead)
const round100 = (n: number) => Math.round(n / 100) * 100;

// Blended loaded rate across the selected areas; the WORST area is weighted ×2
// (it dominates the prospect's pain, so it should dominate the rate).
export function blendedRate(areas: Pain[], worst: Pain): number {
  if (areas.length === 0) return LOADED_RATE[worst];
  let sum = 0;
  let weight = 0;
  for (const p of areas) {
    const w = p === worst ? 2 : 1;
    sum += LOADED_RATE[p] * w;
    weight += w;
  }
  // If worst somehow not in areas, still count it.
  if (!areas.includes(worst)) {
    sum += LOADED_RATE[worst] * 2;
    weight += 2;
  }
  return sum / weight;
}

export interface LaborBleed {
  mid: number;
  low: number;
  high: number;
  rate: number;
}

export function computeLaborBleed(
  areas: Pain[],
  worst: Pain,
  people: PeopleBucket,
  hours: HoursBucket,
): LaborBleed {
  const rate = blendedRate(areas, worst);
  const mid = PEOPLE_MID[people] * HOURS_MID[hours] * WEEKS * rate;
  return {
    rate: Math.round(rate * 10) / 10,
    mid: round100(mid),
    low: round100(mid * (1 - BAND)),
    high: round100(mid * (1 + BAND)),
  };
}

// Distribute the headline across areas by rate-weight (worst weighted ×2),
// ordered descending = the priority order ("what to automate first").
export function computeSplits(mid: number, areas: Pain[], worst: Pain): AreaSplit[] {
  const weights = areas.map((p) => ({ pain: p, w: (p === worst ? 2 : 1) * LOADED_RATE[p] }));
  const total = weights.reduce((s, x) => s + x.w, 0) || 1;
  return weights
    .map(({ pain, w }) => ({ pain, amount: round100((mid * w) / total) }))
    .sort((a, b) => b.amount - a.amount);
}

// Hours/year sunk + full-time-equivalent — the non-invasive "hits harder" stat.
export function computeEquivalent(people: PeopleBucket, hours: HoursBucket) {
  const hoursPerYear = Math.round(PEOPLE_MID[people] * HOURS_MID[hours] * WEEKS);
  const fullTimers = Math.round((hoursPerYear / PRODUCTIVE_HOURS_YEAR) * 10) / 10;
  return { hoursPerYear, fullTimers };
}

export function computeSaasSpend(spend: SpendBucket): MoneyRange {
  const [low, high] = SPEND_ANNUAL[spend];
  return { low, high };
}
