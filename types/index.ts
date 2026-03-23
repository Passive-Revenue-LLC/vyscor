export enum Sport {
  FOOTBALL = 'FOOTBALL',
  BASKETBALL = 'BASKETBALL',
  TENNIS = 'TENNIS',
  F1 = 'F1',
  CS2 = 'CS2',
  LOL = 'LOL',
  DOTA2 = 'DOTA2',
  VALORANT = 'VALORANT',
  ROCKETLEAGUE = 'ROCKETLEAGUE',
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface Event {
  id: string;
  externalId?: string;
  sport: Sport;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: EventStatus;
  startTime: string;
  venue?: string;
  streamUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  favorites: string[];
  notifications: boolean;
  referralCode?: string;
  createdAt: string;
}

export interface BettingPartner {
  id: string;
  name: string;
  logoUrl?: string;
  bonusText: string;
  referralUrl: string;
  isActive: boolean;
  order: number;
}

export const SPORT_CONFIG: Record<Sport, { label: string; emoji: string; color: string }> = {
  [Sport.FOOTBALL]: { label: 'Futbol', emoji: '\u26BD', color: 'cyber-green' },
  [Sport.BASKETBALL]: { label: 'NBA', emoji: '\uD83C\uDFC0', color: 'cyber-amber' },
  [Sport.TENNIS]: { label: 'Tenis', emoji: '\uD83C\uDFBE', color: 'cyber-green' },
  [Sport.F1]: { label: 'F1', emoji: '\uD83C\uDFCE\uFE0F', color: 'cyber-red' },
  [Sport.CS2]: { label: 'CS2', emoji: '\uD83D\uDD2B', color: 'cyber-amber' },
  [Sport.LOL]: { label: 'LoL', emoji: '\u2694\uFE0F', color: 'cyber-purple' },
  [Sport.DOTA2]: { label: 'Dota 2', emoji: '\uD83C\uDF00', color: 'cyber-red' },
  [Sport.VALORANT]: { label: 'Valorant', emoji: '\uD83C\uDFAF', color: 'cyber-pink' },
  [Sport.ROCKETLEAGUE]: { label: 'Rocket League', emoji: '\uD83D\uDE80', color: 'cyber-cyan' },
};

export type FilterTab = 'TODOS' | Sport;
export type ViewTab = 'UPCOMING' | 'LIVE' | 'RESULTS';
