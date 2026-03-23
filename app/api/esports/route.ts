import { NextRequest, NextResponse } from 'next/server';
import { mockEvents } from '@/lib/mock-data';
import { isEsport } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const game = searchParams.get('game');

  // TODO: Integrate PandaScore API when key is available
  let events = mockEvents.filter((e) => isEsport(e.sport));

  if (game) {
    events = events.filter((e) => e.sport === game.toUpperCase());
  }

  return NextResponse.json({
    data: events,
    total: events.length,
  });
}
