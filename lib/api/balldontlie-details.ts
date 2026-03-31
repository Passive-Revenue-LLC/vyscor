import type { FixtureStatistic, H2HMatch } from './apifootball';
import { areTeamsMatching } from './team-name-normalizer';

const BDL_BASE_URL = 'https://api.balldontlie.io/v1';
const API_KEY = process.env.BALLDONTLIE_API_KEY;

// --- Types ---

interface BdlTeam {
  id: number;
  full_name: string;
  name: string;
  abbreviation: string;
  city: string;
}

interface BdlGame {
  id: number;
  date: string;
  status: string;
  home_team: BdlTeam;
  visitor_team: BdlTeam;
  home_team_score: number;
  visitor_team_score: number;
  season: number;
}

interface BdlPlayerStat {
  id: number;
  player: {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    team: BdlTeam;
  };
  game: { id: number };
  min: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  pf: number;
  fgm: number;
  fga: number;
  fg_pct: number;
  fg3m: number;
  fg3a: number;
  fg3_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
}

// --- Helpers ---

function bdlFetch(url: string, revalidate = 120) {
  if (!API_KEY) return null;
  return fetch(url, {
    headers: { Authorization: API_KEY },
    next: { revalidate },
  });
}

async function findBdlGame(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<BdlGame | null> {
  const res = await bdlFetch(`${BDL_BASE_URL}/games?dates[]=${date}`, 300);
  if (!res || !res.ok) return null;

  const data = await res.json();
  const games: BdlGame[] = data.data || [];

  for (const game of games) {
    const homeMatch = areTeamsMatching(homeTeam, game.home_team.full_name);
    const awayMatch = areTeamsMatching(awayTeam, game.visitor_team.full_name);
    if (homeMatch && awayMatch) return game;

    // Try reversed
    const homeMatchR = areTeamsMatching(homeTeam, game.visitor_team.full_name);
    const awayMatchR = areTeamsMatching(awayTeam, game.home_team.full_name);
    if (homeMatchR && awayMatchR) return game;
  }

  return null;
}

// --- Stats ---

export async function fetchBdlGameStats(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<FixtureStatistic[]> {
  if (!API_KEY) return [];

  const game = await findBdlGame(date, homeTeam, awayTeam);
  if (!game) return [];

  const res = await bdlFetch(
    `${BDL_BASE_URL}/stats?game_ids[]=${game.id}&per_page=100`
  );
  if (!res || !res.ok) return [];

  const data = await res.json();
  const playerStats: BdlPlayerStat[] = data.data || [];

  if (playerStats.length === 0) return [];

  // Aggregate player stats into team totals
  const homeId = game.home_team.id;
  const home = { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, turnover: 0, pf: 0, fgm: 0, fga: 0, fg3m: 0, fg3a: 0, ftm: 0, fta: 0, oreb: 0, dreb: 0 };
  const away = { ...home };

  for (const ps of playerStats) {
    const target = ps.player.team.id === homeId ? home : away;
    target.pts += ps.pts || 0;
    target.reb += ps.reb || 0;
    target.ast += ps.ast || 0;
    target.stl += ps.stl || 0;
    target.blk += ps.blk || 0;
    target.turnover += ps.turnover || 0;
    target.pf += ps.pf || 0;
    target.fgm += ps.fgm || 0;
    target.fga += ps.fga || 0;
    target.fg3m += ps.fg3m || 0;
    target.fg3a += ps.fg3a || 0;
    target.ftm += ps.ftm || 0;
    target.fta += ps.fta || 0;
    target.oreb += ps.oreb || 0;
    target.dreb += ps.dreb || 0;
  }

  const pct = (m: number, a: number) => (a > 0 ? `${((m / a) * 100).toFixed(1)}%` : '0%');

  return [
    { type: 'Points', home: home.pts, away: away.pts },
    { type: 'Field Goals Made', home: home.fgm, away: away.fgm },
    { type: 'Field Goals Attempted', home: home.fga, away: away.fga },
    { type: 'FG%', home: pct(home.fgm, home.fga), away: pct(away.fgm, away.fga) },
    { type: '3-Pointers Made', home: home.fg3m, away: away.fg3m },
    { type: '3-Pointers Attempted', home: home.fg3a, away: away.fg3a },
    { type: '3P%', home: pct(home.fg3m, home.fg3a), away: pct(away.fg3m, away.fg3a) },
    { type: 'Free Throws Made', home: home.ftm, away: away.ftm },
    { type: 'Free Throws Attempted', home: home.fta, away: away.fta },
    { type: 'FT%', home: pct(home.ftm, home.fta), away: pct(away.ftm, away.fta) },
    { type: 'Total Rebounds', home: home.reb, away: away.reb },
    { type: 'Offensive Rebounds', home: home.oreb, away: away.oreb },
    { type: 'Defensive Rebounds', home: home.dreb, away: away.dreb },
    { type: 'Assists', home: home.ast, away: away.ast },
    { type: 'Steals', home: home.stl, away: away.stl },
    { type: 'Blocks', home: home.blk, away: away.blk },
    { type: 'Turnovers', home: home.turnover, away: away.turnover },
    { type: 'Personal Fouls', home: home.pf, away: away.pf },
  ];
}

// --- H2H ---

export async function fetchBdlH2H(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<H2HMatch[]> {
  if (!API_KEY) return [];

  // Find team IDs first
  const game = await findBdlGame(date, homeTeam, awayTeam);
  if (!game) return [];

  const team1Id = game.home_team.id;
  const team2Id = game.visitor_team.id;
  const season = game.season || new Date().getFullYear();

  // Fetch games between these teams in current and previous season
  const matches: H2HMatch[] = [];

  for (const s of [season, season - 1]) {
    const res = await bdlFetch(
      `${BDL_BASE_URL}/games?seasons[]=${s}&team_ids[]=${team1Id}&per_page=100`,
      3600
    );
    if (!res || !res.ok) continue;

    const data = await res.json();
    const games: BdlGame[] = data.data || [];

    for (const g of games) {
      if (
        (g.home_team.id === team1Id && g.visitor_team.id === team2Id) ||
        (g.home_team.id === team2Id && g.visitor_team.id === team1Id)
      ) {
        matches.push({
          date: g.date,
          homeTeam: g.home_team.full_name,
          awayTeam: g.visitor_team.full_name,
          homeScore: g.home_team_score,
          awayScore: g.visitor_team_score,
          league: 'NBA',
        });
      }
    }
  }

  return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
}

export function isBdlAvailable(): boolean {
  return !!API_KEY;
}
