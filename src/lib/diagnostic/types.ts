// ROI diagnostic — shared types (browser + Netlify function safe; no node deps).

export type Pain =
  | 'reports'
  | 'leads'
  | 'invoices'
  | 'copypaste'
  | 'admin'
  | 'data';

export type PeopleBucket = 'p1' | 'p2_3' | 'p4_10' | 'p10plus';
export type HoursBucket = 'h_lt5' | 'h5_15' | 'h15_40' | 'h40plus';
export type ToolBucket = 'none' | 'spreadsheet' | 'offshelf' | 'patchwork';
export type TeamBucket = 't_solo' | 't2_10' | 't11_50' | 't50plus';
export type SpendBucket = 's_lt100' | 's100_500' | 's500_2k' | 's2kplus';
export type FreqBucket = 'rarely' | 'monthly' | 'weekly' | 'constantly';
export type TriedBucket = 'nothing' | 'hired' | 'zapier' | 'tool';
export type VolumeBucket = 'v1' | 'v2' | 'v3' | 'v4';

export type Tier = 'qualified' | 'borderline' | 'not_yet';

export interface DiagnosticAnswers {
  areas: Pain[]; // multi-select (1-6) — Q1
  worst: Pain; // the primary pain — Q2 (auto = areas[0] if only one)
  people: PeopleBucket;
  hours: HoursBucket;
  tool: ToolBucket;
  frequency: FreqBucket;
  team: TeamBucket;
  spend: SpendBucket;
  tried: TriedBucket;
  volume: VolumeBucket; // operational volume of the WORST area (units per copy)
}

export interface MoneyRange {
  low: number;
  high: number;
}

export interface AreaSplit {
  pain: Pain;
  amount: number; // annual USD rough split (ordered desc = priority)
}

export interface DiagnosticReport {
  areas: Pain[];
  worst: Pain;
  tier: Tier;
  laborBleedMid: number; // annual USD — headline ≈ figure (BLS-firm)
  laborBleed: MoneyRange; // ±40% credible band
  blendedRate: number; // loaded $/hr blended across areas (worst weighted ×2)
  splits: AreaSplit[]; // per-area rough $, ordered desc (priority order)
  equivalent: { hoursPerYear: number; fullTimers: number }; // "hits harder", no money asked
  saasSpend: MoneyRange; // annual USD — secondary context
  assumptions: {
    people: number; // midpoint people
    hours: number; // midpoint hours/person/week
    blendedRate: number;
  };
  flags: {
    patchwork: boolean; // tool=patchwork OR tried=zapier → Frankenstein wedge
  };
  frequency: FreqBucket;
  tried: TriedBucket;
  volume: VolumeBucket;
}
