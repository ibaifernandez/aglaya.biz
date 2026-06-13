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
 */
const GOLDEN_HASH =
  'sha256:ef211924195b28bf72161ed5489cf59e7b408b185a69e87db64ddaad0cc6918e';

const GOLDEN_INPUT = {
  email: 'test@example.com',
  purpose: 'commercial-contact',
  legalBasis: 'legitimate-interest' as const,
  source: 'aglayabiz-contact',
  noticeVersion: '2026-06-13',
  grantedAt: '2026-06-13T00:00:00.000Z',
};

describe('buildConsentFields', () => {
  it('computes the canonical cross-producer evidence_hash', () => {
    const fields = buildConsentFields(GOLDEN_INPUT);
    expect(fields.evidence_hash).toBe(GOLDEN_HASH);
  });

  it('emits the full §3-bis consent record shape with defaults', () => {
    const fields = buildConsentFields(GOLDEN_INPUT);
    expect(fields).toEqual({
      purpose: 'commercial-contact',
      legal_basis: 'legitimate-interest',
      regime: 'cl-21719', // default
      channel: 'aglayabiz-contact', // == source
      status: 'granted', // default
      granted_at: '2026-06-13T00:00:00.000Z',
      notice_version: '2026-06-13',
      evidence_hash: GOLDEN_HASH,
      consent_contract_version: CONSENT_CONTRACT_VERSION,
      subject_national_id: null, // default for anonymous web forms
    });
  });

  it('records legitimate interest verbatim (forms are NOT consent-based)', () => {
    const fields = buildConsentFields(GOLDEN_INPUT);
    expect(fields.legal_basis).toBe('legitimate-interest');
  });

  it('honors explicit regime, status, and national id overrides', () => {
    const fields = buildConsentFields({
      ...GOLDEN_INPUT,
      regime: 'eu-gdpr',
      status: 'withdrawn',
      subjectNationalId: '12.345.678-9',
    });
    expect(fields.regime).toBe('eu-gdpr');
    expect(fields.status).toBe('withdrawn');
    expect(fields.subject_national_id).toBe('12.345.678-9');
  });

  it('changes the hash when any canonical field changes', () => {
    const base = buildConsentFields(GOLDEN_INPUT).evidence_hash;
    const diffPurpose = buildConsentFields({ ...GOLDEN_INPUT, purpose: 'roi-audit' }).evidence_hash;
    const diffEmail = buildConsentFields({ ...GOLDEN_INPUT, email: 'other@example.com' }).evidence_hash;
    expect(diffPurpose).not.toBe(base);
    expect(diffEmail).not.toBe(base);
  });

  it('does NOT fold regime/status/national_id into the hash (not canonical fields)', () => {
    const base = buildConsentFields(GOLDEN_INPUT).evidence_hash;
    const altered = buildConsentFields({
      ...GOLDEN_INPUT,
      regime: 'eu-gdpr',
      status: 'withdrawn',
      subjectNationalId: '12.345.678-9',
    }).evidence_hash;
    expect(altered).toBe(base);
  });

  it('pins the consent contract version to 1.1.0', () => {
    expect(CONSENT_CONTRACT_VERSION).toBe('1.1.0');
  });
});
