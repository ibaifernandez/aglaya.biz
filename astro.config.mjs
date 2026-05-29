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
    sitemap({
      filter: (page) => {
        const noindex = [
          // Proof index (redirects to /#proof)
          '/proof/', '/es/proof/', '/pt/proof/',
          // Legacy proof entries (kept in repo but not published)
          '/proof/leben/', '/es/proof/leben/', '/pt/proof/leben/',
          '/proof/norden/', '/es/proof/norden/', '/pt/proof/norden/',
          '/proof/pocuro/', '/es/proof/pocuro/', '/pt/proof/pocuro/',
          // Legal/util pages — no SEO value
          '/privacy/', '/es/privacidad/', '/pt/privacidade/',
          '/cookies/', '/es/cookies/', '/pt/cookies/',
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
      // Source-map upload to Sentry must never fail the production deploy.
      // A failed or anomalous upload (network, auth, or sandbox limits on the
      // Netlify builder — invisible locally and in GitHub Actions, which lack
      // the SENTRY_* secrets) is logged and swallowed so the site still ships.
      unstable_sentryVitePluginOptions: {
        errorHandler: (err) => {
          console.warn(
            '[sentry] source map upload failed (non-fatal):',
            err?.message ?? err,
          );
        },
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
