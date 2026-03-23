import { NextRequest, NextResponse } from 'next/server';
import {
  fetchFixtureStatistics,
  fetchH2H,
  fetchLineups,
} from '@/lib/api/apifootball';

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

  if (sport !== 'FOOTBALL') {
    return NextResponse.json({
      available: false,
      message: 'Datos detallados solo disponibles para futbol por ahora',
    });
  }

  try {
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
  } catch {
    return NextResponse.json({ available: false });
  }
}
