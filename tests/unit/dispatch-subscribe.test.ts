import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dispatchSubscribe from '../../netlify/functions/dispatch-subscribe';

describe('dispatch-subscribe function', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.stubEnv('MAILERLITE_API_KEY', 'ml_test_123');
    vi.stubEnv('MAILERLITE_GROUP_ID', 'group_123');
    vi.stubEnv('RESEND_API_KEY', 're_test_123');
    vi.stubEnv('NOTIFY_EMAIL', 'info@aglaya.biz');

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
      body: JSON.stringify({ email: 'nope' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid email' });
  });

  it('accepts honeypot submissions without processing', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'john@example.com', company: 'spam' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('subscribes via MailerLite when configured', async () => {
    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ email: 'john@example.com', lang: 'en' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true, mode: 'mailerlite' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://connect.mailerlite.com/api/subscribers',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer ml_test_123',
        }),
      }),
    );
  });

  it('falls back to internal notification when MailerLite is unavailable', async () => {
    vi.stubEnv('MAILERLITE_API_KEY', '');
    vi.stubEnv('MAILERLITE_GROUP_ID', '');

    const result = await dispatchSubscribe.handler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ email: 'john@example.com', lang: 'es' }),
    } as any, {} as any) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true, mode: 'fallback' });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });
});
