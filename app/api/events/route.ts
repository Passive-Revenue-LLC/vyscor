import { NextRequest, NextResponse } from 'next/server';
import { fetchFootballFixtures, mapApiFootballToEvent } from '@/lib/api/apifootball';
import { EventStatus, Sport, Event } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get('sport') as Sport | null;
  const status = searchParams.get('status') as EventStatus | null;
  const date = searchParams.get('date') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const fixtures = await fetchFootballFixtures(date);
    let events: Event[] = fixtures.map((f, i) => {
      const mapped = mapApiFootballToEvent(f);
      return {
        ...mapped,
        id: `af-${mapped.externalId}`,
        sport: mapped.sport as unknown as Sport,
        status: mapped.status as unknown as EventStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Event;
    });

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
