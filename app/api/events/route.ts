import { NextRequest, NextResponse } from 'next/server';
import { mockEvents } from '@/lib/mock-data';
import { EventStatus, Sport } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get('sport') as Sport | null;
  const status = searchParams.get('status') as EventStatus | null;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  // TODO: When API keys are configured, fetch from real APIs
  // and cache in Supabase. For now, use mock data.
  let events = [...mockEvents];

  if (sport) {
    events = events.filter((e) => e.sport === sport);
  }

  if (status) {
    events = events.filter((e) => e.status === status);
  }

  // Sort: LIVE first, then UPCOMING by date, then FINISHED
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
}
