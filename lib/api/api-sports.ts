const API_KEY = process.env.API_FOOTBALL_KEY;

interface SportApiConfig {
  baseUrl: string;
  endpoint: string;
  sport: string;
  extractScore: (scores: Record<string, unknown>) => { home: number | null; away: number | null };
}

interface StandardGame {
  id: number;
  date: string;
  status: { short: string; long?: string };
  league: { name: string };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  scores: Record<string, unknown>;
}

const STATUS_MAP: Record<string, string> = {
  NS: 'UPCOMING',
  TBD: 'UPCOMING',
  '1H': 'LIVE',
  '2H': 'LIVE',
  HT: 'LIVE',
  ET: 'LIVE',
  BT: 'LIVE',
  P: 'LIVE',
  Q1: 'LIVE',
  Q2: 'LIVE',
  Q3: 'LIVE',
  Q4: 'LIVE',
  OT: 'LIVE',
  LIVE: 'LIVE',
  IN1: 'LIVE',
  IN2: 'LIVE',
  IN3: 'LIVE',
  IN4: 'LIVE',
  IN5: 'LIVE',
  IN6: 'LIVE',
  IN7: 'LIVE',
  IN8: 'LIVE',
  IN9: 'LIVE',
  S1: 'LIVE',
  S2: 'LIVE',
  S3: 'LIVE',
  S4: 'LIVE',
  S5: 'LIVE',
  FT: 'FINISHED',
  AET: 'FINISHED',
  PEN: 'FINISHED',
  AOT: 'FINISHED',
  AP: 'FINISHED',
  PST: 'CANCELLED',
  CANC: 'CANCELLED',
  ABD: 'CANCELLED',
  AWD: 'CANCELLED',
  WO: 'CANCELLED',
  INT: 'CANCELLED',
  SUSP: 'CANCELLED',
};

function directScores(scores: Record<string, unknown>) {
  return {
    home: typeof scores.home === 'number' ? scores.home : null,
    away: typeof scores.away === 'number' ? scores.away : null,
  };
}

function totalScores(scores: Record<string, unknown>) {
  const home = scores.home as Record<string, unknown> | null;
  const away = scores.away as Record<string, unknown> | null;
  return {
    home: home && typeof home.total === 'number' ? home.total : null,
    away: away && typeof away.total === 'number' ? away.total : null,
  };
}

export const SPORT_APIS: SportApiConfig[] = [
  {
    baseUrl: 'https://v1.basketball.api-sports.io',
    endpoint: 'games',
    sport: 'BASKETBALL',
    extractScore: totalScores,
  },
  {
    baseUrl: 'https://v1.hockey.api-sports.io',
    endpoint: 'games',
    sport: 'HOCKEY',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.baseball.api-sports.io',
    endpoint: 'games',
    sport: 'BASEBALL',
    extractScore: totalScores,
  },
  {
    baseUrl: 'https://v1.handball.api-sports.io',
    endpoint: 'games',
    sport: 'HANDBALL',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.volleyball.api-sports.io',
    endpoint: 'games',
    sport: 'VOLLEYBALL',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.rugby.api-sports.io',
    endpoint: 'games',
    sport: 'RUGBY',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.american-football.api-sports.io',
    endpoint: 'games',
    sport: 'NFL',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.afl.api-sports.io',
    endpoint: 'games',
    sport: 'AFL',
    extractScore: directScores,
  },
  {
    baseUrl: 'https://v1.mma.api-sports.io',
    endpoint: 'fights',
    sport: 'MMA',
    extractScore: directScores,
  },
];

async function fetchSportGames(config: SportApiConfig, date?: string) {
  if (!API_KEY) return [];

  const today = date || new Date().toISOString().split('T')[0];
  const res = await fetch(
    `${config.baseUrl}/${config.endpoint}?date=${today}`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const games: StandardGame[] = data.response || [];

  return games.map((game) => {
    const scores = config.extractScore(game.scores);
    return {
      externalId: String(game.id),
      sport: config.sport,
      league: game.league.name,
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeScore: scores.home ?? undefined,
      awayScore: scores.away ?? undefined,
      status: STATUS_MAP[game.status.short] || 'UPCOMING',
      startTime: game.date,
    };
  });
}

export async function fetchAllSportsGames(date?: string) {
  const results = await Promise.allSettled(
    SPORT_APIS.map((config) => fetchSportGames(config, date))
  );

  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}
