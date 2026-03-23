import { NextRequest, NextResponse } from 'next/server';
import { fetchFootballFixtures, mapApiFootballToEvent } from '@/lib/api/apifootball';
import { fetchAllSportsGames } from '@/lib/api/api-sports';
import { fetchNbaGames } from '@/lib/api/nba';
import { fetchF1Races } from '@/lib/api/formula1';
import { EventStatus, Sport, Event } from '@/types';

function toEvent(mapped: Record<string, unknown>, prefix: string): Event {
  return {
    ...mapped,
    id: `${prefix}-${mapped.externalId}`,
    sport: mapped.sport as Sport,
    status: mapped.status as EventStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Event;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get('sport') as Sport | null;
  const status = searchParams.get('status') as EventStatus | null;
  const date = searchParams.get('date') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const [footballFixtures, sportsGames, nbaGames, f1Races] = await Promise.allSettled([
      fetchFootballFixtures(date),
      fetchAllSportsGames(date),
      fetchNbaGames(date),
      fetchF1Races(),
    ]);

    let events: Event[] = [];

    // Football
    if (footballFixtures.status === 'fulfilled') {
      events.push(
        ...footballFixtures.value.map((f) => toEvent(mapApiFootballToEvent(f), 'af'))
      );
    }

    // Basketball, Hockey, Baseball, Handball, Volleyball, Rugby, NFL, AFL, MMA
    if (sportsGames.status === 'fulfilled') {
      events.push(
        ...sportsGames.value.map((g) => toEvent(g, 'as'))
      );
    }

    // NBA
    if (nbaGames.status === 'fulfilled') {
      events.push(
        ...nbaGames.value.map((g) => toEvent(g, 'nba'))
      );
    }

    // F1
    if (f1Races.status === 'fulfilled') {
      events.push(
        ...f1Races.value.map((r) => toEvent(r, 'f1'))
      );
    }

    if (sport) {
      events = events.filter((e) => e.sport === sport);
    }

    if (status) {
      events = events.filter((e) => e.status === status);
    }

    events.sort((a, b) => {
      if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
      if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const paginated = events.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      total: events.length,
      limit,
      offset,
    });
  } catch {
    return NextResponse.json({ data: [], total: 0, limit, offset });
  }
}
