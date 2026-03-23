const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string };
  };
  league: { name: string; round: string };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

export async function fetchFootballFixtures(date?: string) {
  if (!API_KEY) return [];

  const today = date || new Date().toISOString().split('T')[0];
  const res = await fetch(
    `${API_FOOTBALL_BASE_URL}/fixtures?date=${today}`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.response as ApiFootballFixture[];
}

export function mapApiFootballToEvent(fixture: ApiFootballFixture) {
  const statusMap: Record<string, string> = {
    NS: 'UPCOMING',
    '1H': 'LIVE',
    HT: 'LIVE',
    '2H': 'LIVE',
    ET: 'LIVE',
    P: 'LIVE',
    FT: 'FINISHED',
    AET: 'FINISHED',
    PEN: 'FINISHED',
    PST: 'CANCELLED',
    CANC: 'CANCELLED',
  };

  return {
    externalId: String(fixture.fixture.id),
    sport: 'FOOTBALL',
    league: fixture.league.name,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeScore: fixture.goals.home ?? undefined,
    awayScore: fixture.goals.away ?? undefined,
    status: statusMap[fixture.fixture.status.short] || 'UPCOMING',
    startTime: fixture.fixture.date,
    venue: fixture.fixture.venue?.name,
    metadata: {
      minute: fixture.fixture.status.elapsed,
      round: fixture.league.round,
    },
  };
}
