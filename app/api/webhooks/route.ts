import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Handle webhooks from external services
  // (score updates, event status changes, etc.)
  await request.json();

  return NextResponse.json({ received: true });
}
