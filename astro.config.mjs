// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';

const sentryDsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN;
const hasSentrySourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

// https://astro.build/config
export default defineConfig({
  site: 'https://aglaya.biz',
  adapter: netlify(),
  integrations: [
    sitemap(),
    sentry({
      enabled: {
        client: false,
        server: Boolean(sentryDsn),
      },
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        disable: !hasSentrySourceMaps,
      },
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
