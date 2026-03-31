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

const ESPORTS = new Set(['CS2', 'LOL', 'DOTA2', 'VALORANT', 'ROCKETLEAGUE']);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fixtureId = searchParams.get('fixtureId');
  const sport = searchParams.get('sport');
  const homeTeamId = searchParams.get('homeTeamId');
  const awayTeamId = searchParams.get('awayTeamId');
  const tab = searchParams.get('tab');

  if (!fixtureId || !sport) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  try {
    // Football
    if (sport === 'FOOTBALL') {
      return handleFootball(fixtureId, tab, homeTeamId, awayTeamId);
    }

    // Esports
    if (ESPORTS.has(sport)) {
      return handleEsports(fixtureId, sport, tab, homeTeamId, awayTeamId);
    }

    // NBA
    if (sport === 'NBA') {
      return handleNba(fixtureId, tab);
    }

    // Other api-sports based sports
    if (isSupportedSport(sport)) {
      return handleApiSport(sport, fixtureId, tab, homeTeamId, awayTeamId);
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

async function handleFootball(
  fixtureId: string,
  tab: string | null,
  homeTeamId: string | null,
  awayTeamId: string | null
) {
  if (tab === 'stats') {
    const statistics = await fetchFixtureStatistics(fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (tab === 'h2h') {
    if (!homeTeamId || !awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }
    const matches = await fetchH2H(Number(homeTeamId), Number(awayTeamId));
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (tab === 'lineups') {
    const lineups = await fetchLineups(fixtureId);
    return NextResponse.json({ available: lineups.length > 0, lineups });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

async function handleEsports(
  matchId: string,
  sport: string,
  tab: string | null,
  homeTeamId: string | null,
  awayTeamId: string | null
) {
  if (tab === 'stats') {
    const statistics = await fetchEsportsMatchStats(matchId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (tab === 'h2h') {
    if (!homeTeamId || !awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }
    const matches = await fetchEsportsH2H(sport, homeTeamId, awayTeamId);
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (tab === 'lineups') {
    const lineups = await fetchEsportsLineups(matchId);
    return NextResponse.json({ available: lineups.length > 0, lineups });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

async function handleNba(fixtureId: string, tab: string | null) {
  if (tab === 'stats') {
    const statistics = await fetchNbaGameStats(fixtureId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (tab === 'h2h' || tab === 'lineups') {
    return NextResponse.json({
      available: false,
      message: tab === 'h2h'
        ? 'Historial H2H no disponible para NBA por ahora'
        : 'Alineaciones no disponibles para NBA',
    });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}

async function handleApiSport(
  sport: string,
  gameId: string,
  tab: string | null,
  homeTeamId: string | null,
  awayTeamId: string | null
) {
  if (tab === 'stats') {
    const statistics = await fetchSportStats(sport, gameId);
    return NextResponse.json({ available: statistics.length > 0, statistics });
  }

  if (tab === 'h2h') {
    if (!homeTeamId || !awayTeamId) {
      return NextResponse.json({ available: false, matches: [] });
    }
    const matches = await fetchSportH2H(sport, homeTeamId, awayTeamId);
    return NextResponse.json({ available: matches.length > 0, matches });
  }

  if (tab === 'lineups') {
    return NextResponse.json({
      available: false,
      message: 'Alineaciones no disponibles para este deporte',
    });
  }

  return NextResponse.json({ error: 'Invalid tab' }, { status: 400 });
}
