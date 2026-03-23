'use client';

import { useEvents } from '@/hooks/useEvents';
import { Event, EventStatus } from '@/types';
import { useMemo } from 'react';

export function useRealtime() {
  const { events, loading } = useEvents({ refreshInterval: 30000 });

  const liveEvents = useMemo(
    () => events.filter((e) => e.status === EventStatus.LIVE),
    [events]
  );

  return { liveEvents, isUpdating: loading };
}
