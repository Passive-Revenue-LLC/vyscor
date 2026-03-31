import type { FixtureStatistic, H2HMatch, TeamLineup } from './apifootball';

const PANDASCORE_BASE_URL = 'https://api.pandascore.co';
const API_KEY = process.env.PANDASCORE_API_KEY;

const SPORT_TO_GAME_SLUG: Record<string, string> = {
  CS2: 'csgo',
  LOL: 'lol',
  DOTA2: 'dota2',
  VALORANT: 'valorant',
  ROCKETLEAGUE: 'rl',
};

interface PandaScoreGame {
  id: number;
  position: number;
  status: string;
  winner: { id: number; type: string } | null;
  length: number | null;
}

interface PandaScorePlayer {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  image_url: string | null;
}

interface PandaScoreMatchDetail {
  id: number;
  name: string;
  number_of_games: number;
  games: PandaScoreGame[];
  opponents: Array<{
    opponent: {
      id: number;
      name: string;
      image_url: string;
      players?: PandaScorePlayer[];
    };
  }>;
  results: Array<{ team_id: number; score: number }>;
}

async function fetchMatchDetail(matchId: string): Promise<PandaScoreMatchDetail | null> {
  if (!API_KEY) return null;

  const res = await fetch(
    `${PANDASCORE_BASE_URL}/matches/${matchId}?token=${API_KEY}`,
    { next: { revalidate: 120 } }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function fetchEsportsMatchStats(matchId: string): Promise<FixtureStatistic[]> {
  const match = await fetchMatchDetail(matchId);
  if (!match) return [];

  const team1 = match.opponents[0]?.opponent;
  const team2 = match.opponents[1]?.opponent;
  if (!team1 || !team2) return [];

  const stats: FixtureStatistic[] = [];

  const result1 = match.results.find((r) => r.team_id === team1.id);
  const result2 = match.results.find((r) => r.team_id === team2.id);

  stats.push({
    type: 'Maps Won',
    home: result1?.score ?? 0,
    away: result2?.score ?? 0,
  });

  stats.push({
    type: 'Format',
    home: `BO${match.number_of_games}`,
    away: `BO${match.number_of_games}`,
  });

  const finishedGames = match.games
    .filter((g) => g.status === 'finished' || g.winner)
    .sort((a, b) => a.position - b.position);

  for (const game of finishedGames) {
    const winnerId = game.winner?.id;
    stats.push({
      type: `Map ${game.position}`,
      home: winnerId === team1.id ? 1 : 0,
      away: winnerId === team2.id ? 1 : 0,
    });
  }

  const totalLength = match.games.reduce((acc, g) => acc + (g.length || 0), 0);
  if (totalLength > 0) {
    const minutes = Math.floor(totalLength / 60);
    stats.push({
      type: 'Total Duration',
      home: `${minutes} min`,
      away: null,
    });
  }

  return stats;
}

export async function fetchEsportsH2H(
  sport: string,
  homeTeamId: string,
  awayTeamId: string
): Promise<H2HMatch[]> {
  const gameSlug = SPORT_TO_GAME_SLUG[sport];
  if (!gameSlug || !API_KEY) return [];

  const params = new URLSearchParams({
    token: API_KEY,
    'filter[opponent_id]': `${homeTeamId},${awayTeamId}`,
    'filter[status]': 'finished',
    sort: '-scheduled_at',
    per_page: '10',
  });

  const res = await fetch(`${PANDASCORE_BASE_URL}/${gameSlug}/matches?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const matches: Array<{
    scheduled_at: string;
    begin_at: string;
    opponents: Array<{ opponent: { name: string } }>;
    results: Array<{ score: number }>;
    tournament: { name: string };
    league: { name: string };
  }> = await res.json();

  return matches.map((m) => ({
    date: m.scheduled_at || m.begin_at,
    homeTeam: m.opponents?.[0]?.opponent?.name || 'TBD',
    awayTeam: m.opponents?.[1]?.opponent?.name || 'TBD',
    homeScore: m.results?.[0]?.score ?? null,
    awayScore: m.results?.[1]?.score ?? null,
    league: m.tournament?.name || m.league?.name || 'Desconocido',
  }));
}

export async function fetchEsportsLineups(matchId: string): Promise<TeamLineup[]> {
  const match = await fetchMatchDetail(matchId);
  if (!match || match.opponents.length < 2) return [];

  return match.opponents.map((o) => ({
    team: o.opponent.name,
    formation: null,
    startXI: (o.opponent.players || []).map((p, i) => ({
      name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown',
      number: i + 1,
      pos: p.role || 'Player',
    })),
    substitutes: [],
  }));
}
