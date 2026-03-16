import { describe, it, expect, vi, beforeEach } from 'vitest';

// ──────────────────────────────────────────────
//  Unit tests — subscribe Netlify function
//  (Tests the validation logic only — Resend and
//   Turnstile calls are mocked)
// ──────────────────────────────────────────────

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Dynamic import so env vars can be set before
async function loadHandler(env: Record<string, string> = {}) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) process.env[k] = v;
  const mod = await import('../../netlify/functions/subscribe');
  return mod.handler;
}

function makeEvent(body: unknown, method = 'POST') {
  return {
    httpMethod: method,
    body: JSON.stringify(body),
    headers: { 'x-forwarded-for': '1.2.3.4' },
  } as any;
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default Turnstile success
  mockFetch.mockResolvedValue({
    json: async () => ({ success: true }),
    ok: true,
  });
  // Clear env
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET;
  delete process.env.RESEND_AUDIENCE_ID;
  delete process.env.NOTIFY_EMAIL;
});

describe('subscribe handler — HTTP method guard', () => {
  it('returns 405 for GET', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({}, 'GET'), {} as any, () => {});
    expect(res?.statusCode).toBe(405);
  });

  it('returns 204 for OPTIONS (CORS preflight)', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({}, 'OPTIONS'), {} as any, () => {});
    expect(res?.statusCode).toBe(204);
  });
});

describe('subscribe handler — input validation', () => {
  it('returns 422 for missing email', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({ email: '' }), {} as any, () => {});
    expect(res?.statusCode).toBe(422);
    expect(JSON.parse(res?.body ?? '{}')).toMatchObject({ error: 'Invalid email address' });
  });

  it('returns 422 for malformed email', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({ email: 'notanemail' }), {} as any, () => {});
    expect(res?.statusCode).toBe(422);
  });

  it('returns 422 for email without domain', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({ email: 'test@' }), {} as any, () => {});
    expect(res?.statusCode).toBe(422);
  });

  it('accepts a valid email', async () => {
    const handler = await loadHandler();
    const res = await handler(makeEvent({ email: 'test@example.com', token: '' }), {} as any, () => {});
    // Without RESEND_API_KEY it skips sending but should succeed
    expect(res?.statusCode).toBe(200);
    expect(JSON.parse(res?.body ?? '{}')).toMatchObject({ success: true });
  });
});

describe('subscribe handler — Turnstile verification', () => {
  it('returns 422 when Turnstile fails', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
      ok: false,
    });
    const handler = await loadHandler({ TURNSTILE_SECRET: 'secret123' });
    const res = await handler(makeEvent({ email: 'ok@ok.com', token: 'bad' }), {} as any, () => {});
    expect(res?.statusCode).toBe(422);
    expect(JSON.parse(res?.body ?? '{}')).toMatchObject({ error: 'Bot verification failed' });
  });

  it('skips Turnstile when no secret is set', async () => {
    const handler = await loadHandler();
    // fetch should NOT be called for Turnstile, only for Resend (but Resend also skipped without key)
    const res = await handler(makeEvent({ email: 'ok@ok.com', token: '' }), {} as any, () => {});
    expect(res?.statusCode).toBe(200);
  });
});

describe('subscribe handler — bad JSON body', () => {
  it('returns 400 for invalid JSON', async () => {
    const handler = await loadHandler();
    const event = { httpMethod: 'POST', body: '{not json}', headers: {} } as any;
    const res = await handler(event, {} as any, () => {});
    expect(res?.statusCode).toBe(400);
  });
});
