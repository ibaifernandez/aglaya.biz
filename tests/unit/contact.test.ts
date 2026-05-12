import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as contact from '../../netlify/functions/contact';

describe('contact function', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    
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
});
