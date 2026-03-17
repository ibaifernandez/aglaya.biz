// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://aglaya.biz',
  adapter: netlify(),
  integrations: [
    sitemap(),
    sentry({
      dsn: 'https://d1d3347073dadf16d4c7d7625ee28190@o4511058994724864.ingest.us.sentry.io/4511058996101120',
      org: 'aglaya-s6',
      project: 'javascript-astro',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      // Only upload source maps in CI/production to avoid blocking local dev
      sourceMapsUploadOptions: {
        enabled: process.env.NETLIFY === 'true',
      },
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});