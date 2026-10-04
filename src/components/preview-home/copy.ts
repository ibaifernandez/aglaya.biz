/**
 * Words of the new home page preview (`/preview/home/`), English only.
 *
 * Copied WORD FOR WORD from the reference mock-up committed at
 * `docs/design/portada-nueva/portada-aglaya.html`. Kept here, inside the
 * preview folder, and not in `src/i18n/translations.ts`, on purpose: if the
 * preview is dropped, deleting this folder and its route leaves no trace. When
 * the page is promoted and gets its Spanish twin, these strings move into the
 * i18n system like every other page's.
 */

export const nav = {
  logo: 'AGLAYA',
  label: 'Main',
  links: [
    { href: '#built', text: "What we've built" },
    { href: '#orchestrator', text: 'The Orchestrator' },
    { href: '#work', text: 'How we work' },
  ],
  langCurrent: 'EN',
  langOther: 'ES',
  cta: { href: '#contact', text: 'Talk to us' },
} as const;

/** T1 · the hook. */
export const hook = {
  eyebrow: 'AI for companies that want to stay independent',
  title: 'The agency is dead. Long live the system.',
  lines: [
    { text: 'The agency', red: false },
    { text: 'is dead.', red: false },
    { text: 'Long live', red: true },
    { text: 'the system.', red: true },
  ],
  sub: "Want AI in your business but don't know where to start? We help you: one project, a few hours or a whole transformation. And when we're done, you don't depend on us.",
  ctas: [
    { href: '#contact', text: 'Talk to us', primary: true },
    { href: '#built', text: "See what we've built", primary: false },
  ],
} as const;

export const footer = {
  brand: 'AGLAYA',
  year: '© 2026',
  links: [
    { href: '/privacy/', text: 'Privacy' },
    { href: '/legal-notice/', text: 'Legal notice' },
    { href: '/cookies/', text: 'Cookies' },
  ],
} as const;
