import { describe, it, expect } from 'vitest';
import {
  buildConsentFields,
  CONSENT_CONTRACT_VERSION,
} from '../../netlify/functions/_crm';

/**
 * The consent evidence_hash is a CROSS-PRODUCER contract (§3-bis): aglaya.biz,
 * Scanner 21.719, and the CRM must all compute the same digest from the same
 * inputs, or dedup-by-hash breaks. This golden value is computed independently
 * (sha256 of `email␟purpose␟legal_basis␟notice_version␟granted_at␟source`,
 * U+001F separator, prefixed `sha256:`). If a refactor changes it, the change
 * is a breaking contract violation — coordinate with the other two producers
 * before touching field order or separator.
 *
 * NOTE: `source` and `notice_version` feed the hash but are NOT stored fields —
 * the emitted record is exactly the §3-bis table.
 */
const GOLDEN_HASH =
  'sha256:2cd4541e9bba9bc3869518bac16103f5da6bb9657ad300921e0612e8affd23ca';

const GOLDEN_INPUT = {
  email: 'test@example.com',
  purpose: 'contacto',
  legalBasis: 'legitimate-interest' as const,
  source: 'aglayabiz-contact',
  noticeVersion: '2026-06-13',
  grantedAt: '2026-06-13T00:00:00.000Z',
};

describe('buildConsentFields', () => {
  it('computes the canonical cross-producer evidence_hash', () => {
    expect(buildConsentFields(GOLDEN_INPUT).evidence_hash).toBe(GOLDEN_HASH);
  });

  it('emits EXACTLY the §3-bis table fields (no source, no notice_version)', () => {
    const fields = buildConsentFields(GOLDEN_INPUT);
    expect(fields).toEqual({
      purpose: 'contacto',
      legal_basis: 'legitimate-interest',
      regime: 'cl-21719', // default
      channel: 'web-form', // default — NOT the producer source
      status: 'granted', // immutable on creation
      granted_at: '2026-06-13T00:00:00.000Z',
      evidence_hash: GOLDEN_HASH,
      consent_contract_version: CONSENT_CONTRACT_VERSION,
      subject_national_id: null, // default for anonymous web forms
    });
    // Hash inputs must not leak as stored fields.
    expect('source' in fields).toBe(false);
    expect('notice_version' in fields).toBe(false);
  });

  it('records legitimate interest verbatim (forms are NOT consent-based)', () => {
    expect(buildConsentFields(GOLDEN_INPUT).legal_basis).toBe('legitimate-interest');
  });

  it('honors explicit regime, channel, and national-id overrides', () => {
    const fields = buildConsentFields({
      ...GOLDEN_INPUT,
      regime: 'eu-gdpr',
      channel: 'double-opt-in',
      subjectNationalId: { value: '12.345.678-9', type: 'rut', country: 'CL' },
    });
    expect(fields.regime).toBe('eu-gdpr');
    expect(fields.channel).toBe('double-opt-in');
    expect(fields.subject_national_id).toEqual({ value: '12.345.678-9', type: 'rut', country: 'CL' });
  });

  it('changes the hash when any canonical field changes', () => {
    const base = buildConsentFields(GOLDEN_INPUT).evidence_hash;
    expect(buildConsentFields({ ...GOLDEN_INPUT, purpose: 'roi-audit' }).evidence_hash).not.toBe(base);
    expect(buildConsentFields({ ...GOLDEN_INPUT, email: 'other@example.com' }).evidence_hash).not.toBe(base);
    expect(buildConsentFields({ ...GOLDEN_INPUT, source: 'aglayabiz-roi-audit' }).evidence_hash).not.toBe(base);
  });

  it('does NOT fold regime/channel/national_id into the hash (not canonical fields)', () => {
    const base = buildConsentFields(GOLDEN_INPUT).evidence_hash;
    const altered = buildConsentFields({
      ...GOLDEN_INPUT,
      regime: 'eu-gdpr',
      channel: 'api',
      subjectNationalId: { value: 'X', type: 'nif', country: 'ES' },
    }).evidence_hash;
    expect(altered).toBe(base);
  });

  it('pins the consent contract version to 1.1.0', () => {
    expect(CONSENT_CONTRACT_VERSION).toBe('1.1.0');
  });
});

// SHARED cross-producer golden vector — frozen 2026-07-13. The SAME literal is
// asserted in Scanner (backend/tests/test_consent_ledger.py) and consent-ledger-wp
// (tests/seal-golden-test.php). GOLDEN_HASH above pins aglaya.biz's own path input;
// THIS pins the neutral vector shared by all three producers, so a drift in ANY
// nave's field order / separator / email normalization fails a test here too.
// Source of truth: legal-reg-tech/docs/contracts/IMPLEMENTS.md §"El sello".
// Do NOT edit the literal to make a red test pass — a mismatch = a producer diverged.
const SHARED_GOLDEN_HASH =
  'sha256:21d20c700ac844f5c02482bc758630bbac4384b89bd7088e7998bded903f9967';

const SHARED_GOLDEN_INPUT = {
  email: 'subject@example.com',
  purpose: 'scanner-ley-21719',
  legalBasis: 'consent' as const,
  noticeVersion: '2026-06-01',
  grantedAt: '2026-01-15T00:00:00Z',
  source: 'scanner21719-web',
};

describe('cross-producer evidence_hash', () => {
  it('matches the shared golden vector (Scanner + plugin PHP + aglaya.biz)', () => {
    expect(buildConsentFields(SHARED_GOLDEN_INPUT).evidence_hash).toBe(SHARED_GOLDEN_HASH);
  });
});
