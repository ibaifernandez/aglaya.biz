/**
 * WHERE THE SAME PAGE LIVES IN EVERY LANGUAGE.
 *
 * One rule, two consumers. `src/layouts/BaseLayout.astro` renders it as the
 * page's own `<link rel="alternate" hreflang>` tags; the sitemap integration in
 * `astro.config.mjs` writes it as `<xhtml:link>` inside each `<url>`. Before
 * this file existed only the first of those two spoke, and the map listed the
 * addresses without ever saying which of them were the same page — a search
 * engine had to fetch every page to find out.
 *
 * The two surfaces are compared against each other, built artefact against
 * built artefact, in `tests/e2e/sitemap-hreflang.spec.ts`. That comparison is
 * what keeps this from becoming a second truth: the moment the map and the page
 * disagree about one address, the suite goes red.
 *
 * The derivation is by PATH, not by prop. BaseLayout used to default a
 * non-English page's English twin to the home page whenever the page had not
 * been told otherwise, and three published pages were quietly shipping that
 * default — `/es/contact/` announced `https://aglaya.biz/` as its English
 * version. A rule that reads the path cannot forget.
 */

export const LOCALES = ['en', 'es', 'pt'] as const;
export type Locale = (typeof LOCALES)[number];

/** The hreflang value each locale is published under. Portuguese is served pt-BR. */
export const HREFLANG: Record<Locale, string> = { en: 'en', es: 'es', pt: 'pt-BR' };

/** Where a visitor lands when no published language matches theirs. */
export const X_DEFAULT_PATH = '/';

export type Alternates = Record<Locale, string>;

/**
 * Routes whose SLUG is translated, keyed by the English path. Everything else is
 * parallel — `/es<enPath>` and `/pt<enPath>` — and needs no entry here. Keep this
 * table and the files under `src/pages/` in step: a translated slug that is
 * missing here resolves to a path that does not exist.
 */
const TRANSLATED: Record<string, Alternates> = {
  '/privacy/': { en: '/privacy/', es: '/es/privacidad/', pt: '/pt/privacidade/' },
  '/legal-notice/': { en: '/legal-notice/', es: '/es/aviso-legal/', pt: '/pt/aviso-legal/' },
};

/** Reverse index: any localised path of a translated route back to its English path. */
const EN_PATH_OF: ReadonlyMap<string, string> = new Map(
  Object.entries(TRANSLATED).flatMap(([enPath, paths]) =>
    LOCALES.map((locale) => [paths[locale], enPath] as const),
  ),
);

/** Trailing slash in, query and hash out — the table is keyed on exactly one spelling. */
function normalise(pathname: string): string {
  const path = pathname.split('?')[0].split('#')[0];
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

/** The locale a path is served in, read off its first segment. */
export function localeOf(pathname: string): Locale {
  const [, first] = normalise(pathname).split('/');
  return (LOCALES as readonly string[]).includes(first) && first !== 'en'
    ? (first as Locale)
    : 'en';
}

function prefixed(locale: Locale, enPath: string): string {
  if (locale === 'en') return enPath;
  return enPath === '/' ? `/${locale}/` : `/${locale}${enPath}`;
}

/** The English path of whatever page this path serves. */
export function enPathOf(pathname: string): string {
  const path = normalise(pathname);
  const translated = EN_PATH_OF.get(path);
  if (translated) return translated;

  const locale = localeOf(path);
  if (locale === 'en') return path;

  const stripped = path.slice(`/${locale}`.length);
  return stripped === '' ? '/' : stripped;
}

/** Every language's path for the page this path serves, itself included. */
export function alternatePathsFor(pathname: string): Alternates {
  const enPath = enPathOf(pathname);
  const translated = TRANSLATED[enPath];
  if (translated) return { ...translated };

  return {
    en: enPath,
    es: prefixed('es', enPath),
    pt: prefixed('pt', enPath),
  };
}

/** The same, absolute against a site origin — what both hreflang surfaces emit. */
export function alternateUrlsFor(pathname: string, site: URL | string): Alternates {
  const paths = alternatePathsFor(pathname);
  return {
    en: new URL(paths.en, site).href,
    es: new URL(paths.es, site).href,
    pt: new URL(paths.pt, site).href,
  };
}
