// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import sentry from '@sentry/astro';
import tailwindcss from '@tailwindcss/vite';

import { HREFLANG, LOCALES, X_DEFAULT_PATH, alternatePathsFor } from './src/i18n/routes.ts';

const SITE = 'https://aglaya.biz';

const sentryDsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN;
const hasSentrySourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

// https://astro.build/config
// No adapter, on purpose. Every page is prerendered and the forms use
// netlify/functions/, so nothing needs Astro's server. The Netlify adapter would
// deploy a catch-all `ssr` function that only ever answers scanners' 404s, and
// each one counts against the account's function limit. Guarded by
// tests/unit/no-ssr-function.test.ts.
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // Every entry carries its own language equivalents. Without this the map
      // lists the addresses and stays silent about which of them are the same
      // page — each page said so on its own, and only to whoever fetched it.
      // The paths come from `src/i18n/routes.ts`, the same rule BaseLayout
      // renders into `<link rel="alternate">`, so there is one answer and not
      // two. `x-default` is repeated on every entry because that is what the
      // pages already declare; see the note in tests/e2e/sitemap-hreflang.spec.ts.
      serialize: (item) => ({
        ...item,
        links: [
          ...LOCALES.map((locale) => ({
            lang: HREFLANG[locale],
            url: new URL(alternatePathsFor(new URL(item.url).pathname)[locale], SITE).href,
          })),
          { lang: 'x-default', url: new URL(X_DEFAULT_PATH, SITE).href },
        ],
      }),
      filter: (page) => {
        const noindex = [
          // Proof index (redirects to /#proof)
          '/proof/', '/es/proof/',
          // Legacy proof entries (kept in repo but not published)
          '/proof/leben/', '/es/proof/leben/',
          '/proof/norden/', '/es/proof/norden/',
          '/proof/pocuro/', '/es/proof/pocuro/',
          // Legal/util pages — no SEO value
          '/privacy/', '/es/privacidad/',
          '/cookies/', '/es/cookies/',
          // Hidden preview of the new home page — noindex, linked only from its twin
          '/preview/home/', '/es/preview/home/',
        ];
        return !noindex.some(path => page.endsWith(path));
      },
    }),
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
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
