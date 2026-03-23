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
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
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

// --- Statistics ---

export interface FixtureStatistic {
  type: string;
  home: string | number | null;
  away: string | number | null;
}

export async function fetchFixtureStatistics(fixtureId: string): Promise<FixtureStatistic[]> {
  if (!API_KEY) return [];

  const res = await fetch(
    `${API_FOOTBALL_BASE_URL}/fixtures/statistics?fixture=${fixtureId}`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 120 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const response = data.response;
  if (!response || response.length < 2) return [];

  const homeStats = response[0].statistics as Array<{ type: string; value: string | number | null }>;
  const awayStats = response[1].statistics as Array<{ type: string; value: string | number | null }>;

  return homeStats.map((stat, i) => ({
    type: stat.type,
    home: stat.value,
    away: awayStats[i]?.value ?? null,
  }));
}

// --- H2H ---

export interface H2HMatch {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  league: string;
}

export async function fetchH2H(homeTeamId: number, awayTeamId: number): Promise<H2HMatch[]> {
  if (!API_KEY) return [];

  const res = await fetch(
    `${API_FOOTBALL_BASE_URL}/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=10`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const fixtures: ApiFootballFixture[] = data.response || [];

  return fixtures.map((f) => ({
    date: f.fixture.date,
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    homeScore: f.goals.home,
    awayScore: f.goals.away,
    league: f.league.name,
  }));
}

// --- Lineups ---

export interface PlayerInfo {
  name: string;
  number: number;
  pos: string;
}

export interface TeamLineup {
  team: string;
  formation: string | null;
  startXI: PlayerInfo[];
  substitutes: PlayerInfo[];
}

export async function fetchLineups(fixtureId: string): Promise<TeamLineup[]> {
  if (!API_KEY) return [];

  const res = await fetch(
    `${API_FOOTBALL_BASE_URL}/fixtures/lineups?fixture=${fixtureId}`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const response = data.response || [];

  return response.map((entry: {
    team: { name: string };
    formation: string | null;
    startXI: Array<{ player: { name: string; number: number; pos: string } }>;
    substitutes: Array<{ player: { name: string; number: number; pos: string } }>;
  }) => ({
    team: entry.team.name,
    formation: entry.formation,
    startXI: (entry.startXI || []).map((p) => ({
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
    })),
    substitutes: (entry.substitutes || []).map((p) => ({
      name: p.player.name,
      number: p.player.number,
      pos: p.player.pos,
    })),
  }));
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
      homeTeamId: fixture.teams.home.id,
      awayTeamId: fixture.teams.away.id,
    },
  };
}
