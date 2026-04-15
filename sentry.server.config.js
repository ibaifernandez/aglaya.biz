import * as Sentry from '@sentry/astro';

const dsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN || '';

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.CONTEXT || process.env.NODE_ENV || 'production',
    release: process.env.PUBLIC_SENTRY_RELEASE || process.env.COMMIT_REF || process.env.DEPLOY_ID,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.15 : 1.0,
  });
}
