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

/** T2 · the problem: four pairs, problem → way out. */
export const problem = {
  eyebrow: 'Where most companies get stuck',
  title: 'Everyone talks about AI.',
  titleEm: 'Nobody tells you where to start.',
  visualLabel:
    'Four scenes that go from chaos to order: AI buzzwords reduced to the three that fit; random licences turned into one bar that pays off first; rented tools brought inside a frame you own; data that stops flowing to other clouds and stays home.',
  pairs: [
    {
      n: 'Problem 1 of 4',
      problem: 'A new AI tool every week',
      problemText: 'Chatbots, copilots, agents, automations. Everyone is selling one, and everyone says theirs is the one you need.',
      solution: 'We tell you which ones matter',
      solutionText: "We test the tools so you don't have to, and bring you only the few that fit how you work.",
    },
    {
      n: 'Problem 2 of 4',
      problem: 'Buying at random',
      problemText: "Licences nobody uses, data in places it shouldn't be, and a team that stops trusting AI before it does anything useful.",
      solution: 'Start where it pays',
      solutionText: 'We find where your team loses the most hours, put AI right there first and grow from what works.',
    },
    {
      n: 'Problem 3 of 4',
      problem: 'Rented tools',
      problemText: 'Most companies run on a dozen tools they rent. When the contract ends, the work those tools did for you leaves with them.',
      solution: 'Built for you, yours to keep',
      solutionText: 'What we build runs on systems your company controls. When we leave the room, everything keeps running.',
    },
    {
      n: 'Problem 4 of 4',
      problem: 'Your data teaches them',
      problemText: "Every process you put on someone else's platform shows it how your business works. That knowledge stops being only yours.",
      solution: 'Your data stays home',
      solutionText: 'Your processes and your data live where you decide. What makes you different stays yours.',
    },
  ],
} as const;
