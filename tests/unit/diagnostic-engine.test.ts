import { describe, it, expect } from 'vitest';
import { computeDiagnostic, computeTier, tierToIcpStatus } from '../../src/lib/diagnostic/engine';
import {
  computeLaborBleed,
  blendedRate,
  computeSplits,
  computeEquivalent,
  LOADED_RATE,
  PEOPLE_MID,
  HOURS_MID,
} from '../../src/lib/diagnostic/costing';
import type { DiagnosticAnswers } from '../../src/lib/diagnostic/types';

const base: DiagnosticAnswers = {
  areas: ['invoices', 'admin'],
  worst: 'invoices',
  people: 'p2_3',
  hours: 'h5_15',
  tool: 'spreadsheet',
  frequency: 'weekly',
  team: 't2_10',
  spend: 's500_2k',
  tried: 'zapier',
  volume: 'v2',
};

describe('blendedRate', () => {
  it('weights the worst area ×2', () => {
    // invoices 33.8 (×2) + admin 32.6 (×1) → (67.6 + 32.6) / 3
    expect(blendedRate(['invoices', 'admin'], 'invoices')).toBeCloseTo((33.8 * 2 + 32.6) / 3, 5);
  });
  it('single area = that rate', () => {
    expect(blendedRate(['reports'], 'reports')).toBeCloseTo(LOADED_RATE.reports, 5);
  });
});

describe('computeLaborBleed', () => {
  it('mid = people × hours × 52 × blended rate, with ±40% band', () => {
    const r = computeLaborBleed(['invoices', 'admin'], 'invoices', 'p2_3', 'h5_15');
    const rate = blendedRate(['invoices', 'admin'], 'invoices');
    const expectedMid = Math.round((PEOPLE_MID.p2_3 * HOURS_MID.h5_15 * 52 * rate) / 100) * 100;
    expect(r.mid).toBe(expectedMid);
    expect(r.low).toBeLessThan(r.mid);
    expect(r.high).toBeGreaterThan(r.mid);
    expect(Math.abs(r.low - r.mid * 0.6)).toBeLessThan(100);
    expect(Math.abs(r.high - r.mid * 1.4)).toBeLessThan(100);
  });
});

describe('computeSplits', () => {
  it('sums to ~mid, orders desc, worst first', () => {
    const splits = computeSplits(100000, ['invoices', 'admin', 'reports'], 'reports');
    const sum = splits.reduce((s, x) => s + x.amount, 0);
    expect(Math.abs(sum - 100000)).toBeLessThan(splits.length * 100); // rounding slack
    for (let i = 1; i < splits.length; i++) expect(splits[i - 1].amount).toBeGreaterThanOrEqual(splits[i].amount);
    expect(splits[0].pain).toBe('reports'); // worst (×2) + highest rate
  });
});

describe('computeEquivalent', () => {
  it('hours/year and FTE from people × hours', () => {
    const e = computeEquivalent('p4_10', 'h15_40');
    expect(e.hoursPerYear).toBe(Math.round(PEOPLE_MID.p4_10 * HOURS_MID.h15_40 * 52));
    expect(e.fullTimers).toBeGreaterThan(0);
  });
});

describe('computeTier', () => {
  it('not_yet when solo + tiny spend', () => {
    expect(computeTier({ ...base, team: 't_solo', spend: 's_lt100' }, 999_999)).toBe('not_yet');
  });
  it('not_yet when bleed below floor', () => {
    expect(computeTier({ ...base, team: 't2_10', spend: 's2kplus' }, 5000)).toBe('not_yet');
  });
  it('qualified when scale + fundable + big bleed', () => {
    expect(computeTier({ ...base, team: 't11_50', spend: 's2kplus' }, 80_000)).toBe('qualified');
  });
  it('borderline when one gate soft', () => {
    expect(computeTier({ ...base, team: 't2_10', spend: 's100_500' }, 40_000)).toBe('borderline');
  });
});

describe('computeDiagnostic', () => {
  it('returns a full multi-area report', () => {
    const r = computeDiagnostic(base);
    expect(r.areas).toEqual(['invoices', 'admin']);
    expect(r.worst).toBe('invoices');
    expect(r.splits.length).toBe(2);
    expect(r.laborBleedMid).toBeGreaterThan(0);
    expect(r.laborBleed.high).toBeGreaterThan(r.laborBleed.low);
    expect(r.equivalent.hoursPerYear).toBeGreaterThan(0);
    expect(r.flags.patchwork).toBe(true); // tried = zapier
    expect(['qualified', 'borderline', 'not_yet']).toContain(r.tier);
  });

  it('patchwork flag set by tool OR by tried=zapier', () => {
    expect(computeDiagnostic({ ...base, tool: 'spreadsheet', tried: 'nothing' }).flags.patchwork).toBe(false);
    expect(computeDiagnostic({ ...base, tool: 'patchwork', tried: 'nothing' }).flags.patchwork).toBe(true);
    expect(computeDiagnostic({ ...base, tool: 'spreadsheet', tried: 'zapier' }).flags.patchwork).toBe(true);
  });

  it('big enterprise multi-area qualifies; tiny solo does not', () => {
    expect(
      computeDiagnostic({ ...base, areas: ['reports', 'leads'], worst: 'reports', people: 'p4_10', hours: 'h15_40', team: 't11_50', spend: 's2kplus' }).tier,
    ).toBe('qualified');
    expect(
      computeDiagnostic({ ...base, areas: ['admin'], worst: 'admin', people: 'p1', hours: 'h_lt5', team: 't_solo', spend: 's_lt100' }).tier,
    ).toBe('not_yet');
  });

  it('falls back to [worst] if areas empty', () => {
    const r = computeDiagnostic({ ...base, areas: [] });
    expect(r.areas).toEqual(['invoices']);
    expect(r.splits.length).toBe(1);
  });
});

describe('tierToIcpStatus', () => {
  it('maps tiers to the contact-funnel routing vocab', () => {
    expect(tierToIcpStatus('qualified')).toBe('QUALIFIED');
    expect(tierToIcpStatus('borderline')).toBe('BORDERLINE');
    expect(tierToIcpStatus('not_yet')).toBe('OPEN_CHANNEL');
  });
});
