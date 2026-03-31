import type { FixtureStatistic, H2HMatch, TeamLineup, PlayerInfo } from './apifootball';
import { areTeamsMatching } from './team-name-normalizer';

const NHL_BASE_URL = 'https://api-web.nhle.com/v1';

// --- Types ---

interface NhlScheduleGame {
  id: number;
  startTimeUTC: string;
  gameState: string;
  homeTeam: {
    id: number;
    abbrev: string;
    name: { default: string };
    score?: number;
  };
  awayTeam: {
    id: number;
    abbrev: string;
    name: { default: string };
    score?: number;
  };
}

interface NhlBoxscoreTeamStats {
  category: string;
  homeValue: string;
  awayValue: string;
}

interface NhlBoxscorePlayer {
  name: { default: string };
  sweaterNumber: number;
  position: string;
}

interface NhlBoxscore {
  id: number;
  homeTeam: {
    name: { default: string };
    abbrev: string;
  };
  awayTeam: {
    name: { default: string };
    abbrev: string;
  };
  summary?: {
    teamGameStats?: NhlBoxscoreTeamStats[];
  };
  playerByGameStats?: {
    homeTeam?: {
      forwards?: NhlBoxscorePlayer[];
      defense?: NhlBoxscorePlayer[];
      goalies?: NhlBoxscorePlayer[];
    };
    awayTeam?: {
      forwards?: NhlBoxscorePlayer[];
      defense?: NhlBoxscorePlayer[];
      goalies?: NhlBoxscorePlayer[];
    };
  };
}

// --- Stat labels ---

const STAT_LABELS: Record<string, string> = {
  sog: 'Tiros a puerta',
  faceoffWinningPctg: '% Faceoffs ganados',
  powerPlay: 'Power Play',
  powerPlayPctg: '% Power Play',
  pim: 'Minutos de penalizacion',
  hits: 'Golpes',
  blockedShots: 'Tiros bloqueados',
  giveaways: 'Entregas',
  takeaways: 'Recuperaciones',
};

// --- ID Resolution ---

async function findNhlGameId(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<number | null> {
  try {
    const res = await fetch(`${NHL_BASE_URL}/score/${date}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const games: NhlScheduleGame[] = data.games || [];

    for (const game of games) {
      const homeMatch = areTeamsMatching(homeTeam, game.homeTeam.name.default);
      const awayMatch = areTeamsMatching(awayTeam, game.awayTeam.name.default);

      if (homeMatch && awayMatch) return game.id;

      // Try reversed (teams might be swapped between APIs)
      const homeMatchR = areTeamsMatching(homeTeam, game.awayTeam.name.default);
      const awayMatchR = areTeamsMatching(awayTeam, game.homeTeam.name.default);

      if (homeMatchR && awayMatchR) return game.id;
    }

    return null;
  } catch {
    return null;
  }
}

// --- Stats ---

export async function fetchNhlStats(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<FixtureStatistic[]> {
  const gameId = await findNhlGameId(date, homeTeam, awayTeam);
  if (!gameId) return [];

  try {
    const res = await fetch(`${NHL_BASE_URL}/gamecenter/${gameId}/boxscore`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) return [];

    const boxscore: NhlBoxscore = await res.json();
    const teamStats = boxscore.summary?.teamGameStats;

    if (!teamStats || teamStats.length === 0) return [];

    return teamStats.map((stat) => ({
      type: STAT_LABELS[stat.category] || stat.category,
      home: stat.homeValue,
      away: stat.awayValue,
    }));
  } catch {
    return [];
  }
}

// --- H2H ---

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchNhlH2H(homeTeam: string, awayTeam: string): Promise<H2HMatch[]> {
  // The NHL API doesn't have a direct H2H endpoint.
  // Return empty and let the caller fall back to api-sports.
  return [];
}

// --- Lineups ---

export async function fetchNhlLineups(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<TeamLineup[]> {
  const gameId = await findNhlGameId(date, homeTeam, awayTeam);
  if (!gameId) return [];

  try {
    const res = await fetch(`${NHL_BASE_URL}/gamecenter/${gameId}/boxscore`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const boxscore: NhlBoxscore = await res.json();
    const playerStats = boxscore.playerByGameStats;

    if (!playerStats) return [];

    const buildLineup = (
      teamName: string,
      teamData?: {
        forwards?: NhlBoxscorePlayer[];
        defense?: NhlBoxscorePlayer[];
        goalies?: NhlBoxscorePlayer[];
      }
    ): TeamLineup => {
      if (!teamData) {
        return { team: teamName, formation: null, startXI: [], substitutes: [] };
      }

      const mapPlayers = (
        players: NhlBoxscorePlayer[] | undefined,
        pos: string
      ): PlayerInfo[] =>
        (players || []).map((p) => ({
          name: p.name.default,
          number: p.sweaterNumber,
          pos,
        }));

      return {
        team: teamName,
        formation: null,
        startXI: [
          ...mapPlayers(teamData.forwards, 'DEL'),
          ...mapPlayers(teamData.defense, 'DEF'),
          ...mapPlayers(teamData.goalies, 'POR'),
        ],
        substitutes: [],
      };
    };

    return [
      buildLineup(boxscore.homeTeam.name.default, playerStats.homeTeam),
      buildLineup(boxscore.awayTeam.name.default, playerStats.awayTeam),
    ];
  } catch {
    return [];
  }
}

export function isNhlGame(league: string): boolean {
  const l = league.toLowerCase();
  return l === 'nhl' || l.includes('national hockey league');
}
