import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dispatchSubscribe from '../../netlify/functions/dispatch-subscribe';

describe('dispatch-subscribe function', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.stubEnv('MAILERLITE_API_KEY', 'ml_test_123');
    vi.stubEnv('MAILERLITE_SUSCRIPCIONES_GROUP_ID', 'group_123');
    vi.stubEnv('RESEND_API_KEY', 're_test_123');
    vi.stubEnv('NOTIFY_EMAIL', 'info@aglaya.biz');
    vi.stubEnv('HCAPTCHA_SECRET', 'test_hcaptcha_secret');

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve('ok'),
    });
  });

  it('rejects non-POST methods', async () => {
    const result = await dispatchSubscribe.handler({ httpMethod: 'GET', headers: {} } as any, {} as any) as any;
    expect(result.statusCode).toBe(405);
  });

  it('validates the email address', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'nope', privacy_consent: true, token: 'test_token' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid email' });
  });

  it('accepts honeypot submissions without processing', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'john@example.com', company: 'spam', privacy_consent: true, token: 'test_token' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('requires privacy consent before processing', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'john@example.com', token: 'test_token' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Consent required' });
  });

  it('subscribes via MailerLite when configured', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ name: 'John', email: 'john@example.com', lang: 'en', token: 'test_token', privacy_consent: true }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true, mode: 'mailerlite' });
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://connect.mailerlite.com/api/subscribers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer ml_test_123',
        }),
      }),
    );

    const request = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[1]?.[1];
    const payload = JSON.parse(String(request?.body));
    expect(payload.groups).toEqual(['group_123']);
    expect(payload.fields).toEqual({ name: 'John' });

    const confirmationRequest = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[2]?.[1];
    const confirmationPayload = JSON.parse(String(confirmationRequest?.body));
    expect(confirmationPayload.to).toEqual(['john@example.com']);
    expect(confirmationPayload.bcc).toEqual(['info@aglaya.biz']);
    expect(confirmationPayload.subject).toBe('Dispatch confirmed — AGLAYA');
    expect(confirmationPayload.html).toContain("You're in.");
  });

  it('falls back to internal notification when MailerLite is unavailable', async () => {
    vi.stubEnv('MAILERLITE_API_KEY', '');
    vi.stubEnv('MAILERLITE_SUSCRIPCIONES_GROUP_ID', '');

    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ name: 'Juan', email: 'john@example.com', lang: 'es', token: 'test_token', privacy_consent: true }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true, mode: 'fallback' });
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('fails when the dispatch confirmation email cannot be sent', async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
        text: () => Promise.resolve('ok'),
      })
      .mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('resend error'),
      });

    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ name: 'John', email: 'john@example.com', lang: 'en', token: 'test_token', privacy_consent: true }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Failed to capture subscription' });
  });
});
