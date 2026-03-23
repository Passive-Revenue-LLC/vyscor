'use client';

import { useState, useEffect } from 'react';
import { Event, EventStatus, Sport } from '@/types';
import { mockEvents } from '@/lib/mock-data';

interface UseEventsOptions {
  sport?: Sport;
  status?: EventStatus;
}

export function useEvents(options?: UseEventsOptions) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with mock data
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...mockEvents];

      if (options?.sport) {
        filtered = filtered.filter((e) => e.sport === options.sport);
      }

      if (options?.status) {
        filtered = filtered.filter((e) => e.status === options.status);
      }

      filtered.sort((a, b) => {
        if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
        if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });

      setEvents(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [options?.sport, options?.status]);

  return { events, loading };
}
