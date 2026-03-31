import type { FixtureStatistic, H2HMatch } from './apifootball';
import { areTeamsMatching } from './team-name-normalizer';

const LOL_ESPORTS_BASE = 'https://esports-api.lolesports.com/persisted/gw';
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// --- Types ---

interface EsportsEvent {
  id: string;
  startTime: string;
  state: string;
  type: string;
  match: {
    id: string;
    teams: Array<{
      name: string;
      code: string;
      result: { outcome: string | null; gameWins: number } | null;
    }>;
    strategy: { type: string; count: number };
  };
  league: { name: string; slug: string };
  tournament: { id: string };
  games: Array<{
    number: number;
    id: string;
    state: string;
    teams: Array<{
      id: string;
      side: string;
    }>;
    vods: Array<{ parameter: string; locale: string }>;
  }>;
}

interface EsportsEventDetail {
  id: string;
  games: Array<{
    number: number;
    id: string;
    state: string;
    teams: Array<{
      id: string;
      side: string;
      result: {
        outcome: string | null;
        kills: number;
        deaths: number;
        assists: number;
        gold: number;
        towers: number;
        barons: number;
        dragons: number;
        inhibitors: number;
      } | null;
      players: Array<{
        summonerName: string;
        championId: string;
        role: string;
      }>;
    }>;
  }>;
}

// --- Helpers ---

function esportsFetch(endpoint: string, revalidate = 300) {
  if (!RIOT_API_KEY) return null;

  return fetch(`${LOL_ESPORTS_BASE}${endpoint}`, {
    headers: {
      'x-api-key': RIOT_API_KEY,
    },
    next: { revalidate },
  });
}

// --- ID Resolution ---

async function findLoLEvent(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<EsportsEvent | null> {
  // Fetch schedule around the date
  const res = await esportsFetch(`/getSchedule?hl=es-ES`);
  if (!res || !res.ok) return null;

  try {
    const data = await res.json();
    const events: EsportsEvent[] = data?.data?.schedule?.events || [];

    const targetDate = date.split('T')[0];

    for (const event of events) {
      const eventDate = event.startTime?.split('T')[0];
      if (eventDate !== targetDate) continue;

      const teams = event.match?.teams || [];
      if (teams.length < 2) continue;

      const team1Name = teams[0].name;
      const team2Name = teams[1].name;

      if (
        (areTeamsMatching(homeTeam, team1Name) && areTeamsMatching(awayTeam, team2Name)) ||
        (areTeamsMatching(homeTeam, team2Name) && areTeamsMatching(awayTeam, team1Name))
      ) {
        return event;
      }
    }
  } catch {
    // Fall through
  }

  return null;
}

// --- Stats ---

export async function fetchRiotLoLStats(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<FixtureStatistic[]> {
  if (!RIOT_API_KEY) return [];

  const event = await findLoLEvent(date, homeTeam, awayTeam);
  if (!event) return [];

  // Get detailed event data
  const res = await esportsFetch(`/getEventDetails?hl=es-ES&id=${event.id}`, 120);
  if (!res || !res.ok) return [];

  try {
    const data = await res.json();
    const detail: EsportsEventDetail = data?.data?.event;
    if (!detail?.games) return [];

    const stats: FixtureStatistic[] = [];

    // Overall match score from the match-level data
    const matchTeams = event.match.teams;
    if (matchTeams.length >= 2) {
      stats.push({
        type: 'Maps Won',
        home: matchTeams[0].result?.gameWins ?? 0,
        away: matchTeams[1].result?.gameWins ?? 0,
      });

      stats.push({
        type: 'Format',
        home: `BO${event.match.strategy.count}`,
        away: `BO${event.match.strategy.count}`,
      });
    }

    // Per-game stats
    for (const game of detail.games) {
      if (game.state !== 'completed') continue;

      const t1 = game.teams[0]?.result;
      const t2 = game.teams[1]?.result;

      if (!t1 || !t2) continue;

      const gameLabel = `Game ${game.number}`;

      stats.push({ type: `${gameLabel} - Kills`, home: t1.kills, away: t2.kills });
      stats.push({ type: `${gameLabel} - Gold`, home: t1.gold, away: t2.gold });
      stats.push({ type: `${gameLabel} - Torres`, home: t1.towers, away: t2.towers });
      stats.push({ type: `${gameLabel} - Dragones`, home: t1.dragons, away: t2.dragons });
      stats.push({ type: `${gameLabel} - Barones`, home: t1.barons, away: t2.barons });
    }

    return stats;
  } catch {
    return [];
  }
}

// --- H2H ---

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchRiotLoLH2H(date: string, homeTeam: string, awayTeam: string): Promise<H2HMatch[]> {
  if (!RIOT_API_KEY) return [];

  // The LoL Esports API schedule can show past events, but finding H2H
  // between specific teams requires paginating through events.
  // For now, return empty and let the caller fall back to PandaScore.
  return [];
}

export function isRiotAvailable(): boolean {
  return !!RIOT_API_KEY;
}
