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

function buildDispatchConfirmationHtml(name: string, lang: 'en' | 'es' | 'pt'): string {
  const copy = {
    en: {
      eyebrow: '// DISPATCH CONFIRMED',
      headline: "You're in.",
      greeting: name ? `${name},` : 'Signal received,',
      body1: 'Your address is now inside the AGLAYA dispatch.',
      body2: 'You will only hear from us when we publish a system, a field note, or a case study worth stealing from.',
      body3: 'No nurture sludge. No inbox theatre. Just high-signal releases.',
      footer: 'Operational dispatch active.',
    },
    es: {
      eyebrow: '// DISPATCH CONFIRMADO',
      headline: 'Ya estás dentro.',
      greeting: name ? `${name},` : 'Señal recibida,',
      body1: 'Tu dirección ya forma parte del dispatch de AGLAYA.',
      body2: 'Solo te escribiremos cuando publiquemos un sistema, una nota de campo o un caso de estudio que merezca la pena robar.',
      body3: 'Sin nurture sludge. Sin teatro de inbox. Solo releases de alta señal.',
      footer: 'Dispatch operativo activo.',
    },
    pt: {
      eyebrow: '// DISPATCH CONFIRMADO',
      headline: 'Você está dentro.',
      greeting: name ? `${name},` : 'Sinal recebido,',
      body1: 'Seu endereço agora faz parte do dispatch da AGLAYA.',
      body2: 'Só vamos escrever quando publicarmos um sistema, uma nota de campo ou um case que valha a pena roubar.',
      body3: 'Sem nurture sludge. Sem teatro de inbox. Apenas releases de alto sinal.',
      footer: 'Dispatch operacional ativo.',
    },
  }[lang];

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="background:#e8003d;height:3px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="background:#0d0d0d;padding:32px 40px 24px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#e8003d;">AGLAYA</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(245,245,245,.3);">Operational Dispatch</p>
        </td></tr>
        <tr><td style="background:#080808;padding:40px 40px 32px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:11px;color:#e8003d;letter-spacing:.2em;">${copy.eyebrow}</p>
          <h1 style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:32px;font-weight:900;line-height:1.05;color:#f5f5f5;letter-spacing:-.5px;">
            ${copy.headline}
          </h1>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:rgba(245,245,245,.6);">
            ${copy.greeting}<br><br>
            ${copy.body1}<br><br>
            ${copy.body2}<br><br>
            ${copy.body3}
          </p>
        </td></tr>
        <tr><td style="background:#080808;padding:24px 40px 32px;border-left:1px solid #1a1a1a;border-right:1px solid #1a1a1a;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:rgba(245,245,245,.25);">
            © AGLAYA ·
            <a href="https://aglaya.biz" style="color:#e8003d;text-decoration:none;">aglaya.biz</a>
          </p>
          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:rgba(245,245,245,.15);letter-spacing:.1em;">${copy.footer}</p>
        </td></tr>
        <tr><td style="background:#e8003d;height:3px;font-size:0;">&nbsp;</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
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

async function sendDispatchConfirmation(
  email: string,
  lang: 'en' | 'es' | 'pt',
  name?: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  const notifyTo = process.env.NOTIFY_EMAIL ?? 'info@aglaya.biz';

  if (!apiKey) {
    console.error('[dispatch-subscribe] RESEND_API_KEY not set');
    return false;
  }

  const normalizedName = name?.trim() ?? '';
  const subject =
    lang === 'es'
      ? 'Dispatch confirmado — AGLAYA'
      : lang === 'pt'
        ? 'Dispatch confirmado — AGLAYA'
        : 'Dispatch confirmed — AGLAYA';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AGLAYA <info@aglaya.biz>',
      to: [email],
      bcc: [notifyTo],
      subject,
      html: buildDispatchConfirmationHtml(normalizedName, lang),
    }),
  });

  if (!response.ok) {
    console.error('[dispatch-subscribe] Confirmation email error:', response.status, await response.text());
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

    const confirmationSent = await sendDispatchConfirmation(email, lang, name);
    if (!confirmationSent) {
      throw new Error('Failed to send dispatch confirmation');
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
