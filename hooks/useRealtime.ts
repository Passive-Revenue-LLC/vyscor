'use client';

import { useEffect, useState, useCallback } from 'react';
import { Event, EventStatus } from '@/types';
import { mockEvents } from '@/lib/mock-data';

export function useRealtime() {
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLiveEvents = useCallback(() => {
    setIsUpdating(true);
    // TODO: Replace with Supabase Realtime subscription
    // supabase
    //   .channel('live-events')
    //   .on('postgres_changes', {
    //     event: '*',
    //     schema: 'public',
    //     table: 'Event',
    //     filter: 'status=eq.LIVE',
    //   }, (payload) => {
    //     setLiveEvents(prev => updateEvents(prev, payload));
    //   })
    //   .subscribe();

    const live = mockEvents.filter((e) => e.status === EventStatus.LIVE);
    setLiveEvents(live);
    setTimeout(() => setIsUpdating(false), 500);
  }, []);

  useEffect(() => {
    fetchLiveEvents();
    const interval = setInterval(fetchLiveEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveEvents]);

  return { liveEvents, isUpdating };
}
