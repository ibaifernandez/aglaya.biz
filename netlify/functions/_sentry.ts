import * as Sentry from '@sentry/node';

const dsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN || '';
let initialized = false;

export function initFunctionSentry(): void {
  if (initialized || !dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.CONTEXT || process.env.NODE_ENV || 'production',
    release: process.env.PUBLIC_SENTRY_RELEASE || process.env.COMMIT_REF || process.env.DEPLOY_ID,
    sendDefaultPii: false,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.15 : 1.0,
  });

  initialized = true;
}

export async function captureFunctionException(
  error: unknown,
  context: {
    functionName: string;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
): Promise<void> {
  if (!dsn) return;

  initFunctionSentry();

  Sentry.withScope((scope) => {
    scope.setTag('netlify_function', context.functionName);

    for (const [key, value] of Object.entries(context.tags ?? {})) {
      scope.setTag(key, value);
    }

    for (const [key, value] of Object.entries(context.extra ?? {})) {
      scope.setExtra(key, value);
    }

    Sentry.captureException(error);
  });

  await Sentry.flush(2000);
}
