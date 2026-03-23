import { NextRequest, NextResponse } from 'next/server';
import { fetchEsportsMatches, mapPandaScoreToEvent } from '@/lib/api/pandascore';
import { Event, Sport, EventStatus } from '@/types';

const GAME_SLUGS: Record<string, string> = {
  CS2: 'csgo',
  LOL: 'lol',
  DOTA2: 'dota2',
  VALORANT: 'valorant',
  ROCKETLEAGUE: 'rl',
};

async function fetchAllEsports(): Promise<Event[]> {
  const games = Object.entries(GAME_SLUGS);

  const results = await Promise.all(
    games.flatMap(([, slug]) => [
      fetchEsportsMatches(slug, 'running'),
      fetchEsportsMatches(slug, 'not_started'),
      fetchEsportsMatches(slug, 'finished'),
    ])
  );

  const allMatches = results.flat();

  // Deduplicate by match id
  const seen = new Set<string>();
  const events: Event[] = [];

  for (const match of allMatches) {
    const mapped = mapPandaScoreToEvent(match);
    if (seen.has(mapped.externalId)) continue;
    seen.add(mapped.externalId);

    events.push({
      ...mapped,
      id: `ps-${mapped.externalId}`,
      sport: mapped.sport as unknown as Sport,
      status: mapped.status as unknown as EventStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Event);
  }

  return events;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const game = searchParams.get('game');
  const status = searchParams.get('status') as EventStatus | null;

  try {
    let events = await fetchAllEsports();

    if (game) {
      events = events.filter((e) => e.sport === game.toUpperCase());
    }

    if (status) {
      events = events.filter((e) => e.status === status);
    }

    events.sort((a, b) => {
      if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
      if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return NextResponse.json({
      data: events,
      total: events.length,
    });
  } catch {
    return NextResponse.json({ data: [], total: 0 });
  }
}
