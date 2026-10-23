// Source types for work items
export type WorkSource = 'slack' | 'zoom' | 'github';

export interface WorkItem {
  id: string;
  title: string;
  source: WorkSource;
  type: 'task' | 'commitment' | 'project';
  status: 'active' | 'needs-attention' | 'forgotten' | 'done';
  createdAt: Date;
  lastUpdated: Date;
  description: string;
  size: number; // 1-10, affects island size
  urgency: number; // 0-10, affects water turbulence
  position: { x: number; y: number }; // Map coordinates
  interactions: Interaction[];
}

export interface Interaction {
  id: string;
  type: 'slack-message' | 'zoom-meeting' | 'github-commit' | 'github-pr' | 'github-issue';
  date: Date;
  participants: string[];
  summary: string;
  url?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'first-mate' | 'navigator' | 'quartermaster' | 'lookout' | 'deckhand';
  bondStrength: number; // 0-100
  avatar: string;
  recentInteractions: Interaction[];
  workItems: string[]; // WorkItem IDs
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  quarter: string;
  progress: number; // 0-100
  heading: number; // 0-360 degrees
  isNorthStar: boolean;
}

export interface CheckInCard {
  id: string;
  date: Date;
  type: 'work-item' | 'crew-kudos' | 'siren-distraction' | 'ithaca-coaching';
  content: string;
  workItemId?: string;
  crewMemberId?: string;
  userResponse?: 'aye' | 'not-quite' | 'missing-context';
  userEdit?: string;
}

export interface Trial {
  id: string;
  month: string;
  title: string;
  description: string;
  monster: 'cyclops' | 'poseidon' | 'scylla-charybdis';
  confirmed: boolean;
  backstory?: string;
  involvedCrew: string[]; // CrewMember IDs
}

export interface Chapter {
  id: string;
  month: string;
  title: string;
  content: string; // Mock-epic prose
  isEdited: boolean;
  isPrivate: boolean;
}

export interface KudosChest {
  id: string;
  from: string;
  date: Date;
  message: string;
  isOpened: boolean;
}

export interface Port {
  id: string;
  name: string;
  team: string;
  description: string;
  position: { x: number; y: number };
  connections: string[]; // Other port IDs
}

export interface AthenaMessage {
  id: string;
  date: Date;
  message: string;
  category: 'nudge' | 'insight' | 'coaching';
  workItemId?: string;
}

export interface UserProfile {
  name: string;
  role: string;
  ship: {
    name: string;
    position: { x: number; y: number };
  };
  crew: CrewMember[];
  workItems: WorkItem[];
  goals: Goal[];
  checkIns: CheckInCard[];
  trials: Trial[];
  chapters: Chapter[];
  kudos: KudosChest[];
  athenaMessages: AthenaMessage[];
}
