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

export type Tier = 'qualified' | 'borderline' | 'not_yet';

export interface DiagnosticAnswers {
  pain: Pain;
  people: PeopleBucket;
  hours: HoursBucket;
  tool: ToolBucket;
  team: TeamBucket;
  spend: SpendBucket;
}

export interface MoneyRange {
  low: number;
  high: number;
}

export interface DiagnosticReport {
  pain: Pain;
  tier: Tier;
  laborBleedMid: number; // annual USD — the headline ≈ figure (BLS-firm)
  laborBleed: MoneyRange; // ±40% credible band around the midpoint
  saasSpend: MoneyRange; // annual USD — secondary context
  loadedRate: number; // loaded $/hr used (doc 08)
  assumptions: {
    people: number; // midpoint people count
    hours: number; // midpoint hours/person/week
    loadedRate: number;
  };
  flags: {
    patchwork: boolean; // Q4 = "patchwork I babysit" → Frankenstein wedge
  };
}
