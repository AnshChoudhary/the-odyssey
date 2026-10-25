/* Demo data. The captain is drawn from Ansh Choudhary's public GitHub; the crew, conversations and incidents are illustrative. */
export const NOW_WEEK = 43;
export const WEEKS: Record<number, string> = {
  40: 'Sep 28 – Oct 4', 41: 'Oct 5 – 11', 42: 'Oct 12 – 18', 43: 'Oct 19 – 25'
};
export const PERSON = {
  name: 'Ansh Choudhary', first: 'Ansh', role: 'Senior AI Engineer', team: 'AI Platform', city: 'Dubai',
  github: 'AnshChoudhary', site: 'anshchoudhary.com', since: 'Sailing on GitHub since 2017',
  bio: 'Builds the agent platform: the gateway every model call passes through, the firewall in front of every tool call, and the evals that say whether any of it works.',
}

/* Islands live on a 1600x1000 chart. The Shipped Continent owns x < 420; the survey panel covers x > 1170. */
export type Src = 'Slack' | 'Zoom' | 'GitHub'
export type IslandKind = 'active' | 'overdue' | 'sinking'
export interface Island { id: string; name: string; src: Src; kind: IslandKind; x: number; y: number; r: number; born: number; age: number; note: string; quote: string; link: string; flare?: string; who?: string; lab: 'l' | 'r' | 'b' }
export const ISLANDS: Island[] = [
  { id: 'q4', name: 'Q4 platform roadmap', src: 'Zoom', kind: 'overdue', lab: 'r', x: 730, y: 400, r: 62, born: 41, age: 3,
    note: 'Promised in “AI Platform weekly” on Monday. Omar, Priya and Lena are waiting on the draft before Thursday’s planning.', quote: '“I’ll have the roadmap draft out by Wednesday.”', link: 'Zoom · “AI Platform weekly” (Oct 20)' },
  { id: 'tests', name: 'Firewall shadow evals', src: 'GitHub', kind: 'active', lab: 'r', x: 540, y: 640, r: 40, born: 40, age: 2,
    note: 'eval-harness #418: replays a week of real tool calls through the firewall in shadow mode. Green checks; two of Lena’s comments left.', quote: 'eval-harness #418 · 2 comments left', link: 'GitHub · eval-harness #418' },
  { id: 'pr218', name: 'Review: gateway #431', src: 'GitHub', kind: 'active', flare: 'review requested', lab: 'b', x: 1000, y: 480, r: 48, born: 40, age: 1,
    note: 'Mei Lin’s retry-budget change for agent-gateway. She asked for your review six hours ago, ahead of the 4pm deploy window.', quote: '“Could you look before the 4pm deploy?”', link: 'GitHub · agent-gateway #431' },
  { id: 'vendor', name: 'Reply re: GPU reservation', src: 'Slack', kind: 'overdue', lab: 'l', x: 895, y: 755, r: 54, born: 42, age: 4,
    note: 'Tariq needs a yes or no on renewing the H100 reservation for Q1. The question has been drifting for four days.', quote: '“Need a yes/no on the reservation by Friday.”', link: 'Slack · #ai-infra, from Tariq' },
  { id: 'design', name: 'Agent console redesign', src: 'GitHub', kind: 'active', who: 'Diego Alvarez', lab: 'r', x: 610, y: 170, r: 46, born: 40, age: 6,
    note: 'Diego’s island. You are reviewing the trace viewer and the per-run cost panel.', quote: 'Shared with Diego Alvarez', link: 'GitHub · agent-console #77' },
  { id: 'billing', name: 'Doc-parser v2', src: 'Slack', kind: 'active', who: 'Priya Raman', lab: 'b', x: 880, y: 230, r: 54, born: 40, age: 8,
    note: 'Priya’s island. Your chunking rewrite unblocked her first migration phase.', quote: 'Shared with Priya Raman', link: 'Slack · #doc-intelligence' },
  { id: 'caching', name: 'Spike: speculative decoding', src: 'GitHub', kind: 'sinking', lab: 'l', x: 1080, y: 830, r: 40, born: 42, age: 14,
    note: 'A spike nobody picked back up. It could cut gateway latency again. Worth a day, or let it go?', quote: '“Spike: speculative decoding” · GitHub, 14d', link: 'GitHub · agent-gateway #389' },
  { id: 'notes', name: '“I’ll send the eval notes”', src: 'Zoom', kind: 'sinking', lab: 'r', x: 520, y: 860, r: 36, born: 41, age: 19,
    note: 'A small promise at the end of a call, nineteen days ago. Mei Lin asked about it once since.', quote: '“I’ll send the eval notes.” · Zoom, 19d', link: 'Zoom · “Eval sync” (Oct 6)' },
  { id: 'followup', name: 'Circle back with Lena', src: 'Slack', kind: 'sinking', lab: 'r', x: 760, y: 930, r: 38, born: 40, age: 26,
    note: 'You said you would circle back about the gateway on-call handoff.', quote: '“Let me circle back.” · Slack, 26d', link: 'Slack · #ai-platform-oncall' }
];
/* the ship's track, one fix per week */
export const TRACK: Record<number, [number, number]> = { 40: [470, 330], 41: [610, 300], 42: [640, 520], 43: [800, 600] }
export const HEADLINE: Record<number, string> = {
  40: 'A steady start, and calm water.',
  41: 'Good progress; something starts to drift.',
  42: 'Quiet seas, with two loose ends.',
  43: 'Fair winds, and a storm gathering.'
}
export const ROUTES: [string, string][] = [['design', 'q4'], ['billing', 'pr218'], ['q4', 'tests'], ['pr218', 'vendor'], ['design', 'billing']];

export const SHIPPED = [
  { w: 40, t: 'Merged: Tool-call validator', d: 'Pre-execution checks on every agent tool call, at an 11 ms p95 cost. Reviewed by Lena and Priya.' },
  { w: 40, t: 'Closed: Eval harness guide', d: 'How to add a task to the eval suite, now linked from the AI Platform wiki.' },
  { w: 41, t: 'Merged: Gateway prompt cache', d: 'Median latency down 38% and model spend down 22% on repeated prompts.' },
  { w: 41, t: 'Shipped: Q3 model-quality report', d: 'Written with Omar for the leadership review.' },
  { w: 42, t: 'Reviewed: 9 pull requests', d: 'Median turnaround 2h 40m across agent-gateway and eval-harness.' },
  { w: 42, t: 'Merged: Pinned eval seeds', d: 'Four flaky evals are now deterministic. CI time down six minutes.' },
  { w: 43, t: 'Open-sourced: buoyancy-test', d: 'A framework for testing whether an AI product gets better as models do. Public at github.com/AnshChoudhary/buoyancy-test.' }
];
export const SHIPPED_COUNT: Record<number, number> = { 40: 6, 41: 9, 42: 8, 43: 11 };

export const VOYAGE: Record<number, string> = {
  40: 'A steady start. The tool-call validator landed with an 11 ms cost, and the eval guide is out of the door. Calm seas; nothing yet drifting.',
  41: 'The prompt cache shipped and cut spend by a fifth. The Q3 report is with Omar. A promise from the eval sync is starting to drift.',
  42: 'Nine reviews given and the flaky evals are pinned. Tariq’s GPU question is waiting, and the speculative-decoding spike has gone quiet.',
  43: 'Fair winds this week: buoyancy-test is public and 11 things landed. A storm is gathering over the Q4 roadmap, and three old promises are slipping under. Rescue one before it is lost to sea.'
};

/* the same weeks, in plain words, for the simple dashboard */
export const PLAIN_SUMMARY: Record<number, string> = {
  40: 'A steady week. The tool-call validator merged with an 11 ms p95 cost and the eval harness guide was published. Nothing overdue.',
  41: 'The gateway prompt cache shipped, cutting model spend by 22%. The Q3 model-quality report went to leadership with Omar. One commitment from the eval sync has not been followed up.',
  42: 'Nine pull requests reviewed and the flaky evals fixed. Tariq is waiting on a GPU reservation decision, and the speculative-decoding spike has stalled.',
  43: '11 items shipped, including open-sourcing buoyancy-test. The Q4 platform roadmap is overdue and three older commitments have had no activity for two weeks or more.'
};

export type CrewId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export interface Crew { name: string; short: string; title: string; role: string; station: string; bond: number; why: string; it: [Src, string, string][] }
export const CREW: Record<CrewId, Crew> = {
  A: { name: 'Priya Raman', short: 'Priya R.', title: 'Staff ML Engineer', role: 'First Mate', station: 'Helm', bond: 5, why: 'Your closest collaborator this quarter: the most shared threads, calls and co-authored pull requests. You steer the gateway together.',
    it: [['GitHub', 'Co-authored agent-gateway #402, the prompt cache', '6d ago'], ['Slack', 'Thread in #doc-intelligence about chunk sizes', '5h ago'], ['Zoom', 'Pairing on doc-parser load tests', '2d ago'], ['GitHub', 'Approved eval-harness #415', '3d ago']] },
  B: { name: 'Omar Haddad', short: 'Omar H.', title: 'Engineering Manager', role: 'Navigator', station: 'Chart table', bond: 4, why: 'The person you go to for direction. Most of your “what should we do?” threads end with him.',
    it: [['Slack', 'DM: Q4 priorities and the roadmap draft', '1d ago'], ['Zoom', '1:1 · firewall rollout plan', '4d ago'], ['Slack', 'Asked about the GPU reservation', '4d ago']] },
  C: { name: 'Lena Fischer', short: 'Lena F.', title: 'Senior Software Engineer', role: 'Quartermaster', station: 'Hold', bond: 4, why: 'Checks your cargo. She reviews most of your pull requests and reliably finds the edge case.',
    it: [['GitHub', 'Requested changes on eval-harness #418', '1d ago'], ['GitHub', 'Approved agent-gateway #409', '5d ago'], ['Slack', '“Nice catch on the seed pinning”', '6d ago']] },
  D: { name: 'Tariq Al-Mansoori', short: 'Tariq A.', title: 'Site Reliability Engineer', role: 'Lookout', station: 'Crow’s nest', bond: 3, why: 'Spots trouble early. The first to flag incidents and capacity limits in your area.',
    it: [['Slack', 'Flagged the provider rate limit on Oct 9', '16d ago'], ['Slack', 'Asked about the H100 reservation', '4d ago'], ['GitHub', 'Filed agent-gateway #389', '14d ago']] },
  E: { name: 'Mei Lin Tan', short: 'Mei Lin T.', title: 'ML Engineer', role: 'Deckhand', station: 'Fore deck', bond: 3, why: 'Newer on the crew and learning fast. You review her work and she is starting to own the evals.',
    it: [['GitHub', 'Requested your review on agent-gateway #431', '6h ago'], ['Zoom', 'Eval sync', 'weekly'], ['Slack', 'Asked for the eval notes', '9d ago']] },
  F: { name: 'Diego Alvarez', short: 'Diego A.', title: 'Product Designer', role: 'Deckhand', station: 'Fore deck', bond: 2, why: 'A regular on the wider deck. He draws the agent console and pulls you into design reviews.',
    it: [['Zoom', 'Design review · trace viewer', '3d ago'], ['GitHub', 'Commented on agent-console #77', '1d ago']] }
};

/* Captain's Log: every item belongs to an island so corrections redraw the chart. */
export interface LogItem { id: string; isl: string | null; t: string; d: string }
export const LOG: { reached: LogItem[]; storm: LogItem[]; sinking: LogItem[]; sirens: string; gifts: { from: string; text: string }[] } = {
  reached: [
    { id: 'l1', isl: null, t: 'Open-sourced buoyancy-test', d: 'Your framework for testing whether AI products improve as models do is public on GitHub.' },
    { id: 'l2', isl: null, t: 'Reviewed 9 pull requests, median 2h 40m', d: 'Fastest turnaround on AI Platform this month.' },
    { id: 'l3', isl: null, t: 'Pinned the eval seeds', d: 'Four flaky evals are now deterministic. CI is six minutes faster.' }
  ],
  storm: [
    { id: 'q4', isl: 'q4', t: 'The Q4 platform roadmap is overdue', d: 'Promised on Monday’s call. Omar, Priya and Lena are waiting.' },
    { id: 'vendor', isl: 'vendor', t: 'Tariq’s GPU question is drifting', d: 'He asked four days ago in #ai-infra and needs an answer by Friday.' }
  ],
  sinking: [
    { id: 'caching', isl: 'caching', t: 'Spike: speculative decoding', d: 'Quiet for 14 days.' },
    { id: 'notes', isl: 'notes', t: '“I’ll send the eval notes”', d: 'Said on a Zoom call 19 days ago.' },
    { id: 'followup', isl: 'followup', t: 'Circle back with Lena about on-call', d: 'A Slack promise, 26 days old.' }
  ],
  sirens: 'Nine hours in meetings slowed the firewall evals this week. Three of those meetings had no agenda.',
  gifts: [
    { from: 'Priya Raman', text: 'The prompt cache made our load tests pass on the first try.' },
    { from: 'Lena Fischer', text: 'Fastest reviews on the team, and the comments actually teach.' }
  ]
};

export type TrialType = 'cyclops' | 'storm' | 'scylla'
export interface Trial { id: string; type: TrialType; kind: string; name: string; title: string; ai: string; stats: string[][]; epic: string }
export const TRIALS: Trial[] = [
  { id: 't1', type: 'cyclops', kind: 'Blocker', name: 'The Cyclops', title: 'The legacy inference gateway',
    ai: 'One service guarded every model call, and nobody fully understood its retry logic. You spent three weeks untangling it before the firewall could ship.',
    stats: [['3', 'weeks'], ['23', 'files'], ['5', 'people']], epic: '' },
  { id: 't2', type: 'storm', kind: 'Incident', name: 'Poseidon’s Storm', title: 'The rate-limit cascade of October 9',
    ai: 'A provider rate limit set off retries that tripled traffic. You led the response for five hours and wrote the first draft of the post-mortem.',
    stats: [['5', 'hours'], ['3', 'teams'], ['1', 'post-mortem']], epic: '' },
  { id: 't3', type: 'scylla', kind: 'Trade-off', name: 'Scylla & Charybdis', title: 'Ship the firewall, or finish the evals',
    ai: 'No good choice: launch the firewall in shadow mode with a thin eval suite, or slip two weeks to measure it properly. You shipped in shadow mode and kept measuring.',
    stats: [['2', 'options'], ['2', 'weeks'], ['4', 'stakeholders']], epic: '' }
];

export const GOALS = [
  { id: 'g1', grp: 'Q4 expectations', t: 'Take the tool-call firewall from shadow mode to enforcement', p: 0.62, coach: 'Two more weeks of shadow data. The speculative-decoding spike is the last open question: rescue it or rule it out.' },
  { id: 'g2', grp: 'Q4 expectations', t: 'Halve agent-gateway incidents', p: 0.4, coach: 'The October 9 cascade taught the team a lot. Turn the post-mortem into two guardrails: retry budgets and a provider circuit breaker.' },
  { id: 'g3', grp: 'Your own course', t: 'Help Mei Lin own the eval harness', p: 0.55, coach: 'She is ready for a stretch. Hand her a review, not a fix.' },
  { id: 'g4', grp: 'Your own course', t: 'Write more, meet less', p: 0.25, coach: 'Nine hours of meetings is a siren. Decline the three with no agenda, and publish one post on the firewall results.' }
];

export const STUCK = [
  { id: 's1', t: 'Rate limiter for the public eval API', days: 38, last: 'Last commit 21 days ago', why: 'Waiting on a decision nobody owns.' },
  { id: 's2', t: 'CUDA kernels for the tokenizer', days: 52, last: 'Last activity 33 days ago', why: 'Always the second most important thing.' },
  { id: 's3', t: 'Write up the ARC-AGI-3 harness result', days: 29, last: 'Last activity 12 days ago', why: 'The result was negative, and negative results are hard to publish.' }
];

export const CHAPTERS = [
  { id: 'c8', n: 'VIII', month: 'August', title: 'The Long Calm', text: 'In the weeks when the sea lay flat, you rebuilt the oars. You pinned the eval seeds, wrote the onboarding guide, and reviewed forty-one pull requests that nobody sang about. That is how ships stay afloat.' },
  { id: 'c9', n: 'IX', month: 'September', title: 'The Harbour of Experiments', text: 'September was a month of honest experiments. You put a firewall in front of every agent tool call and ran it in shadow mode, and you asked whether a harness could refine itself on ARC-AGI-3 games it had never seen. The answer, so far, was no, and you wrote it down anyway.' },
  { id: 'c10', n: 'X', month: 'October', title: 'Three Trials', text: null }
];

export const GIFTS = [
  { id: 'k1', from: 'Priya Raman', src: 'Slack', when: '2d ago', why: 'the prompt cache', text: 'The prompt cache made our load tests pass on the first try. I owe you a karak.' },
  { id: 'k2', from: 'Lena Fischer', src: 'GitHub', when: '4d ago', why: 'code review', text: 'Fastest reviews on the team, and your comments actually teach me something.' },
  { id: 'k3', from: 'Tariq Al-Mansoori', src: 'Slack', when: '16d ago', why: 'the October 9 cascade', text: 'Calm voice during the cascade. Glad you were on the bridge that night.' },
  { id: 'k4', from: 'Mei Lin Tan', src: 'Zoom', when: '12d ago', why: 'mentoring', text: 'You explained retry budgets in a way that finally clicked. Thank you.' },
  { id: 'k5', from: 'Omar Haddad', src: 'Slack', when: '3w ago', why: 'the Q3 report', text: 'The model-quality report was the clearest thing in the leadership review.' },
  { id: 'k6', from: 'A stranger on GitHub', src: 'GitHub', when: '5w ago', why: 'Football-Tracking', text: 'Used your Football-Tracking repo for my thesis. Thanks for open-sourcing it.' }
];

export const TEAMS = [
  { name: 'AI Platform', note: 'Steady winds, two ships sailing alone.', ships: [
    { n: 'Ansh C.', out: 11, alone: false, load: 0.8 }, { n: 'Priya R.', out: 9, alone: false, load: 0.7 },
    { n: 'Lena F.', out: 7, alone: true, load: 0.55 }, { n: 'Tariq A.', out: 6, alone: false, load: 0.9 }, { n: 'Mei Lin T.', out: 4, alone: true, load: 0.45 }] },
  { name: 'Doc Intelligence', note: 'Heavy cargo. The crew is carrying more than usual.', ships: [
    { n: 'Sara O.', out: 6, alone: false, load: 1.0 }, { n: 'Arjun M.', out: 7, alone: false, load: 1.0 }, { n: 'Hana S.', out: 5, alone: false, load: 0.95 }, { n: 'Kofi M.', out: 2, alone: true, load: 0.6 }] },
  { name: 'Trading Signals', note: 'Balanced load, strong collaboration.', ships: [
    { n: 'Elena P.', out: 6, alone: false, load: 0.55 }, { n: 'Rahul I.', out: 5, alone: false, load: 0.6 }, { n: 'Yusuf D.', out: 5, alone: false, load: 0.5 }] }
];

export const SUGGESTIONS = [
  { n: 'Sara Okafor', team: 'Doc Intelligence', area: 'Table extraction', why: 'Her table-extraction islands overlap your chunking work, but you have never shared a thread.', overlap: 3 },
  { n: 'Noor Al-Hashimi', team: 'Security', area: 'Prompt-injection defence', why: 'She reviewed the same tool-call policies you wrote for the firewall. You two have never met.', overlap: 2 },
  { n: 'Kenji Watanabe', team: 'Mobile', area: 'Agent SDK for iOS', why: 'His app will be the first client of the gateway’s v2 API. Worth saying hello early.', overlap: 4 }
];

export const PORTS = [
  { id: 'p1', name: 'Agent Gateway v2', status: 'Final sprint before launch', teams: ['AI Platform', 'Trading Signals', 'Mobile'], docked: 3, p: 0.82,
    shared: ['Retry budgets', 'Tool-call firewall', 'Streaming responses'] },
  { id: 'p2', name: 'Eval Commons', status: 'Charting the route', teams: ['AI Platform', 'Doc Intelligence'], docked: 2, p: 0.35,
    shared: ['Golden datasets', 'Judge prompts'] },
  { id: 'p3', name: 'Doc-parser v2', status: 'Migration underway', teams: ['Doc Intelligence', 'AI Platform', 'Compliance', 'Support'], docked: 4, p: 0.6,
    shared: ['Chunking', 'Table extraction', 'Citations'] }
];

export const COUNSEL = [
  'Mei Lin has been waiting on your review of agent-gateway #431 for six hours.',
  'Tariq’s GPU question is drifting toward rough water. One line in #ai-infra would anchor it.',
  'You have three meetings with no agenda tomorrow. Worth a gentle decline?'
];

export type ViewId = 'map' | 'ithaca' | 'calypso' | 'log' | 'trials' | 'deck' | 'recruit' | 'ports' | 'armada' | 'chapters' | 'gifts'
export const NAV: { sec: string; items: [ViewId, string, string][] }[] = [
  { sec: 'The voyage', items: [['map', 'The Chart', 'Your week, surveyed as a sea chart'], ['ithaca', 'Ithaca', 'Where you are heading'], ['calypso', 'Calypso', 'Work that has gone becalmed']] },
  { sec: 'Check-ins', items: [['log', 'The Captain\'s Log', 'Weekly, about two minutes'], ['trials', 'The Three Trials', 'Monthly, told as an epic']] },
  { sec: 'Crew & fleet', items: [['deck', 'The Deck', 'The people you sail with'], ['recruit', 'Recruit', 'People whose work touches yours'], ['ports', 'Ports of Call', 'Cross-team harbours'], ['armada', 'The Armada', 'Teams as fleets, for managers']] },
  { sec: 'Chronicle', items: [['chapters', 'Chapters', 'Each month, as prose'], ['gifts', 'Gifts', 'Every thank-you, kept']] }
];
export const ALL_NAV = NAV.flatMap((s) => s.items.map(([id, label, desc]) => ({ id, label, desc, sec: s.sec })))
