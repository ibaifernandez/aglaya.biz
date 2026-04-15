import type { Handler } from '@netlify/functions';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLang(lang?: string): 'en' | 'es' | 'pt' {
  if (lang === 'es' || lang === 'pt') return lang;
  return 'en';
}

function extractIp(event: Parameters<Handler>[0]): string {
  const rawIp = event.headers['x-forwarded-for'] ?? event.headers['x-nf-client-connection-ip'] ?? '';
  return rawIp.split(',')[0].trim();
}

async function subscribeViaMailerLite(email: string, ip: string): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY ?? '';
  const groupId = process.env.MAILERLITE_GROUP_ID ?? '';

  if (!apiKey || !groupId) {
    return false;
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      groups: [groupId],
      resubscribe: true,
      ip_address: ip || undefined,
      optin_ip: ip || undefined,
      opted_in_at: now,
      subscribed_at: now,
    }),
  });

  if (!response.ok) {
    console.error('[dispatch-subscribe] MailerLite error:', response.status, await response.text());
    return false;
  }

  return true;
}

async function notifyFallback(email: string, lang: 'en' | 'es' | 'pt'): Promise<boolean> {
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
      subject: `Dispatch signup [${lang.toUpperCase()}]: ${email}`,
      html: `
        <h2>Footer dispatch signup</h2>
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

  let body: { email?: string; lang?: string; company?: string };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const honeypot = (body.company ?? '').trim();
  const lang = normalizeLang(body.lang);

  if (honeypot) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (!email || !isValidEmail(email)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Invalid email' }) };
  }

  const ip = extractIp(event);

  try {
    const mailerLiteCaptured = await subscribeViaMailerLite(email, ip);
    if (mailerLiteCaptured) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode: 'mailerlite' }) };
    }

    const fallbackCaptured = await notifyFallback(email, lang);
    if (fallbackCaptured) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, mode: 'fallback' }) };
    }
  } catch (error) {
    console.error('[dispatch-subscribe] Unexpected error:', error);
  }

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: 'Failed to capture subscription' }),
  };
};
