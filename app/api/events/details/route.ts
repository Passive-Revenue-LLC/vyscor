import { NextRequest, NextResponse } from 'next/server';
import {
  fetchFixtureStatistics,
  fetchH2H,
  fetchLineups,
} from '@/lib/api/apifootball';
import {
  fetchEsportsMatchStats,
  fetchEsportsH2H,
  fetchEsportsLineups,
} from '@/lib/api/pandascore-details';
import { fetchNbaGameStats } from '@/lib/api/nba-details';
import {
  fetchSportStats,
  fetchSportH2H,
  isSupportedSport,
} from '@/lib/api/api-sports-details';
import {
  fetchNhlStats,
  fetchNhlH2H,
  fetchNhlLineups,
  isNhlGame,
} from '@/lib/api/nhl-details';
import {
  fetchBdlGameStats,
  fetchBdlH2H,
  isBdlAvailable,
} from '@/lib/api/balldontlie-details';
import {
  fetchOpenDotaStats,
  fetchOpenDotaH2H,
} from '@/lib/api/opendota-details';
import {
  fetchRiotLoLStats,
  fetchRiotLoLH2H,
  isRiotAvailable,
} from '@/lib/api/riot-details';

const ESPORTS = new Set(['CS2', 'LOL', 'DOTA2', 'VALORANT', 'ROCKETLEAGUE']);

interface RequestParams {
  fixtureId: string;
  sport: string;
  tab: string | null;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  date: string | null;
  league: string | null;
}

function parseParams(searchParams: URLSearchParams): RequestParams {
  return {
    fixtureId: searchParams.get('fixtureId')!,
    sport: searchParams.get('sport')!,
    tab: searchParams.get('tab'),
    homeTeamId: searchParams.get('homeTeamId'),
    awayTeamId: searchParams.get('awayTeamId'),
    homeTeam: searchParams.get('homeTeam'),
    awayTeam: searchParams.get('awayTeam'),
    date: searchParams.get('date'),
    league: searchParams.get('league'),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fixtureId = searchParams.get('fixtureId');
  const sport = searchParams.get('sport');

  if (!fixtureId || !sport) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const params = parseParams(searchParams);

  try {
    // Football
    if (sport === 'FOOTBALL') {
      return handleFootball(params);
    }

    // Esports (with enrichment from OpenDota / Riot)
    if (ESPORTS.has(sport)) {
      return handleEsports(params);
    }

    // NBA (with BallDontLie enrichment)
    if (sport === 'NBA') {
      return handleNba(params);
    }

    // Hockey (with NHL API enrichment)
    if (sport === 'HOCKEY') {
      return handleHockey(params);
    }

    // Other api-sports based sports
    if (isSupportedSport(sport)) {
      return handleApiSport(params);
    }

    // Unsupported sports (F1, MMA, AFL)
    return NextResponse.json({
      available: false,
      message: 'Datos detallados no disponibles para este deporte por ahora',
    });
  } catch {
    return NextResponse.json({ available: false });
  }
}

// --- Football (API-Football) ---

async function handleFootball(p: RequestParams) {
  if (p.tab === 'stats') {
    const statistics = await fetchFixtureStatistics(p.fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (p.tab === 'h2h') {
    if (!p.homeTeamId || !p.awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }
    const matches = await fetchH2H(Number(p.homeTeamId), Number(p.awayTeamId));
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (p.tab === 'lineups') {
    const lineups = await fetchLineups(p.fixtureId);
    return NextResponse.json({ available: lineups.length > 0, lineups });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

// --- Esports (PandaScore + OpenDota + Riot enrichment) ---

async function handleEsports(p: RequestParams) {
  if (p.tab === 'stats') {
    // Try enriched sources first based on specific game
    if (p.sport === 'DOTA2' && p.date && p.homeTeam && p.awayTeam) {
      const odStats = await fetchOpenDotaStats(p.date, p.homeTeam, p.awayTeam);
      if (odStats.length > 0) {
        return NextResponse.json({ available: true, statistics: odStats });
      }
    }

    if (p.sport === 'LOL' && isRiotAvailable() && p.date && p.homeTeam && p.awayTeam) {
      const riotStats = await fetchRiotLoLStats(p.date, p.homeTeam, p.awayTeam);
      if (riotStats.length > 0) {
        return NextResponse.json({ available: true, statistics: riotStats });
      }
    }

    // Fall back to PandaScore
    const statistics = await fetchEsportsMatchStats(p.fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (p.tab === 'h2h') {
    if (!p.homeTeamId || !p.awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }

    // Try OpenDota H2H for Dota 2
    if (p.sport === 'DOTA2' && p.homeTeam && p.awayTeam && p.date) {
      const odH2H = await fetchOpenDotaH2H(p.date, p.homeTeam, p.awayTeam);
      if (odH2H.length > 0) {
        return NextResponse.json({ available: true, matches: odH2H });
      }
    }

    // Try Riot H2H for LoL
    if (p.sport === 'LOL' && isRiotAvailable() && p.homeTeam && p.awayTeam && p.date) {
      const riotH2H = await fetchRiotLoLH2H(p.date, p.homeTeam, p.awayTeam);
      if (riotH2H.length > 0) {
        return NextResponse.json({ available: true, matches: riotH2H });
      }
    }

    // Fall back to PandaScore
    const matches = await fetchEsportsH2H(p.sport, p.homeTeamId, p.awayTeamId);
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (p.tab === 'lineups') {
    const lineups = await fetchEsportsLineups(p.fixtureId);
    return NextResponse.json({ available: lineups.length > 0, lineups });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

// --- NBA (api-sports + BallDontLie enrichment) ---

async function handleNba(p: RequestParams) {
  if (p.tab === 'stats') {
    // Try BallDontLie first (richer player-level box score)
    if (isBdlAvailable() && p.date && p.homeTeam && p.awayTeam) {
      const bdlStats = await fetchBdlGameStats(p.date, p.homeTeam, p.awayTeam);
      if (bdlStats.length > 0) {
        return NextResponse.json({ available: true, statistics: bdlStats });
      }
    }

    // Fall back to api-sports NBA
    const statistics = await fetchNbaGameStats(p.fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (p.tab === 'h2h') {
    // Try BallDontLie H2H
    if (isBdlAvailable() && p.date && p.homeTeam && p.awayTeam) {
      const bdlH2H = await fetchBdlH2H(p.date, p.homeTeam, p.awayTeam);
      if (bdlH2H.length > 0) {
        return NextResponse.json({ available: true, matches: bdlH2H });
      }
    }

    return NextResponse.json({
      available: false,
      message: 'Historial H2H no disponible para NBA por ahora',
    });
  }

  if (p.tab === 'lineups') {
    return NextResponse.json({
      available: false,
      message: 'Alineaciones no disponibles para NBA',
    });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

// --- Hockey (api-sports + NHL API enrichment) ---

async function handleHockey(p: RequestParams) {
  const useNhl = p.date && p.homeTeam && p.awayTeam && isNhlGame(p.league || '');

  if (p.tab === 'stats') {
    // Try NHL API first for NHL games
    if (useNhl) {
      const nhlStats = await fetchNhlStats(p.date!, p.homeTeam!, p.awayTeam!);
      if (nhlStats.length > 0) {
        return NextResponse.json({ available: true, statistics: nhlStats });
      }
    }

    // Fall back to api-sports
    const statistics = await fetchSportStats('HOCKEY', p.fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (p.tab === 'h2h') {
    // Try NHL H2H first
    if (useNhl) {
      const nhlH2H = await fetchNhlH2H(p.homeTeam!, p.awayTeam!);
      if (nhlH2H.length > 0) {
        return NextResponse.json({ available: true, matches: nhlH2H });
      }
    }

    // Fall back to api-sports H2H
    if (p.homeTeamId && p.awayTeamId) {
      const matches = await fetchSportH2H('HOCKEY', p.homeTeamId, p.awayTeamId);
      return NextResponse.json({ available: matches.length > 0, matches });
    }

    return NextResponse.json({ available: false, matches: [] });
  }

  if (p.tab === 'lineups') {
    // Try NHL lineups
    if (useNhl) {
      const lineups = await fetchNhlLineups(p.date!, p.homeTeam!, p.awayTeam!);
      if (lineups.length > 0) {
        return NextResponse.json({ available: true, lineups });
      }
    }

    return NextResponse.json({
      available: false,
      message: 'Alineaciones no disponibles para este deporte',
    });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

// --- Other api-sports based sports ---

async function handleApiSport(p: RequestParams) {
  if (p.tab === 'stats') {
    const statistics = await fetchSportStats(p.sport, p.fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (p.tab === 'h2h') {
    if (!p.homeTeamId || !p.awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }
    const matches = await fetchSportH2H(p.sport, p.homeTeamId, p.awayTeamId);
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (p.tab === 'lineups') {
    return NextResponse.json({
      available: false,
      message: 'Alineaciones no disponibles para este deporte',
    });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}
