import type {
  UserProfile,
  WorkItem,
  CrewMember,
  Goal,
  CheckInCard,
  Trial,
  Chapter,
  KudosChest,
  AthenaMessage,
  Interaction,
} from '../types';

// Mock interactions
const mockInteractions: Interaction[] = [
  {
    id: 'int-1',
    type: 'slack-message',
    date: new Date('2026-10-20'),
    participants: ['Sarah Chen', 'You'],
    summary: 'Discussed API endpoint refactoring',
  },
  {
    id: 'int-2',
    type: 'github-commit',
    date: new Date('2026-10-21'),
    participants: ['You'],
    summary: 'Implemented new authentication flow',
    url: 'https://github.com/example/repo/commit/abc123',
  },
  {
    id: 'int-3',
    type: 'zoom-meeting',
    date: new Date('2026-10-19'),
    participants: ['Marcus Johnson', 'Elena Rodriguez', 'You'],
    summary: 'Sprint planning - Q4 goals alignment',
  },
  {
    id: 'int-4',
    type: 'github-pr',
    date: new Date('2026-10-18'),
    participants: ['You', 'Sarah Chen'],
    summary: 'Code review: Payment processing improvements',
    url: 'https://github.com/example/repo/pull/456',
  },
];

// Mock crew members
const mockCrew: CrewMember[] = [
  {
    id: 'crew-1',
    name: 'Sarah Chen',
    role: 'first-mate',
    bondStrength: 92,
    avatar: '👩‍💼',
    recentInteractions: [mockInteractions[0], mockInteractions[3]],
    workItems: ['work-1', 'work-4'],
  },
  {
    id: 'crew-2',
    name: 'Marcus Johnson',
    role: 'navigator',
    bondStrength: 78,
    avatar: '👨‍💻',
    recentInteractions: [mockInteractions[2]],
    workItems: ['work-2'],
  },
  {
    id: 'crew-3',
    name: 'Elena Rodriguez',
    role: 'quartermaster',
    bondStrength: 85,
    avatar: '👩‍🔬',
    recentInteractions: [mockInteractions[2]],
    workItems: ['work-3'],
  },
  {
    id: 'crew-4',
    name: 'David Kim',
    role: 'lookout',
    bondStrength: 65,
    avatar: '👨‍🎨',
    recentInteractions: [],
    workItems: ['work-5'],
  },
  {
    id: 'crew-5',
    name: 'Aisha Patel',
    role: 'deckhand',
    bondStrength: 71,
    avatar: '👩‍🚀',
    recentInteractions: [],
    workItems: [],
  },
];

// Mock work items (islands)
const mockWorkItems: WorkItem[] = [
  {
    id: 'work-1',
    title: 'API Authentication Refactor',
    source: 'github',
    type: 'project',
    status: 'active',
    createdAt: new Date('2026-10-01'),
    lastUpdated: new Date('2026-10-21'),
    description: 'Modernizing authentication system with OAuth 2.0',
    size: 8,
    urgency: 6,
    position: { x: 200, y: 300 },
    interactions: [mockInteractions[0], mockInteractions[1]],
  },
  {
    id: 'work-2',
    title: 'Q4 Planning Document',
    source: 'slack',
    type: 'commitment',
    status: 'needs-attention',
    createdAt: new Date('2026-09-28'),
    lastUpdated: new Date('2026-10-10'),
    description: 'Finalize team objectives and key results',
    size: 5,
    urgency: 8,
    position: { x: 350, y: 250 },
    interactions: [mockInteractions[2]],
  },
  {
    id: 'work-3',
    title: 'Customer Dashboard Redesign',
    source: 'github',
    type: 'project',
    status: 'active',
    createdAt: new Date('2026-10-05'),
    lastUpdated: new Date('2026-10-22'),
    description: 'New UI/UX for customer analytics dashboard',
    size: 9,
    urgency: 4,
    position: { x: 500, y: 400 },
    interactions: [],
  },
  {
    id: 'work-4',
    title: 'Payment Gateway Integration',
    source: 'github',
    type: 'task',
    status: 'active',
    createdAt: new Date('2026-10-15'),
    lastUpdated: new Date('2026-10-22'),
    description: 'Integrate Stripe payment processing',
    size: 6,
    urgency: 7,
    position: { x: 280, y: 450 },
    interactions: [mockInteractions[3]],
  },
  {
    id: 'work-5',
    title: 'Team Retrospective Notes',
    source: 'slack',
    type: 'commitment',
    status: 'forgotten',
    createdAt: new Date('2026-09-15'),
    lastUpdated: new Date('2026-09-20'),
    description: 'Document insights from September retrospective',
    size: 3,
    urgency: 2,
    position: { x: 150, y: 500 },
    interactions: [],
  },
  {
    id: 'work-6',
    title: 'Mobile App Launch',
    source: 'github',
    type: 'project',
    status: 'done',
    createdAt: new Date('2026-08-01'),
    lastUpdated: new Date('2026-09-30'),
    description: 'Shipped v1.0 of iOS and Android apps',
    size: 10,
    urgency: 0,
    position: { x: 800, y: 300 },
    interactions: [],
  },
  {
    id: 'work-7',
    title: 'Documentation Site',
    source: 'github',
    type: 'project',
    status: 'done',
    createdAt: new Date('2026-07-15'),
    lastUpdated: new Date('2026-09-15'),
    description: 'Developer documentation portal',
    size: 7,
    urgency: 0,
    position: { x: 850, y: 400 },
    interactions: [],
  },
];

// Mock goals
const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Ship Customer Self-Service Portal',
    description: 'Enable customers to manage accounts independently',
    quarter: 'Q4 2026',
    progress: 65,
    heading: 45,
    isNorthStar: true,
  },
  {
    id: 'goal-2',
    title: 'Improve System Performance by 40%',
    description: 'Reduce API response times and optimize database queries',
    quarter: 'Q4 2026',
    progress: 42,
    heading: 35,
    isNorthStar: false,
  },
  {
    id: 'goal-3',
    title: 'Mentor Two Junior Developers',
    description: 'Guide career development and technical growth',
    quarter: 'Q4 2026',
    progress: 80,
    heading: 50,
    isNorthStar: false,
  },
];

// Mock check-in cards
const mockCheckIns: CheckInCard[] = [
  {
    id: 'checkin-1',
    date: new Date('2026-10-20'),
    type: 'work-item',
    content: 'You made solid progress on the API Authentication Refactor this week.',
    workItemId: 'work-1',
  },
  {
    id: 'checkin-2',
    date: new Date('2026-10-20'),
    type: 'crew-kudos',
    content: 'Sarah Chen mentioned your thorough code reviews helped catch critical issues.',
    crewMemberId: 'crew-1',
  },
  {
    id: 'checkin-3',
    date: new Date('2026-10-20'),
    type: 'siren-distraction',
    content: 'You spent 8 hours in meetings this week—more than usual. Is that sustainable?',
  },
  {
    id: 'checkin-4',
    date: new Date('2026-10-20'),
    type: 'ithaca-coaching',
    content: 'Your Q4 goal progress looks strong. Consider documenting your approach for the team.',
  },
];

// Mock trials
const mockTrials: Trial[] = [
  {
    id: 'trial-1',
    month: 'October 2026',
    title: 'The Scaling Cyclops',
    description: 'Database performance degradation under increased load',
    monster: 'cyclops',
    confirmed: true,
    backstory: 'As user traffic tripled, query times ballooned and timeouts cascaded.',
    involvedCrew: ['crew-1', 'crew-2'],
  },
  {
    id: 'trial-2',
    month: 'October 2026',
    title: "Poseidon's Production Storm",
    description: 'Critical bug in payment processing discovered in production',
    monster: 'poseidon',
    confirmed: true,
    backstory: 'A race condition caused duplicate charges during peak hours.',
    involvedCrew: ['crew-1', 'crew-3'],
  },
  {
    id: 'trial-3',
    month: 'October 2026',
    title: 'Between Scylla and Charybdis',
    description: 'Balancing technical debt vs. new feature requests',
    monster: 'scylla-charybdis',
    confirmed: false,
    involvedCrew: [],
  },
];

// Mock chapters
const mockChapters: Chapter[] = [
  {
    id: 'chapter-1',
    month: 'September 2026',
    title: 'The Voyage Begins: Charting New Waters',
    content: `In the ninth moon of twenty-twenty-six, our hero embarked upon a journey fraught with promise and peril. The Mobile App Launch, a vessel of great ambition, was christened and set sail into the tumultuous seas of the marketplace.

With Sarah Chen, the stalwart First Mate, at their side, they weathered the storms of code review and the treacherous currents of production deployment. The Documentation Site rose like a lighthouse from the mists, guiding weary travelers through uncharted technical waters.

Yet not all was smooth sailing. The whispers of technical debt echoed like siren songs, tempting the crew to stray from their true course. But with wisdom granted by Athena's counsel, they pressed onward, their eyes fixed upon distant Ithaca.`,
    isEdited: false,
    isPrivate: false,
  },
];

// Mock kudos
const mockKudos: KudosChest[] = [
  {
    id: 'kudos-1',
    from: 'Sarah Chen',
    date: new Date('2026-10-15'),
    message: 'Your refactoring work on the auth system is brilliant—clean, well-tested, and thoughtful. Thank you!',
    isOpened: false,
  },
  {
    id: 'kudos-2',
    from: 'Marcus Johnson',
    date: new Date('2026-10-10'),
    message: 'Really appreciated your help debugging that production issue. Your calm under pressure kept the team focused.',
    isOpened: true,
  },
  {
    id: 'kudos-3',
    from: 'Elena Rodriguez',
    date: new Date('2026-10-05'),
    message: 'The dashboard designs you reviewed were so much better after your feedback. Great eye for detail!',
    isOpened: true,
  },
];

// Mock Athena messages
const mockAthenaMessages: AthenaMessage[] = [
  {
    id: 'athena-1',
    date: new Date('2026-10-23'),
    message: 'The Q4 Planning Document has been adrift for two weeks. Perhaps a quick check-in with Marcus?',
    category: 'nudge',
    workItemId: 'work-2',
  },
  {
    id: 'athena-2',
    date: new Date('2026-10-22'),
    message: 'Your collaboration with Sarah on the payment integration shows the strength of your partnership.',
    category: 'insight',
  },
  {
    id: 'athena-3',
    date: new Date('2026-10-21'),
    message: 'As you approach 65% on your North Star goal, consider how the authentication work connects to that larger vision.',
    category: 'coaching',
  },
];

// Main user profile
export const mockUserProfile: UserProfile = {
  name: 'Alex Morgan',
  role: 'Senior Software Engineer',
  ship: {
    name: 'The Persistent',
    position: { x: 400, y: 350 },
  },
  crew: mockCrew,
  workItems: mockWorkItems,
  goals: mockGoals,
  checkIns: mockCheckIns,
  trials: mockTrials,
  chapters: mockChapters,
  kudos: mockKudos,
  athenaMessages: mockAthenaMessages,
};

// Helper function to get work items by status
export const getWorkItemsByStatus = (status: WorkItem['status']): WorkItem[] => {
  return mockWorkItems.filter(item => item.status === status);
};

// Helper function to get crew member by ID
export const getCrewMemberById = (id: string): CrewMember | undefined => {
  return mockCrew.find(member => member.id === id);
};

// Helper function to get work item by ID
export const getWorkItemById = (id: string): WorkItem | undefined => {
  return mockWorkItems.find(item => item.id === id);
};
