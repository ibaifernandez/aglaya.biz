import type { Handler } from '@netlify/functions';
import { getDispatchGroupId, upsertMailerLiteSubscriber } from './_mailerlite';
import { captureFunctionException, initFunctionSentry } from './_sentry';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLang(lang?: string): 'en' | 'es' | 'pt' {
  if (lang === 'es' || lang === 'pt') return lang;
  return 'en';
}

function hasAcceptedConsent(value?: string | boolean): boolean {
  return value === true || value === 'true' || value === 'on';
}

function extractIp(event: Parameters<Handler>[0]): string {
  const rawIp = event.headers['x-forwarded-for'] ?? event.headers['x-nf-client-connection-ip'] ?? '';
  return rawIp.split(',')[0].trim();
}

async function verifyHCaptcha(token: string, ip: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET ?? '';
  if (!secret) {
    console.warn('[dispatch-subscribe] HCAPTCHA_SECRET not set — skipping verification');
    return true;
  }

  const params: Record<string, string> = { secret, response: token };
  if (ip) params.remoteip = ip;

  const response = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  const data = (await response.json()) as { success: boolean };
  return data.success;
}

async function subscribeViaMailerLite(email: string, ip: string, lang: 'en' | 'es' | 'pt', name?: string): Promise<boolean> {
  return upsertMailerLiteSubscriber({
    email,
    ip,
    name,
    language: lang,
    groups: [getDispatchGroupId()],
  });
}

async function notifyFallback(email: string, lang: 'en' | 'es' | 'pt', name?: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  const notifyTo = process.env.NOTIFY_EMAIL ?? '';

  if (!apiKey || !notifyTo) {
    return false;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AGLAYA <info@aglaya.biz>',
      to: [notifyTo],
      subject: `Dispatch signup [${lang.toUpperCase()}]: ${name || email}`,
      html: `
        <h2>Footer dispatch signup</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Language:</strong> ${lang.toUpperCase()}</p>
        <p><strong>Source:</strong> Footer dispatch</p>
        <p>MailerLite was not available, so this signup should be routed manually.</p>
      `,
    }),
  });

  if (!response.ok) {
    console.error('[dispatch-subscribe] Resend fallback error:', response.status, await response.text());
    return false;
  }

  return true;
}

export const handler: Handler = async (event) => {
  initFunctionSentry();

  const headers = {
    'Access-Control-Allow-Origin': 'https://aglaya.biz',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: {
    email?: string;
    name?: string;
    lang?: string;
    company?: string;
    token?: string;
    privacy_consent?: string | boolean;
  };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const name = (body.name ?? '').trim();
  const honeypot = (body.company ?? '').trim();
  const token = body.token ?? '';
  const privacyConsent = hasAcceptedConsent(body.privacy_consent);
  const lang = normalizeLang(body.lang);

  if (honeypot) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (!email || !isValidEmail(email)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  if (!privacyConsent) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Consent required' }) };
  }

  const ip = extractIp(event);
  const captchaOk = await verifyHCaptcha(token, ip);

  if (!captchaOk) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Bot verification failed' }) };
  }

  try {
    let mode: 'mailerlite' | 'fallback' | null = null;
    const mailerLiteCaptured = await subscribeViaMailerLite(email, ip, lang, name);
    if (mailerLiteCaptured) {
      mode = 'mailerlite';
    }

    if (!mode) {
      const fallbackCaptured = await notifyFallback(email, lang, name);
      if (fallbackCaptured) {
        mode = 'fallback';
      }
    }

    if (!mode) {
      throw new Error('Failed to capture subscription');
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode }) };
  } catch (error) {
    console.error('[dispatch-subscribe] Unexpected error:', error);
    await captureFunctionException(error, {
      functionName: 'dispatch-subscribe',
      tags: {
        stage: 'subscription-flow',
      },
      extra: {
        has_name: Boolean(name),
        language: lang,
        mailerlite_group_configured: Boolean(getDispatchGroupId()),
      },
    });
  }

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: 'Failed to capture subscription' }),
  };
};
