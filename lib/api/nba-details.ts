import type { FixtureStatistic } from './apifootball';

const API_KEY = process.env.API_FOOTBALL_KEY;
const NBA_BASE_URL = 'https://v2.nba.api-sports.io';

interface NbaTeamStats {
  team: { id: number; name: string };
  statistics: Array<{
    fastBreakPoints: number;
    pointsInPaint: number;
    secondChancePoints: number;
    pointsOffTurnovers: number;
    points: number;
    fgm: number;
    fga: number;
    fgp: string;
    ftm: number;
    fta: number;
    ftp: string;
    tpm: number;
    tpa: number;
    tpp: string;
    offReb: number;
    defReb: number;
    totReb: number;
    assists: number;
    pFouls: number;
    steals: number;
    turnovers: number;
    blocks: number;
  }>;
}

const STAT_LABELS: Record<string, string> = {
  points: 'Points',
  fgm: 'Field Goals Made',
  fga: 'Field Goals Attempted',
  fgp: 'FG%',
  tpm: '3-Pointers Made',
  tpa: '3-Pointers Attempted',
  tpp: '3P%',
  ftm: 'Free Throws Made',
  fta: 'Free Throws Attempted',
  ftp: 'FT%',
  totReb: 'Total Rebounds',
  offReb: 'Offensive Rebounds',
  defReb: 'Defensive Rebounds',
  assists: 'Assists',
  steals: 'Steals',
  blocks: 'Blocks',
  turnovers: 'Turnovers',
  pFouls: 'Personal Fouls',
  fastBreakPoints: 'Fast Break Points',
  pointsInPaint: 'Points in Paint',
  secondChancePoints: '2nd Chance Points',
  pointsOffTurnovers: 'Points off Turnovers',
};

const STAT_ORDER = [
  'points',
  'fgm',
  'fga',
  'fgp',
  'tpm',
  'tpa',
  'tpp',
  'ftm',
  'fta',
  'ftp',
  'totReb',
  'offReb',
  'defReb',
  'assists',
  'steals',
  'blocks',
  'turnovers',
  'pFouls',
  'fastBreakPoints',
  'pointsInPaint',
  'secondChancePoints',
  'pointsOffTurnovers',
];

export async function fetchNbaGameStats(gameId: string): Promise<FixtureStatistic[]> {
  if (!API_KEY) return [];

  const res = await fetch(`${NBA_BASE_URL}/games/statistics?id=${gameId}`, {
    headers: { 'x-apisports-key': API_KEY },
    next: { revalidate: 120 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const response: NbaTeamStats[] = data.response || [];

  if (response.length < 2) return [];

  const homeStats = response[0].statistics?.[0];
  const awayStats = response[1].statistics?.[0];

  if (!homeStats || !awayStats) return [];

  return STAT_ORDER
    .filter((key) => {
      const h = homeStats[key as keyof typeof homeStats];
      const a = awayStats[key as keyof typeof awayStats];
      return h !== undefined && a !== undefined;
    })
    .map((key) => ({
      type: STAT_LABELS[key] || key,
      home: homeStats[key as keyof typeof homeStats] as string | number,
      away: awayStats[key as keyof typeof awayStats] as string | number,
    }));
}
