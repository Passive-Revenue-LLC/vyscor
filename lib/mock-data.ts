import { Event, EventStatus, Sport, BettingPartner } from '@/types';

const now = new Date();
const h = (hours: number) => new Date(now.getTime() + hours * 3600000).toISOString();
const ago = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString();

export const mockEvents: Event[] = [
  // LIVE (3)
  {
    id: 'evt-001',
    sport: Sport.FOOTBALL,
    league: 'UEFA Champions League',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Bayern Munich',
    homeScore: 2,
    awayScore: 1,
    status: EventStatus.LIVE,
    startTime: ago(1),
    venue: 'Spotify Camp Nou',
    streamUrl: 'https://stream.example.com/ucl-1',
    metadata: { minute: 67, half: 2 },
    createdAt: ago(24),
    updatedAt: ago(0.1),
  },
  {
    id: 'evt-002',
    sport: Sport.CS2,
    league: 'IEM Katowice 2026',
    homeTeam: 'Natus Vincere',
    awayTeam: 'FaZe Clan',
    homeScore: 1,
    awayScore: 0,
    status: EventStatus.LIVE,
    startTime: ago(0.5),
    streamUrl: 'https://twitch.tv/esl_csgo',
    metadata: { map: 'Mirage', round: 18, format: 'BO3' },
    createdAt: ago(48),
    updatedAt: ago(0.05),
  },
  {
    id: 'evt-003',
    sport: Sport.BASKETBALL,
    league: 'NBA',
    homeTeam: 'LA Lakers',
    awayTeam: 'Boston Celtics',
    homeScore: 88,
    awayScore: 92,
    status: EventStatus.LIVE,
    startTime: ago(1.5),
    venue: 'Crypto.com Arena',
    metadata: { quarter: 3, timeLeft: '4:32' },
    createdAt: ago(24),
    updatedAt: ago(0.02),
  },

  // UPCOMING (8)
  {
    id: 'evt-004',
    sport: Sport.FOOTBALL,
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Atletico Madrid',
    status: EventStatus.UPCOMING,
    startTime: h(3),
    venue: 'Santiago Bernabeu',
    metadata: { matchday: 28 },
    createdAt: ago(48),
    updatedAt: ago(12),
  },
  {
    id: 'evt-005',
    sport: Sport.LOL,
    league: 'LEC Spring 2026',
    homeTeam: 'G2 Esports',
    awayTeam: 'Fnatic',
    status: EventStatus.UPCOMING,
    startTime: h(5),
    streamUrl: 'https://twitch.tv/lec',
    metadata: { format: 'BO3', week: 8 },
    createdAt: ago(72),
    updatedAt: ago(24),
  },
  {
    id: 'evt-006',
    sport: Sport.VALORANT,
    league: 'VCT EMEA 2026',
    homeTeam: 'Team Heretics',
    awayTeam: 'Karmine Corp',
    status: EventStatus.UPCOMING,
    startTime: h(7),
    streamUrl: 'https://twitch.tv/valorant',
    metadata: { format: 'BO3', stage: 'Playoffs' },
    createdAt: ago(48),
    updatedAt: ago(12),
  },
  {
    id: 'evt-007',
    sport: Sport.TENNIS,
    league: 'ATP Masters 1000 - Miami',
    homeTeam: 'Carlos Alcaraz',
    awayTeam: 'Jannik Sinner',
    status: EventStatus.UPCOMING,
    startTime: h(12),
    venue: 'Hard Rock Stadium',
    metadata: { round: 'Final', surface: 'Hard' },
    createdAt: ago(96),
    updatedAt: ago(24),
  },
  {
    id: 'evt-008',
    sport: Sport.DOTA2,
    league: 'DreamLeague Season 23',
    homeTeam: 'Team Spirit',
    awayTeam: 'Tundra Esports',
    status: EventStatus.UPCOMING,
    startTime: h(18),
    streamUrl: 'https://twitch.tv/dreamleague',
    metadata: { format: 'BO5', stage: 'Grand Final' },
    createdAt: ago(72),
    updatedAt: ago(24),
  },
  {
    id: 'evt-009',
    sport: Sport.F1,
    league: 'Formula 1 - GP Australia',
    homeTeam: 'Max Verstappen',
    awayTeam: 'Lewis Hamilton',
    status: EventStatus.UPCOMING,
    startTime: h(24),
    venue: 'Albert Park Circuit',
    metadata: { session: 'Carrera', laps: 58 },
    createdAt: ago(168),
    updatedAt: ago(48),
  },
  {
    id: 'evt-010',
    sport: Sport.FOOTBALL,
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Arsenal',
    status: EventStatus.UPCOMING,
    startTime: h(26),
    venue: 'Etihad Stadium',
    metadata: { matchday: 29 },
    createdAt: ago(96),
    updatedAt: ago(24),
  },
  {
    id: 'evt-011',
    sport: Sport.ROCKETLEAGUE,
    league: 'RLCS 2026 Spring Major',
    homeTeam: 'Team BDS',
    awayTeam: 'G2 Stride',
    status: EventStatus.UPCOMING,
    startTime: h(30),
    streamUrl: 'https://twitch.tv/rocketleague',
    metadata: { format: 'BO7', stage: 'Semifinal' },
    createdAt: ago(48),
    updatedAt: ago(12),
  },

  // FINISHED (4)
  {
    id: 'evt-012',
    sport: Sport.FOOTBALL,
    league: 'UEFA Champions League',
    homeTeam: 'PSG',
    awayTeam: 'Inter Milan',
    homeScore: 1,
    awayScore: 3,
    status: EventStatus.FINISHED,
    startTime: ago(26),
    venue: 'Parc des Princes',
    metadata: { matchday: 'Cuartos de final' },
    createdAt: ago(72),
    updatedAt: ago(24),
  },
  {
    id: 'evt-013',
    sport: Sport.CS2,
    league: 'BLAST Premier Spring 2026',
    homeTeam: 'Team Vitality',
    awayTeam: 'Heroic',
    homeScore: 2,
    awayScore: 1,
    status: EventStatus.FINISHED,
    startTime: ago(48),
    streamUrl: 'https://twitch.tv/blastpremier',
    metadata: { format: 'BO3', maps: ['Inferno', 'Nuke', 'Ancient'] },
    createdAt: ago(96),
    updatedAt: ago(46),
  },
  {
    id: 'evt-014',
    sport: Sport.LOL,
    league: 'LEC Spring 2026',
    homeTeam: 'MAD Lions',
    awayTeam: 'Team BDS',
    homeScore: 2,
    awayScore: 0,
    status: EventStatus.FINISHED,
    startTime: ago(52),
    metadata: { format: 'BO3', week: 7 },
    createdAt: ago(120),
    updatedAt: ago(50),
  },
  {
    id: 'evt-015',
    sport: Sport.BASKETBALL,
    league: 'NBA',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Phoenix Suns',
    homeScore: 115,
    awayScore: 108,
    status: EventStatus.FINISHED,
    startTime: ago(72),
    venue: 'Chase Center',
    metadata: { quarter: 4, overtime: false },
    createdAt: ago(96),
    updatedAt: ago(70),
  },
];

export const mockBettingPartners: BettingPartner[] = [
  {
    id: 'bp-001',
    name: 'Bet365',
    bonusText: 'Hasta 100EUR en apuesta gratis',
    referralUrl: '#',
    isActive: false,
    order: 1,
  },
  {
    id: 'bp-002',
    name: 'Bwin',
    bonusText: '100% en tu primer deposito',
    referralUrl: '#',
    isActive: false,
    order: 2,
  },
  {
    id: 'bp-003',
    name: '888sport',
    bonusText: '30EUR gratis sin deposito',
    referralUrl: '#',
    isActive: false,
    order: 3,
  },
];

export function getEventsByStatus(status: EventStatus): Event[] {
  return mockEvents.filter(e => e.status === status);
}

export function getEventsBySport(sport: Sport): Event[] {
  return mockEvents.filter(e => e.sport === sport);
}

export function getLiveCount(): number {
  return mockEvents.filter(e => e.status === EventStatus.LIVE).length;
}

export function getFeaturedEvents(): Event[] {
  const liveFootball = mockEvents.find(e => e.status === EventStatus.LIVE && e.sport === Sport.FOOTBALL);
  const liveEsport = mockEvents.find(e => e.status === EventStatus.LIVE && ['CS2', 'LOL', 'DOTA2', 'VALORANT', 'ROCKETLEAGUE'].includes(e.sport));

  const featured: Event[] = [];
  if (liveFootball) featured.push(liveFootball);
  else {
    const upcomingFootball = mockEvents.find(e => e.status === EventStatus.UPCOMING && e.sport === Sport.FOOTBALL);
    if (upcomingFootball) featured.push(upcomingFootball);
  }
  if (liveEsport) featured.push(liveEsport);
  else {
    const upcomingEsport = mockEvents.find(e => e.status === EventStatus.UPCOMING && ['CS2', 'LOL', 'DOTA2', 'VALORANT', 'ROCKETLEAGUE'].includes(e.sport));
    if (upcomingEsport) featured.push(upcomingEsport);
  }

  return featured;
}
