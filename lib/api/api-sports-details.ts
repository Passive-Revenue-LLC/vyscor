import type { FixtureStatistic, H2HMatch } from './apifootball';

const API_KEY = process.env.API_FOOTBALL_KEY;

interface SportDetailConfig {
  baseUrl: string;
  statsEndpoint: string;
  h2hEndpoint: string | null;
  statLabels: Record<string, string>;
}

const SPORT_DETAIL_CONFIGS: Record<string, SportDetailConfig> = {
  BASKETBALL: {
    baseUrl: 'https://v1.basketball.api-sports.io',
    statsEndpoint: 'statistics',
    h2hEndpoint: 'games',
    statLabels: {
      points: 'Puntos',
      fieldGoalsMade: 'Tiros de campo anotados',
      fieldGoalsAttempted: 'Tiros de campo intentados',
      fieldGoalsPct: '% Tiros de campo',
      threePointsMade: 'Triples anotados',
      threePointsAttempted: 'Triples intentados',
      threePointsPct: '% Triples',
      freeThrowsMade: 'Tiros libres anotados',
      freeThrowsAttempted: 'Tiros libres intentados',
      freeThrowsPct: '% Tiros libres',
      rebounds: 'Rebotes',
      assists: 'Asistencias',
      steals: 'Robos',
      blocks: 'Tapones',
      turnovers: 'Perdidas',
    },
  },
  HOCKEY: {
    baseUrl: 'https://v1.hockey.api-sports.io',
    statsEndpoint: 'games/events',
    h2hEndpoint: 'games/h2h',
    statLabels: {
      goals: 'Goles',
      penalties: 'Penalizaciones',
    },
  },
  BASEBALL: {
    baseUrl: 'https://v1.baseball.api-sports.io',
    statsEndpoint: 'games/events',
    h2hEndpoint: 'games/h2h',
    statLabels: {
      hits: 'Hits',
      runs: 'Carreras',
      errors: 'Errores',
    },
  },
  HANDBALL: {
    baseUrl: 'https://v1.handball.api-sports.io',
    statsEndpoint: 'games/statistics',
    h2hEndpoint: 'games/h2h',
    statLabels: {},
  },
  VOLLEYBALL: {
    baseUrl: 'https://v1.volleyball.api-sports.io',
    statsEndpoint: 'games/statistics',
    h2hEndpoint: 'games/h2h',
    statLabels: {},
  },
  RUGBY: {
    baseUrl: 'https://v1.rugby.api-sports.io',
    statsEndpoint: 'games/statistics',
    h2hEndpoint: 'games/h2h',
    statLabels: {},
  },
  NFL: {
    baseUrl: 'https://v1.american-football.api-sports.io',
    statsEndpoint: 'games/statistics/teams',
    h2hEndpoint: 'games',
    statLabels: {
      first_downs: 'Primeros intentos',
      total_yards: 'Yardas totales',
      passing_yards: 'Yardas de pase',
      rushing_yards: 'Yardas de carrera',
      turnovers: 'Perdidas de balon',
      penalties: 'Penalizaciones',
      possession: 'Posesion',
    },
  },
};

export async function fetchSportStats(
  sport: string,
  gameId: string
): Promise<FixtureStatistic[]> {
  const config = SPORT_DETAIL_CONFIGS[sport];
  if (!config || !API_KEY) return [];

  const res = await fetch(`${config.baseUrl}/${config.statsEndpoint}?id=${gameId}`, {
    headers: { 'x-apisports-key': API_KEY },
    next: { revalidate: 120 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const response = data.response;

  if (!response || !Array.isArray(response)) return [];

  // NFL has a different response format: response[0].teams and response[0].statistics
  if (sport === 'NFL' && response.length > 0) {
    return parseNflStats(response, config.statLabels);
  }

  // Generic api-sports format: two team entries with statistics arrays
  if (response.length >= 2) {
    return parseGenericStats(response, config.statLabels);
  }

  return [];
}

function parseNflStats(
  response: Array<{
    teams: { home: { name: string }; away: { name: string } };
    statistics: Array<{ name: string; home: string | number | null; away: string | number | null }>;
  }>,
  labels: Record<string, string>
): FixtureStatistic[] {
  const entry = response[0];
  if (!entry?.statistics) return [];

  return entry.statistics.map((stat) => ({
    type: labels[stat.name] || stat.name,
    home: stat.home,
    away: stat.away,
  }));
}

function parseGenericStats(
  response: Array<{
    team?: { name: string };
    statistics?: Array<{ type?: string; value?: string | number | null }>;
    [key: string]: unknown;
  }>,
  labels: Record<string, string>
): FixtureStatistic[] {
  const homeEntry = response[0];
  const awayEntry = response[1];

  // If entries have a statistics array
  if (Array.isArray(homeEntry.statistics) && Array.isArray(awayEntry.statistics)) {
    return homeEntry.statistics.map((stat, i) => ({
      type: labels[stat.type || ''] || stat.type || `Stat ${i + 1}`,
      home: stat.value ?? null,
      away: awayEntry.statistics![i]?.value ?? null,
    }));
  }

  // Flat object format - extract numeric fields as stats
  const stats: FixtureStatistic[] = [];
  const skipKeys = ['team', 'statistics', 'group'];

  for (const key of Object.keys(homeEntry)) {
    if (skipKeys.includes(key)) continue;
    const homeVal = homeEntry[key];
    const awayVal = awayEntry[key];
    if (typeof homeVal === 'number' || typeof homeVal === 'string') {
      stats.push({
        type: labels[key] || key,
        home: homeVal as string | number,
        away: (awayVal as string | number) ?? null,
      });
    }
  }

  return stats;
}

export async function fetchSportH2H(
  sport: string,
  homeTeamId: string,
  awayTeamId: string
): Promise<H2HMatch[]> {
  const config = SPORT_DETAIL_CONFIGS[sport];
  if (!config?.h2hEndpoint || !API_KEY) return [];

  const h2hParam =
    config.h2hEndpoint === 'games/h2h'
      ? `h2h=${homeTeamId}-${awayTeamId}&last=10`
      : `h2h=${homeTeamId}-${awayTeamId}&last=10`;

  const res = await fetch(`${config.baseUrl}/${config.h2hEndpoint}?${h2hParam}`, {
    headers: { 'x-apisports-key': API_KEY },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const games: Array<{
    date: string;
    teams: { home: { name: string }; away: { name: string } };
    scores: Record<string, unknown>;
    league: { name: string };
  }> = data.response || [];

  return games.map((g) => {
    const scores = extractScores(sport, g.scores);
    return {
      date: g.date,
      homeTeam: g.teams.home.name,
      awayTeam: g.teams.away.name,
      homeScore: scores.home,
      awayScore: scores.away,
      league: g.league?.name || sport,
    };
  });
}

function extractScores(
  sport: string,
  scores: Record<string, unknown>
): { home: number | null; away: number | null } {
  // Some sports use scores.home/away directly
  if (typeof scores.home === 'number' && typeof scores.away === 'number') {
    return { home: scores.home, away: scores.away };
  }

  // Some use scores.home.total / scores.away.total
  const home = scores.home as Record<string, unknown> | null;
  const away = scores.away as Record<string, unknown> | null;
  if (home && typeof home.total === 'number') {
    return {
      home: home.total,
      away: (away as Record<string, unknown>)?.total as number | null ?? null,
    };
  }

  return { home: null, away: null };
}

export function isSupportedSport(sport: string): boolean {
  return sport in SPORT_DETAIL_CONFIGS;
}
