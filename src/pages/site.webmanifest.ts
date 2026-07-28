import type { APIRoute } from 'astro';
import { tokens } from '@aglaya/design-tokens';

/**
 * The web app manifest is JSON, so it cannot hold a CSS variable — but it does
 * hold two brand colours, and a literal there is a copy like any other. It was
 * `public/site.webmanifest`; it is now built from the package on every build.
 *
 * Same URL, same bytes, one fewer place for the red to drift.
 */
export const prerender = true;

const manifest = {
  name: 'AGLAYA',
  short_name: 'AGLAYA',
  description: 'The Uncomfortable Agency — Digital Marketing & Brand Strategy',
  start_url: '/',
  display: 'standalone',
  background_color: tokens['--color-surface'],
  theme_color: tokens['--color-brand'],
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
