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

/**
 * T2 · the problem: three pairs, problem → way out — reference
 * `docs/design/portada-nueva/t2-selector.html`, minus its fourth pair
 * («Your data teaches them»), which Ibai dropped on 2026-10-06 (card 544e2a13):
 * an AI system always sends something to a model, so «your data stays home»
 * could not be kept. Pair 1's way out, its paragraph and its drawing's label
 * come from `docs/design/portada-nueva/t2-anim1-tetris.html` (agreed with Ibai
 * on 2026-10-04).
 */
export const problem = {
  eyebrow: 'Where most companies get stuck',
  title: 'Everyone talks about AI.',
  titleEm: 'Nobody tells you where to start.',
  /** Name of the selector (the tablist); mock-up `aria-label` of `.tabs`. */
  tabsLabel: 'Where companies get stuck',
  /**
   * The stage's name while pair 1 is on it: the Tetris mock-up's canvas label,
   * followed by the words its last frame shows (mock-up `TX.en`), so the still
   * frame reads the same to a screen reader as it does on screen.
   */
  tetrisLabel:
    'Before: AI tools fall faster and faster onto your company, piling up with gaps until they overflow. After: we start from your real needs, the gaps, and each one gets the piece that fits; the rows complete and clear. The right systems, made for you. Start from your actual needs and let your company grow solid.',
  /**
   * The stage's name while pair 2 is on it — «the heat map of your week»
   * (docs/design/portada-nueva/t2-anim2-heatmap.html). Not the mock-up's canvas
   * label, which describes an earlier version of the drawing: this one, set
   * word for word on card 6e837be0, says what the timeline shows and ends on
   * the words its last frame stands on.
   */
  heatmapLabel:
    "Before: the monthly AI bill keeps growing, most licences go unused, and the team's trust in AI drops. After: the week's lost hours by department; one AI system on each hot spot until it cools down, licences go to zero and trust rises. Start where it pays, then grow from what works.",
  /**
   * The stage's name while pair 3 is on it — «the plugs»
   * (docs/design/portada-nueva/t2-anim3-plugs.html): the mock-up's canvas
   * label, word for word, which already ends on the words its last frame shows.
   */
  plugsLabel:
    "Before: each of your company's processes runs plugged into an outside vendor you rent from; one by one the vendor is acquired, shuts down, changes its terms or its plan, pulls the plug, and the process stops. After: your company brings it inside and builds one system per process, a digital asset of its own; the same notices land on the roof and nothing stops. Built for you, yours to keep. No more rent: what we build becomes your company's asset.",
  pairs: [
    {
      n: 'Problem 1 of 3',
      problem: 'A new AI tool every week',
      problemText: 'Chatbots, copilots, agents, automations. Everyone is selling one, and everyone says theirs is the one you need.',
      solution: 'We make the system fit the need',
      solutionText:
        'Stop bending off-the-shelf tools to fit your company. We sit with each department, find what actually needs solving, and build each need a system made for it.',
    },
    {
      n: 'Problem 2 of 3',
      problem: 'Buying at random',
      problemText: "Licences nobody uses, data in places it shouldn't be, and a team that stops trusting AI before it does anything useful.",
      solution: 'Start where it pays',
      solutionText: 'We find where your team loses the most hours, put AI right there first and grow from what works.',
    },
    {
      n: 'Problem 3 of 3',
      problem: 'Rented tools',
      problemText: 'Most companies run on a dozen tools they rent. When the contract ends, the work those tools did for you leaves with them.',
      solution: 'Built for you, yours to keep',
      solutionText: 'What we build runs on systems your company controls. When we leave the room, everything keeps running.',
    },
  ],
} as const;
