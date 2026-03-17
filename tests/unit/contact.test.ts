import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as contact from '../../netlify/functions/contact';

describe('contact function', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    
    vi.stubEnv('RESEND_API_KEY', 're_test_123');
    vi.stubEnv('TURNSTILE_SECRET', '0x_test_secret');
    vi.stubEnv('NOTIFY_EMAIL', 'info@aglaya.biz');

    // Global fetch mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
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
      body: JSON.stringify({ email: 'test@example.com' }) // missing message
    } as any, {} as any)) as any;
    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid input' });
  });

  it('accepts valid contact data', async () => {
    const result = await (contact.handler({
      httpMethod: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello AGLAYA',
        token: 'test_token'
      })
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalled();
  });

  it('verifies turnstile and fails on bad token', async () => {
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
        token: 'bad'
      })
    } as any, {} as any)) as any;

    expect(result.statusCode).toBe(422);
    expect(JSON.parse(result.body).error).toBe('Bot verification failed');
  });
});
