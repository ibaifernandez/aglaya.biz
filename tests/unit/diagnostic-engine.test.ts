import { describe, it, expect } from 'vitest';
import { computeDiagnostic, computeTier, tierToIcpStatus } from '../../src/lib/diagnostic/engine';
import { computeLaborBleed, LOADED_RATE, PEOPLE_MID, HOURS_MID } from '../../src/lib/diagnostic/costing';
import type { DiagnosticAnswers } from '../../src/lib/diagnostic/types';

const base: DiagnosticAnswers = {
  pain: 'admin',
  people: 'p2_3',
  hours: 'h5_15',
  tool: 'spreadsheet',
  team: 't2_10',
  spend: 's500_2k',
};

describe('computeLaborBleed', () => {
  it('low < mid < high with a ±40% band', () => {
    const r = computeLaborBleed('admin', 'p2_3', 'h5_15');
    expect(r.low).toBeGreaterThan(0);
    expect(r.mid).toBeGreaterThan(r.low);
    expect(r.high).toBeGreaterThan(r.mid);
    // band is ±40% (within rounding to nearest $100)
    expect(Math.abs(r.low - r.mid * 0.6)).toBeLessThan(100);
    expect(Math.abs(r.high - r.mid * 1.4)).toBeLessThan(100);
  });

  it('midpoint = people × hours × 52 × loaded rate (rounded to $100)', () => {
    const r = computeLaborBleed('admin', 'p2_3', 'h5_15');
    const expected = PEOPLE_MID.p2_3 * HOURS_MID.h5_15 * 52 * LOADED_RATE.admin;
    expect(r.mid).toBe(Math.round(expected / 100) * 100);
  });

  it('reports uses the highest loaded rate (analyst role)', () => {
    const reports = computeLaborBleed('reports', 'p2_3', 'h5_15');
    const admin = computeLaborBleed('admin', 'p2_3', 'h5_15');
    expect(reports.mid).toBeGreaterThan(admin.mid);
  });
});

describe('computeTier', () => {
  it('not_yet when solo + tiny spend', () => {
    expect(computeTier({ ...base, team: 't_solo', spend: 's_lt100' }, 999_999)).toBe('not_yet');
  });

  it('not_yet when bleed below floor regardless of fundability', () => {
    expect(computeTier({ ...base, team: 't2_10', spend: 's2kplus' }, 5000)).toBe('not_yet');
  });

  it('qualified when scale + fundable + big bleed', () => {
    expect(computeTier({ ...base, team: 't11_50', spend: 's2kplus' }, 80_000)).toBe('qualified');
  });

  it('borderline when one gate soft (spend in mid band)', () => {
    expect(computeTier({ ...base, team: 't2_10', spend: 's100_500' }, 40_000)).toBe('borderline');
  });

  it('borderline when fundable + scale but bleed under the qualified bar', () => {
    expect(computeTier({ ...base, team: 't2_10', spend: 's2kplus' }, 40_000)).toBe('borderline');
  });
});

describe('computeDiagnostic', () => {
  it('returns a full report with midpoint, band and patchwork flag', () => {
    const r = computeDiagnostic({ ...base, tool: 'patchwork' });
    expect(r.laborBleedMid).toBeGreaterThan(0);
    expect(r.laborBleed.high).toBeGreaterThan(r.laborBleed.low);
    expect(r.flags.patchwork).toBe(true);
    expect(r.loadedRate).toBe(LOADED_RATE.admin);
    expect(['qualified', 'borderline', 'not_yet']).toContain(r.tier);
  });

  it('a big enterprise case qualifies and a tiny solo case does not', () => {
    const big = computeDiagnostic({
      pain: 'reports', people: 'p4_10', hours: 'h15_40', tool: 'patchwork', team: 't11_50', spend: 's2kplus',
    });
    expect(big.tier).toBe('qualified');
    const tiny = computeDiagnostic({
      pain: 'admin', people: 'p1', hours: 'h_lt5', tool: 'none', team: 't_solo', spend: 's_lt100',
    });
    expect(tiny.tier).toBe('not_yet');
  });

  it('non-patchwork tools clear the flag', () => {
    expect(computeDiagnostic({ ...base, tool: 'spreadsheet' }).flags.patchwork).toBe(false);
  });
});

describe('tierToIcpStatus', () => {
  it('maps tiers to the contact-funnel routing vocab', () => {
    expect(tierToIcpStatus('qualified')).toBe('QUALIFIED');
    expect(tierToIcpStatus('borderline')).toBe('BORDERLINE');
    expect(tierToIcpStatus('not_yet')).toBe('OPEN_CHANNEL');
  });
});
