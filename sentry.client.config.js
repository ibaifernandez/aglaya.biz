import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: 'https://d1d3347073dadf16d4c7d7625ee28190@o4511058994724864.ingest.us.sentry.io/4511058996101120',
  sendDefaultPii: true,
  enableLogs: true,
  // Capture 100% of errors, 10% of performance traces
  tracesSampleRate: 0.1,
  // Only send in production
  enabled: import.meta.env.PROD,
});
