const API_KEY = process.env.API_FOOTBALL_KEY;
const NBA_BASE_URL = 'https://v2.nba.api-sports.io';

interface NbaGame {
  id: number;
  date: { start: string };
  status: { short: number; long: string };
  arena: { name: string; city: string; state: string };
  teams: {
    home: { id: number; name: string; nickname: string };
    visitors: { id: number; name: string; nickname: string };
  };
  scores: {
    home: { points: number | null };
    visitors: { points: number | null };
  };
  league: string;
}

const STATUS_MAP: Record<number, string> = {
  1: 'UPCOMING',
  2: 'LIVE',
  3: 'FINISHED',
};

export async function fetchNbaGames(date?: string) {
  if (!API_KEY) return [];

  const today = date || new Date().toISOString().split('T')[0];
  const res = await fetch(
    `${NBA_BASE_URL}/games?date=${today}`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const games: NbaGame[] = data.response || [];

  return games.map((game) => ({
    externalId: String(game.id),
    sport: 'NBA',
    league: 'NBA',
    homeTeam: game.teams.home.name,
    awayTeam: game.teams.visitors.name,
    homeScore: game.scores.home.points ?? undefined,
    awayScore: game.scores.visitors.points ?? undefined,
    status: STATUS_MAP[game.status.short] || 'UPCOMING',
    startTime: game.date.start,
    venue: game.arena?.name
      ? `${game.arena.name}, ${game.arena.city}`
      : undefined,
    metadata: {
      homeTeamId: game.teams.home.id,
      awayTeamId: game.teams.visitors.id,
    },
  }));
}
