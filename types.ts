
export interface Task {
  id: string;
  title: string;
  description: string;
  epicTitle: string;
  stars: number;
  xp: number;
  completed: boolean;
  category: 'cleaning' | 'learning' | 'health' | 'behavior';
  status: 'pending' | 'awaiting_approval' | 'done';
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  avatar: string;
}

export interface UserStats {
  name: string;
  stars: number;
  xp: number;
  level: number;
  streak: number;
  isChatEnabled: boolean;
}

export enum AppMode {
  KID = 'KID',
  PARENT = 'PARENT',
  SELECT = 'SELECT'
}

export enum AppView {
  KID_DASHBOARD = 'KID_DASHBOARD',
  PARENT_DASHBOARD = 'PARENT_DASHBOARD',
  PARENT_REWARDS = 'PARENT_REWARDS',
  REWARD_STORE = 'REWARD_STORE',
  QUEST_SELECTION = 'QUEST_SELECTION',
  CHAT = 'CHAT',
  GAMES = 'GAMES'
}
