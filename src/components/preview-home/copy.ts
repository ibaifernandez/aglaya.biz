/**
 * Words of the new home page preview (`/preview/home/`), English only.
 *
 * First copied WORD FOR WORD from the reference mock-up committed at
 * `docs/design/portada-nueva/portada-aglaya.html`; T1's paragraph, T2's
 * paragraphs and all of T3 are since the grill of 2026-10-06 (card 82868b81). Kept here, inside the
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
  sub: 'We bring AI into your company: a few hours for a one-off task, one project when you need a specific system, or a whole stack when your company is ready for its next big step. We work with a team of AI agents under rules, audits and human control. Everything we build is yours, and designed to keep running without us.',
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
 * Emphasis inside a sentence, written the way the grill wrote it: `_italic_`
 * and `**bold**`. `rich()` cuts a string into the pieces Problem.astro renders
 * as <em> / <strong>; `plain()` is the same sentence with the marks gone, which
 * is what a reader (and a test) reads. Inter's real italic is served by the
 * design-tokens package, so the <em> is never a slanted fake.
 */
export type Piece = { text: string; em?: boolean; strong?: boolean };
const MARKS = /(\*\*[^*]+\*\*|_[^_]+_)/;
export function rich(s: string): Piece[] {
  return s
    .split(MARKS)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') ? { text: part.slice(2, -2), strong: true }
      : part.startsWith('_') ? { text: part.slice(1, -1), em: true }
      : { text: part },
    );
}
export const plain = (s: string) => rich(s).map((p) => p.text).join('');

/**
 * T2 · the problem: three pairs, problem → way out — reference
 * `docs/design/portada-nueva/t2-selector.html`, minus its fourth pair
 * («Your data teaches them»), which Ibai dropped on 2026-10-06 (card 544e2a13):
 * an AI system always sends something to a model, so «your data stays home»
 * could not be kept. The heading and every paragraph are the ones Ibai set
 * word for word in the commercial grill of 2026-10-06 (minutes b7d39088,
 * decisions 6–14; card 82868b81); the titles stay as the mock-ups have them.
 * `problemText` may carry emphasis marks: read it through `rich()` / `plain()`.
 */
export const problem = {
  eyebrow: 'Where most companies get stuck',
  title: 'Everyone sells you AI tools.',
  titleEm: 'Nobody starts from your company.',
  /** Name of the selector (the tablist); mock-up `aria-label` of `.tabs`. */
  tabsLabel: 'Where companies get stuck',
  /**
   * The stage's name while pair 1 is on it: the Tetris mock-up's canvas label,
   * followed by the words its last frame shows (mock-up `TX.en`), so the still
   * frame reads the same to a screen reader as it does on screen.
   */
  tetrisLabel:
    'Before: AI tools fall faster and faster onto your company, piling up with gaps until they overflow. After: we start from your real needs, the gaps, and each one gets a system built for it that fits in place. The right systems, made for you. Start from your real needs and let your company grow solid.',
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
      problemText: 'Chatbots, copilots, agents, automations. Each one promises to be _the one_ that matters. But the one that **actually** matters is your company.',
      solution: 'We make the system fit the need',
      solutionText:
        'Stop bending off-the-shelf tools to fit your company. We sit with each department, find what needs solving, and build each need a system made for it.',
    },
    {
      n: 'Problem 2 of 3',
      problem: 'Buying at random',
      problemText: 'Licences nobody uses, a bill that grows every month, and a team that stops trusting AI before it does anything useful.',
      solution: 'Start where it pays',
      solutionText: 'We find where your team loses the most hours and put AI right there first. Licences nobody uses go. Then we grow from what works.',
    },
    {
      n: 'Problem 3 of 3',
      problem: 'Rented tools',
      problemText: 'Your company runs on tools you rent. If the vendor is bought, shuts down or changes its terms, the work those tools did for you stops with them.',
      solution: 'Built for you, yours to keep',
      solutionText: "What we build runs on infrastructure your company controls. You don't pay us rent for it: it's an asset of your own.",
    },
  ],
} as const;

/**
 * T3 · what we've built — reference `docs/design/portada-nueva/t3-grid.html`
 * (the grill's sketch, sha256 11055de6…1f83415), its words set word for word in
 * the grill of 2026-10-06 (minutes b7d39088, decisions 15–23; card 82868b81).
 *
 * One wide card (the Orchestrator) and three pairs of short ones, one pair per
 * row: bring in (lead magnet + prospecting), follow up (CRM + automations),
 * operate (board + brand). The headline of each short card is the capability
 * sold; «Ours · …» names the tool of ours that proves it. «See how it works» is
 * not a link yet. `mini` is the little drawing on top of each card, decorative.
 */
export type Mini =
  | { kind: 'fleet' }
  | { kind: 'flow'; steps: readonly { text: string; red?: boolean }[] }
  | { kind: 'rows'; rows: readonly { text: string; green?: boolean }[] }
  | { kind: 'cols' }
  | { kind: 'swatches' };

export const built = {
  eyebrow: "What we've built",
  title: 'Built for us.',
  titleEm: 'Yours next.',
  lede: 'Every system we built to run AGLAYA, told as what it would do for your company.',
  depthWord: 'CAPABILITIES',
  more: 'See how it works',
  oursPrefix: 'Ours',
  wide: {
    title: 'Orchestrator',
    text: 'Our control room. It keeps one live map of every system we run and the rules between them, and it directs the AI agents that work on them: each with its role, its permissions and its audits, and a person who approves. Anyone can use AI. This is how a company is run on it.',
    mini: { kind: 'fleet' } as Mini,
  },
  rows: [
    [
      {
        ours: 'Scanner 21.719',
        title: 'A lead magnet that works',
        text: "A free tool that solves a small, real problem for your visitors. They get something useful. You get a lead who has already seen what you're good at.",
        mini: { kind: 'flow', steps: [{ text: 'Free tool' }, { text: 'Real result' }, { text: 'Qualified lead', red: true }] } as Mini,
      },
      {
        ours: 'Outreach',
        title: 'AI prospecting',
        text: 'It reads your data sources and tells your sales team who to write to, how, why and when, and whether one by one or as a campaign.',
        mini: { kind: 'rows', rows: [{ text: 'write today' }, { text: 'write today' }, { text: 'campaign', green: true }, { text: 'campaign', green: true }] } as Mini,
      },
    ],
    [
      {
        ours: 'CRM + consent log',
        title: 'A CRM of your own',
        text: 'Your customer base on infrastructure you control, with no fee per seat. And every contact carries a record of how and when they agreed to hear from you.',
        mini: { kind: 'rows', rows: [{ text: 'consent 12:04', green: true }, { text: 'consent 12:31', green: true }, { text: 'no consent' }, { text: 'consent 13:02', green: true }] } as Mini,
      },
      {
        ours: 'Automation panel',
        title: 'Automations in order',
        text: 'Your whole email machinery in one place: where each contact comes in, which automation it triggers, and a warning when your platform and your website stop matching. No more digging through your email platform to find out.',
        mini: { kind: 'flow', steps: [{ text: 'Signup' }, { text: 'Wait 2d', red: true }, { text: 'Email' }] } as Mini,
      },
    ],
    [
      {
        ours: 'Kanban Desk',
        title: 'One board for people and AI agents',
        text: 'Each task becomes a card that people and agents work on: organise, build, review, decide. Every step stays written on the card, so you always know who did what and why.',
        mini: { kind: 'cols' } as Mini,
      },
      {
        ours: 'Design System',
        title: 'One source for your brand',
        text: 'Your colours, type and voice in one place, read by every platform you run and by the AI agents that write for you. Change it once and every page follows.',
        mini: { kind: 'swatches' } as Mini,
      },
    ],
  ],
} as const;
