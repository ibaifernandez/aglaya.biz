import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://d1d3347073dadf16d4c7d7625ee28190@o4511058994724864.ingest.us.sentry.io/4511058996101120',
  sendDefaultPii: true,
  enableLogs: true,
  // Capture 100% of errors, 10% of performance traces
  tracesSampleRate: 0.1,
  // Only send in production
  enabled: import.meta.env.PROD,
  beforeSend(event, hint) {
    const err = hint?.originalException;
    // Filter out Cloudflare Turnstile widget errors — these are third-party
    // noise (hostname mismatch on crawlers, challenge expiry) and not actionable.
    if (err && typeof err === 'object' && 'name' in err && err.name === 'TurnstileError') {
      return null;
    }
    if (err && typeof err === 'string' && err.includes('[Cloudflare Turnstile]')) {
      return null;
    }
    return event;
  },
});
