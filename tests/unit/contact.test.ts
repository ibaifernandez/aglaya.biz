import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as contact from '../../netlify/functions/contact';

describe('contact function', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // Reset all stubbed env vars so prior tests don't leak (MailerLite/CRM
    // stubs in particular flip call counts in unrelated cases).
    vi.unstubAllEnvs();

    vi.stubEnv('RESEND_API_KEY', 're_test_123');
    vi.stubEnv('HCAPTCHA_SECRET', 'test_hcaptcha_secret');
    vi.stubEnv('NOTIFY_EMAIL', 'info@aglaya.biz');

    // Global fetch mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve('ok'),
    });
  });

  it('rejects non-POST methods', async () => {
    const result = await (contact.handler({ httpMethod: 'GET', headers: {} } as any, {} as any)) as any;
    expect(result.statusCode).toBe(405);
  });

  it('validates required fields', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'test@example.com', privacy_consent: true }) // missing message
    } as any, {} as any)) as any;
    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid input' });
  });

  it('requires privacy consent before processing', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({
        email: 'john@example.com',
        message: 'Hello AGLAYA',
        token: 'test_token',
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Consent required' });
  });

  it('accepts valid contact data', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello AGLAYA',
        token: 'test_token',
        privacy_consent: true,
      })
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('sends the internal notification in Portuguese when lang=pt', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'João',
        email: 'joao@example.com',
        message: 'Olá AGLAYA',
        token: 'test_token',
        lang: 'pt',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledTimes(2); // hcaptcha + internal notification

    const notifyRequest = fetchMock.mock.calls[1]?.[1];
    expect(notifyRequest).toBeTruthy();

    const notifyPayload = JSON.parse(String(notifyRequest?.body));
    expect(notifyPayload.subject).toBe('📩 New Contact [PT]: João');
    expect(notifyPayload.html).toContain('Language:</strong> PT');
    expect(notifyPayload.html).toContain('Name:</strong> João');
    expect(notifyPayload.html).toContain('joao@example.com');
  });

  it('sends ROI Audit-specific internal notification when inquiry_type is ROI_AUDIT_LEAD', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'AGLAYA',
        website: 'https://aglaya.biz',
        message: 'We need a serious ROI audit.',
        token: 'test_token',
        inquiry_type: 'ROI_AUDIT_LEAD',
        entry_point: 'roi_audit',
        service_interest: 'roi_audit',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    const notifyRequest = fetchMock.mock.calls[1]?.[1];
    const notifyPayload = JSON.parse(String(notifyRequest?.body));
    expect(notifyPayload.subject).toBe('📩 ROI Audit Request [EN]: AGLAYA');
    expect(notifyPayload.html).toContain('https://aglaya.biz');
    expect(notifyPayload.html).toContain('roi_audit');
    expect(notifyPayload.html).toContain('ROI_AUDIT_LEAD');
  });

  it('routes qualified contacts to the qualified MailerLite group when configured', async () => {
    vi.stubEnv('MAILERLITE_API_KEY', 'ml_test_123');
    vi.stubEnv('MAILERLITE_NO_CUALIFICADOS_GROUP_ID', 'group_non_qualified');
    vi.stubEnv('MAILERLITE_CUALIFICADOS_GROUP_ID', 'group_qualified');

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'AGLAYA',
        message: 'Hello AGLAYA',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_primary_state: 'qualified',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    expect(fetchMock).toHaveBeenCalledTimes(3); // hcaptcha + internal notification + mailerlite
    expect(fetchMock).toHaveBeenLastCalledWith(
      'https://connect.mailerlite.com/api/subscribers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer ml_test_123',
        }),
      }),
    );

    const mailerLiteRequest = fetchMock.mock.calls[2]?.[1];
    const mailerLitePayload = JSON.parse(String(mailerLiteRequest?.body));
    expect(mailerLitePayload.groups).toEqual(['group_qualified']);
    expect(mailerLitePayload.fields).toEqual({
      name: 'John Doe',
      company: 'AGLAYA',
    });
  });

  it('routes blocked contacts to the non-qualified MailerLite group when configured', async () => {
    vi.stubEnv('MAILERLITE_API_KEY', 'ml_test_123');
    vi.stubEnv('MAILERLITE_NO_CUALIFICADOS_GROUP_ID', 'group_non_qualified');
    vi.stubEnv('MAILERLITE_BORDERLINE_GROUP_ID', 'group_borderline');
    vi.stubEnv('MAILERLITE_CUALIFICADOS_GROUP_ID', 'group_qualified');

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'AGLAYA',
        message: 'Hello AGLAYA',
        token: 'test_token',
        icp_status: 'OPEN_CHANNEL',
        icp_primary_state: 'blocked_data',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    const mailerLiteRequest = fetchMock.mock.calls[2]?.[1];
    const mailerLitePayload = JSON.parse(String(mailerLiteRequest?.body));
    expect(mailerLitePayload.groups).toEqual(['group_non_qualified']);
  });

  it('verifies hcaptcha and fails on bad token', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: false })
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'john@example.com',
        message: 'Hi',
        token: 'bad',
        privacy_consent: true,
      })
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body).error).toBe('Bot verification failed');
  });

  /* ── CRM dispatch ─────────────────────────────────── */

  it('skips CRM dispatch when CRM_API_KEY or CRM_LEADS_CAPTURE_URL is missing', async () => {
    // No CRM env stubbed; both vars absent.
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'Jane',
        email: 'jane@example.com',
        message: 'Quiero un audit',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_primary_state: 'qualified',
        icp_signal_score: '82',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    // hcaptcha + internal notification only (no MailerLite, no CRM)
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('dispatches qualified leads to CRM with correct source, score, language, and notes', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/leads/capture')) {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              contact_id: 'contact_42',
              deal_id: 'deal_99',
              deal_path: '/deals/99',
              lead_score: 82,
              language: 'en',
            }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'Jane',
        email: 'jane@example.com',
        company: 'Acme',
        message: 'We want help.',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_primary_state: 'qualified',
        icp_signal_score: '82',
        manual_execution: '75',
        data_infrastructure: 'crm',
        growth_investment: 'between_15_40',
        lang: 'en',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    // hcaptcha + internal notification + CRM dispatch (no MailerLite, env not stubbed)
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const crmCall = fetchMock.mock.calls.find(([url]) =>
      typeof url === 'string' && url.includes('/leads/capture'),
    );
    expect(crmCall).toBeTruthy();
    const [crmUrl, crmInit] = crmCall as [string, RequestInit];
    expect(crmUrl).toBe('https://crm.example.test/api/v1/admin/crm/leads/capture');
    expect(crmInit.method).toBe('POST');
    expect((crmInit.headers as Record<string, string>)['X-CRM-API-Key']).toBe('crm_test_key');

    const crmPayload = JSON.parse(String(crmInit.body));
    expect(crmPayload.email).toBe('jane@example.com');
    expect(crmPayload.source).toBe('aglaya-form-qualified');
    expect(crmPayload.lead_score).toBe(82);
    expect(crmPayload.language).toBe('en');
    expect(crmPayload.name).toBe('Jane');
    expect(crmPayload.company).toBe('Acme');
    expect(crmPayload.notes).toContain('icp=qualified');
    expect(crmPayload.notes).toContain('score=82');
    expect(crmPayload.notes).toContain('data=crm');
    expect(crmPayload.notes).toContain('investment=between_15_40');
    expect(crmPayload.notes).toContain('manual=75');
    expect(crmPayload.notes).toContain('We want help.');
    // UTMs not implemented yet; payload sends nulls
    expect(crmPayload.utm_source).toBeNull();
    expect(crmPayload.fbclid).toBeNull();

    // Consent ficha (§3-bis) rides the same payload, sent FLAT (top-level),
    // matching Scanner's payload.update(consent). aglaya.biz runs on
    // legitimate interest; the ledger records that basis verbatim.
    expect(crmPayload.purpose).toBe('contacto');
    expect(crmPayload.legal_basis).toBe('legitimate-interest');
    expect(crmPayload.regime).toBe('cl-21719');
    expect(crmPayload.channel).toBe('web-form');
    expect(crmPayload.status).toBe('granted');
    expect(crmPayload.consent_contract_version).toBe('1.1.0');
    expect(crmPayload.evidence_hash).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(crmPayload.subject_national_id).toBeNull();
    // No nested object — flat only. Hash inputs are not stored fields.
    expect(crmPayload.consent).toBeUndefined();
    expect(crmPayload.notice_version).toBeUndefined();
  });

  it('tags ROI Audit leads with the roi-audit consent purpose and source', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    let consent: any;
    global.fetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (typeof url === 'string' && url.includes('/leads/capture') && init?.body) {
        consent = JSON.parse(String(init.body));
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ contact_id: 'c', deal_id: 'd' }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    await contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'roi@example.com',
        message: 'audit please',
        token: 'test_token',
        inquiry_type: 'ROI_AUDIT_LEAD',
        entry_point: 'roi_audit',
        service_interest: 'roi_audit',
        icp_status: 'QUALIFIED',
        icp_signal_score: '80',
        privacy_consent: true,
      }),
    } as any, {} as any);

    expect(consent).toBeTruthy();
    expect(consent.purpose).toBe('roi-audit');
    expect(consent.channel).toBe('web-form');
    // The consent producer-source feeds the hash but is NOT emitted, so the
    // §4 lead `source` survives the flat merge intact (no collision).
    expect(consent.source).toBe('aglaya-form-qualified');
  });

  it('maps BORDERLINE icp_status to aglaya-form-borderline source', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    let capturedSource: string | undefined;
    global.fetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (typeof url === 'string' && url.includes('/leads/capture') && init?.body) {
        capturedSource = JSON.parse(String(init.body)).source;
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ contact_id: 'c', deal_id: 'd', lead_score: 60, language: 'es' }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'bord@example.com',
        message: 'hola',
        token: 'test_token',
        icp_status: 'BORDERLINE',
        icp_signal_score: '60',
        lang: 'es',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
    expect(capturedSource).toBe('aglaya-form-borderline');
  });

  it('maps OPEN_CHANNEL and BLOCKED_* icp_status to aglaya-form-open-channel source', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    const sources: string[] = [];
    global.fetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (typeof url === 'string' && url.includes('/leads/capture') && init?.body) {
        sources.push(JSON.parse(String(init.body)).source);
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ contact_id: 'c', deal_id: 'd' }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    await contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'a@example.com',
        message: 'm',
        token: 'test_token',
        icp_status: 'OPEN_CHANNEL',
        privacy_consent: true,
      }),
    } as any, {} as any);

    await contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'b@example.com',
        message: 'm',
        token: 'test_token',
        icp_status: 'BLOCKED_INVESTMENT',
        privacy_consent: true,
      }),
    } as any, {} as any);

    expect(sources).toEqual(['aglaya-form-open-channel', 'aglaya-form-open-channel']);
  });

  it('treats CRM 201 with excluded:true as excluded and still returns 200 to the user', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/leads/capture')) {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              contact_id: null,
              deal_id: null,
              deal_path: null,
              lead_score: null,
              language: null,
              excluded: true,
            }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'ibai600+aglaya-form-smoke@gmail.com',
        message: 'smoke',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '80',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
  });

  it('treats CRM 201 with excluded:false AND deal_id:null as an anomaly (server bug), still returns 200', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/leads/capture')) {
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () =>
            Promise.resolve({
              contact_id: 42,
              deal_id: null,
              deal_path: null,
              lead_score: 80,
              language: 'en',
              excluded: false,
            }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'anomaly@example.com',
        message: 'm',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '80',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
  });

  it('treats CRM 422 as outcome=rejected (our bug, payload validation) and still returns 200 to the user', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/leads/capture')) {
        return Promise.resolve({
          ok: false,
          status: 422,
          json: () => Promise.resolve({ detail: 'Invalid payload' }),
          text: () => Promise.resolve('{"detail":"Invalid payload"}'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'rejected@example.com',
        message: 'm',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '80',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
  });

  it('still returns 200 to the user when CRM responds with 401/422/503', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/leads/capture')) {
        return Promise.resolve({
          ok: false,
          status: 503,
          json: () => Promise.resolve({}),
          text: () => Promise.resolve('Service Unavailable'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'jane@example.com',
        message: 'hi',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '90',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
  });

  it('still returns 500 to the user when Resend (canary) fails — CRM is a downstream sync, not a canary', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('api.resend.com')) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({}),
          text: () => Promise.resolve('Unauthorized'),
        });
      }
      // hcaptcha
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'jane@example.com',
        message: 'hi',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '90',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(500);
  });

  it('does not dispatch to CRM when icp_status is missing (e.g., general contact form)', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'general@example.com',
        message: 'no ICP context here',
        token: 'test_token',
        inquiry_type: 'GENERAL_LEAD',
        privacy_consent: true,
      }),
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);

    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    const crmCalls = fetchMock.mock.calls.filter(([url]) =>
      typeof url === 'string' && url.includes('/leads/capture'),
    );
    expect(crmCalls.length).toBe(0);
  });

  it('clamps lead_score above 100 down to 100 (defense in depth) before sending to CRM', async () => {
    vi.stubEnv('CRM_API_KEY', 'crm_test_key');
    vi.stubEnv('CRM_LEADS_CAPTURE_URL', 'https://crm.example.test/api/v1/admin/crm/leads/capture');

    let receivedScore: unknown;
    global.fetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (typeof url === 'string' && url.includes('/leads/capture') && init?.body) {
        receivedScore = JSON.parse(String(init.body)).lead_score;
        return Promise.resolve({
          ok: true,
          status: 201,
          json: () => Promise.resolve({ contact_id: 'c', deal_id: 'd' }),
          text: () => Promise.resolve('ok'),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      });
    });

    await contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        email: 'x@example.com',
        message: 'm',
        token: 'test_token',
        icp_status: 'QUALIFIED',
        icp_signal_score: '999',
        privacy_consent: true,
      }),
    } as any, {} as any);

    expect(receivedScore).toBe(100);
  });
});
