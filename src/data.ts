/* Example data. Nothing here is real; every surface is labelled EXAMPLE DATA. */
export const NOW_WEEK = 43;
export const WEEKS: Record<number, string> = {
  40: 'Sep 28 – Oct 4', 41: 'Oct 5 – 11', 42: 'Oct 12 – 18', 43: 'Oct 19 – 25'
};

/* Islands live on a 1600x1000 chart. The Shipped Continent owns x < 400. */
export type Src = 'Slack' | 'Zoom' | 'GitHub'
export type IslandKind = 'active' | 'overdue' | 'sinking'
export interface Island { id: string; name: string; src: Src; kind: IslandKind; x: number; y: number; r: number; born: number; age: number; note: string; quote: string; link: string; flare?: string; who?: string }
export const ISLANDS: Island[] = [
  { id: 'q4', name: 'Q4 roadmap review', src: 'Zoom', kind: 'overdue', x: 700, y: 380, r: 62, born: 41, age: 3,
    note: 'Promised in "Weekly sync" (Oct 20). Three people are waiting on the draft.', quote: '“I\'ll own the Q4 roadmap review.”', link: 'Zoom call “Weekly sync” (Oct 20)' },
  { id: 'tests', name: 'Update test plan', src: 'GitHub', kind: 'active', x: 650, y: 660, r: 40, born: 40, age: 2,
    note: 'Open PR, green checks, waiting on your last two comments.', quote: 'PR #EX-221 · 2 comments left', link: 'GitHub PR #EX-221' },
  { id: 'pr218', name: 'Review: PR #EX-218', src: 'GitHub', kind: 'active', flare: 'review requested', x: 1010, y: 560, r: 48, born: 40, age: 1,
    note: 'Teammate A flagged this one. A review has been requested for 6 hours.', quote: '“Can you take a look before standup?”', link: 'GitHub PR #EX-218' },
  { id: 'vendor', name: 'Reply re: vendor contract', src: 'Slack', kind: 'overdue', x: 880, y: 810, r: 54, born: 42, age: 4,
    note: 'A question has been drifting toward rough water for four days.', quote: '“Can you confirm the renewal terms by Friday?”', link: '#example-ops thread, asked by Teammate B' },
  { id: 'design', name: 'Design system', src: 'GitHub', kind: 'active', who: 'Teammate B', x: 790, y: 150, r: 46, born: 40, age: 6,
    note: 'Teammate B\'s island. You are a reviewer on the tokens migration.', quote: 'Shared with Teammate B', link: 'GitHub project “Design system”' },
  { id: 'billing', name: 'Billing migration', src: 'Slack', kind: 'active', who: 'Teammate A', x: 1050, y: 250, r: 54, born: 40, age: 8,
    note: 'Teammate A\'s island. Your API pagination work unblocked their first phase.', quote: 'Shared with Teammate A', link: '#example-backend' },
  { id: 'caching', name: 'Spike: caching', src: 'GitHub', kind: 'sinking', x: 1160, y: 720, r: 40, born: 42, age: 14,
    note: 'A spike nobody picked back up. Still useful? Rescue it or let it go.', quote: '“Spike: caching” · GitHub, 14d', link: 'GitHub issue #EX-190' },
  { id: 'notes', name: '“I\'ll send the notes”', src: 'Zoom', kind: 'sinking', x: 690, y: 905, r: 36, born: 41, age: 19,
    note: 'A small promise from a call, nineteen days ago.', quote: '“I\'ll send the notes.” · Zoom, 19d', link: 'Zoom call “Platform sync” (Oct 6)' },
  { id: 'followup', name: 'Follow up with Teammate C', src: 'Slack', kind: 'sinking', x: 1070, y: 900, r: 38, born: 40, age: 26,
    note: 'You said you would circle back about the on-call handoff.', quote: '“Let me circle back.” · Slack, 26d', link: '#example-oncall thread' }
];
export const ROUTES: [string, string][] = [['design', 'q4'], ['billing', 'pr218'], ['q4', 'tests'], ['pr218', 'vendor'], ['design', 'billing']];

export const SHIPPED = [
  { w: 40, t: 'Merged: Auth refactor', d: 'Replaced the legacy session store. 14 files, 2 reviewers.' },
  { w: 40, t: 'Closed: Onboarding doc', d: 'New-hire onboarding guide, now linked from the wiki.' },
  { w: 41, t: 'Merged: API pagination', d: 'Cursor-based pagination across 6 endpoints.' },
  { w: 41, t: 'Shipped: Q3 report draft', d: 'Draft delivered to Teammate B for review.' },
  { w: 42, t: 'Reviewed 6 PRs', d: 'Median review turnaround: 3 hours.' },
  { w: 42, t: 'Merged: Fix flaky tests', d: 'Quarantined and fixed 4 flaky integration tests.' },
  { w: 43, t: 'Closed: Bug #EX-12', d: 'Off-by-one in invoice rounding. Regression test added.' }
];
export const SHIPPED_COUNT: Record<number, number> = { 40: 6, 41: 9, 42: 8, 43: 11 };

export const VOYAGE: Record<number, string> = {
  40: 'A steady start. Auth refactor landed and the onboarding doc is out the door. Calm seas, nothing yet drifting.',
  41: 'Pagination shipped and the Q3 draft is with Teammate B. A promise from Monday\'s call is starting to drift.',
  42: 'Six reviews given and the flaky tests are tamed. A vendor question is waiting, and a spike has gone quiet.',
  43: 'Fair winds this week: 3 PRs merged and 6 reviews given. Storm gathering over the Q4 roadmap review. Three old promises are slipping under. Rescue one before they\'re lost to sea.'
};

export type CrewId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export interface Crew { name: string; role: string; bond: number; why: string; col: string; hat: string; it: [Src, string, string][] }
export const CREW: Record<CrewId, Crew> = {
  A: { name: 'Teammate A', role: 'First Mate', bond: 5, why: 'Your closest collaborator: most shared threads, calls and co-authored PRs this quarter.', col: '#6f9aa6', hat: 'tri',
    it: [['GitHub', 'Reviewed your PR #EX-204', '2d ago'], ['Zoom', 'Sprint planning', '3d ago'], ['Slack', 'Thread in #example-backend', '5h ago'], ['GitHub', 'Co-authored: Auth refactor', '6d ago']] },
  B: { name: 'Teammate B', role: 'Navigator', bond: 4, why: 'The person you go to for direction. Most of your “what should we do?” threads end with them.', col: '#c98f64', hat: 'bun',
    it: [['Slack', 'DM: Q4 priorities', '1d ago'], ['Zoom', '1:1 · roadmap', '4d ago'], ['Slack', 'Asked about vendor contract', '4d ago']] },
  C: { name: 'Teammate C', role: 'Quartermaster', bond: 4, why: 'Checks your cargo. The reviewer on most of your pull requests.', col: '#7fa77e', hat: 'band',
    it: [['GitHub', 'Approved PR #EX-215', '1d ago'], ['GitHub', 'Requested changes on #EX-209', '5d ago'], ['Slack', 'Thanks for the quick fix', '6d ago']] },
  D: { name: 'Teammate D', role: 'Lookout', bond: 3, why: 'Spots trouble early. First to flag incidents and bugs in your area.', col: '#d1b25c', hat: 'cap',
    it: [['Slack', 'Flagged: elevated 5xx on checkout', '9d ago'], ['GitHub', 'Filed #EX-190', '14d ago']] },
  E: { name: 'Teammate E', role: 'Deckhand', bond: 2, why: 'A regular on the wider deck. Occasional pairing and standup banter.', col: '#b98a9c', hat: 'hair',
    it: [['Zoom', 'Standup', 'daily'], ['Slack', 'Lunch plans', '2d ago']] },
  F: { name: 'Teammate F', role: 'Deckhand', bond: 2, why: 'A regular on the wider deck. Joins your design reviews.', col: '#8f93c9', hat: 'bun2',
    it: [['Zoom', 'Design review', '3d ago'], ['GitHub', 'Commented on #EX-218', '1d ago']] }
};

/* Captain's Log: every item belongs to an island so corrections redraw the chart. */
export interface LogItem { id: string; isl: string | null; t: string; d: string }
export const LOG: { reached: LogItem[]; storm: LogItem[]; sinking: LogItem[]; sirens: string; gifts: { from: string; text: string }[] } = {
  reached: [
    { id: 'l1', isl: null, t: 'Merged API pagination across 6 endpoints', d: 'Unblocked Teammate A\'s billing migration.' },
    { id: 'l2', isl: null, t: 'Reviewed 6 pull requests, median 3 hours', d: 'Fastest turnaround on the team this month.' },
    { id: 'l3', isl: null, t: 'Closed Bug #EX-12 with a regression test', d: 'Invoice rounding is safe again.' }
  ],
  storm: [
    { id: 'q4', isl: 'q4', t: 'Q4 roadmap review is overdue', d: 'Promised on Monday\'s sync call. Three people are waiting.' },
    { id: 'vendor', isl: 'vendor', t: 'Vendor contract question is drifting', d: 'Teammate B asked four days ago in #example-ops.' }
  ],
  sinking: [
    { id: 'caching', isl: 'caching', t: 'Spike: caching', d: 'Quiet for 14 days.' },
    { id: 'notes', isl: 'notes', t: '“I\'ll send the notes”', d: 'Said on a Zoom call 19 days ago.' },
    { id: 'followup', isl: 'followup', t: 'Follow up with Teammate C', d: 'A Slack promise, 26 days old.' }
  ],
  sirens: '8 hours in meetings slowed your API migration this week. Two of them had no agenda.',
  gifts: [
    { from: 'Teammate A', text: 'That pagination PR saved my whole week.' },
    { from: 'Teammate C', text: 'Fastest review turnaround I have seen. Thank you.' }
  ]
};

export type TrialType = 'cyclops' | 'storm' | 'scylla'
export interface Trial { id: string; type: TrialType; kind: string; glyph: string; name: string; title: string; ai: string; stats: string[][]; epic: string }
export const TRIALS: Trial[] = [
  { id: 't1', type: 'cyclops', kind: 'Blocker', glyph: '👁', name: 'The Cyclops', title: 'The legacy session fortress',
    ai: 'A single point of failure that guarded every login. You spent three weeks untangling its session logic before anything else could ship.',
    stats: [['3', 'weeks'], ['14', 'files'], ['5', 'people']], epic: 'First came the Cyclops, guardian of the legacy fortress' },
  { id: 't2', type: 'storm', kind: 'Incident', glyph: '⚡', name: 'Poseidon\'s Storm', title: 'The checkout outage of October 9',
    ai: 'Retries cascaded into a production fire. You led the response for six hours and wrote the first draft of the post-mortem.',
    stats: [['6', 'hours'], ['4', 'teams'], ['1', 'postmortem']], epic: 'Then Poseidon raised his storm: the checkout outage, retries breaking like waves' },
  { id: 't3', type: 'scylla', kind: 'Trade-off', glyph: '🌀', name: 'Scylla & Charybdis', title: 'Ship the migration, or pay down the debt',
    ai: 'No good choice: hit the billing deadline with known data debt, or slip a sprint and fix it properly. You picked the least bad.',
    stats: [['2', 'options'], ['1', 'sprint'], ['3', 'stakeholders']], epic: 'Last, between Scylla and Charybdis, no clean passage: ship on time, or mend the hull first' }
];

export const GOALS = [
  { id: 'g1', grp: 'Q4 expectations', t: 'Ship API v2 to production', p: 0.62, coach: 'Two sprints from the shore. The caching spike is the last unknown: rescue it or rule it out.' },
  { id: 'g2', grp: 'Q4 expectations', t: 'Reduce checkout incidents by 50%', p: 0.4, coach: 'Poseidon\'s storm taught the team a lot. Turn that post-mortem into two concrete guardrails.' },
  { id: 'g3', grp: 'Your own course', t: 'Mentor two engineers toward independence', p: 0.55, coach: 'Teammate E is ready for a stretch task. Hand over a review, not a fix.' },
  { id: 'g4', grp: 'Your own course', t: 'Write more, meet less', p: 0.25, coach: 'Eight hours of meetings is a siren. Decline the two with no agenda next week.' }
];

export const STUCK = [
  { id: 's1', t: 'Rate limiter redesign', days: 38, last: 'Last activity 21 days ago', why: 'Waiting on a decision nobody owns.' },
  { id: 's2', t: 'Docs overhaul, phase 2', days: 52, last: 'Last activity 33 days ago', why: 'Always the second most important thing.' },
  { id: 's3', t: 'Migrate cron jobs to scheduler', days: 29, last: 'Last activity 12 days ago', why: 'Blocked by an access request.' }
];

export const CHAPTERS = [
  { id: 'c8', n: 'VIII', month: 'August', title: 'The Long Calm', text: 'In the weeks when the sea lay flat, you rebuilt the oars. Small commits, many reviews, a hundred quiet repairs that nobody sang about, and that is how ships stay afloat.' },
  { id: 'c9', n: 'IX', month: 'September', title: 'The Harbor of Handoffs', text: 'September brought crews together at the docks. You carried knowledge from one ship to the next: three docs written, two teammates brought aboard, and the on-call chart redrawn.' },
  { id: 'c10', n: 'X', month: 'October', title: 'Three Trials', text: null }
];

export const GIFTS = [
  { id: 'k1', from: 'Teammate A', src: 'Slack', when: '2d ago', why: 'API pagination', text: 'That pagination PR saved my whole week. The cursor design is exactly what we needed.' },
  { id: 'k2', from: 'Teammate C', src: 'GitHub', when: '4d ago', why: 'Code review', text: 'Fastest review turnaround I have seen. And the comments taught me something, too.' },
  { id: 'k3', from: 'Teammate D', src: 'Slack', when: '9d ago', why: 'Incident response', text: 'Calm voice in the storm. We were lucky you were on the bridge.' },
  { id: 'k4', from: 'Teammate F', src: 'Zoom', when: '12d ago', why: 'Mentoring', text: 'You explained the retry logic in a way that finally clicked. Thank you.' },
  { id: 'k5', from: 'Teammate B', src: 'Slack', when: '3w ago', why: 'Onboarding doc', text: 'The onboarding doc is the best thing in the wiki. New hires keep quoting it.' }
];

export const TEAMS = [
  { name: 'Platform Fleet', note: 'Steady winds, two ships sailing alone.', ships: [
    { n: 'Teammate A', out: 7, alone: false, load: 0.6 }, { n: 'Teammate B', out: 5, alone: false, load: 0.7 },
    { n: 'Teammate C', out: 4, alone: true, load: 0.5 }, { n: 'Teammate D', out: 6, alone: false, load: 0.9 }, { n: 'Teammate E', out: 3, alone: true, load: 0.4 }] },
  { name: 'Checkout Fleet', note: 'Heavy cargo. The crew is carrying more than usual.', ships: [
    { n: 'Teammate F', out: 5, alone: false, load: 1.0 }, { n: 'Teammate G', out: 6, alone: false, load: 1.0 }, { n: 'Teammate H', out: 4, alone: false, load: 0.95 }, { n: 'Teammate I', out: 2, alone: true, load: 0.6 }] },
  { name: 'Insights Fleet', note: 'Balanced load, strong collaboration.', ships: [
    { n: 'Teammate J', out: 6, alone: false, load: 0.55 }, { n: 'Teammate K', out: 5, alone: false, load: 0.6 }, { n: 'Teammate L', out: 5, alone: false, load: 0.5 }] }
];

export const SUGGESTIONS = [
  { n: 'Teammate M', team: 'Data', area: 'Pagination & analytics queries', why: 'Their reporting islands overlap yours, but you have never shared a thread.', overlap: 3 },
  { n: 'Teammate N', team: 'Security', area: 'Session handling', why: 'They reviewed the same auth code you refactored. You two have never met.', overlap: 2 },
  { n: 'Teammate O', team: 'Mobile', area: 'API v2 consumers', why: 'Their app will be the first client of your API v2. Worth saying ahoy early.', overlap: 4 }
];

export const PORTS = [
  { id: 'p1', name: 'API v2 Migration', status: 'Final sprint before launch', teams: ['Platform', 'Checkout', 'Mobile'], docked: 3, p: 0.82,
    shared: ['Pagination', 'Auth tokens', 'Webhook retries'] },
  { id: 'p2', name: 'Observability Revamp', status: 'Charting the route', teams: ['Platform', 'Insights'], docked: 2, p: 0.35,
    shared: ['Tracing standard', 'Alert policy'] },
  { id: 'p3', name: 'Design System 2.0', status: 'Tokens migration underway', teams: ['Design', 'Checkout', 'Mobile', 'Web'], docked: 4, p: 0.6,
    shared: ['Color tokens', 'Form components', 'Docs site'] }
];

export const COUNSEL = [
  'Teammate H has been waiting on your review for 6 hours.',
  'Your vendor reply is drifting toward rough water. One short message would anchor it.',
  'You have 3 meetings with no agenda tomorrow. Worth a gentle decline?'
];

export type ViewId = 'map' | 'ithaca' | 'calypso' | 'log' | 'trials' | 'deck' | 'recruit' | 'ports' | 'armada' | 'chapters' | 'gifts'
export const NAV: { sec: string; items: [ViewId, string, string][] }[] = [
  { sec: 'My Voyage', items: [['map', 'The Chart', 'compass'], ['ithaca', 'Ithaca', 'star'], ['calypso', 'Calypso\'s Island', 'island']] },
  { sec: 'Check-ins', items: [['log', 'Captain\'s Log', 'scroll'], ['trials', 'Three Trials', 'eye']] },
  { sec: 'Crew & Fleet', items: [['deck', 'My Crew', 'crew'], ['recruit', 'Recruit a Crew Member', 'plus'], ['ports', 'Ports of Call', 'anchor'], ['armada', 'The Armada', 'fleet']] },
  { sec: 'Chronicle', items: [['chapters', 'Chapters of the Epic', 'book'], ['gifts', 'Gifts from the Gods', 'gift']] }
];
