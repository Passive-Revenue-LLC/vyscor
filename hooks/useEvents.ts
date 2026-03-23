'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, EventStatus, Sport } from '@/types';
import { isEsport } from '@/lib/utils';

interface UseEventsOptions {
  sport?: Sport;
  status?: EventStatus;
  esportsOnly?: boolean;
  refreshInterval?: number;
}

export function useEvents(options?: UseEventsOptions) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const isEsportsRequest = options?.esportsOnly ||
        (options?.sport && isEsport(options.sport));

      if (isEsportsRequest) {
        const params = new URLSearchParams();
        if (options?.sport) params.set('game', options.sport);
        if (options?.status) params.set('status', options.status);

        const res = await fetch(`/api/esports?${params}`);
        const data = await res.json();
        setEvents(data.data || []);
      } else if (options?.sport && !isEsport(options.sport)) {
        // Specific traditional sport
        const params = new URLSearchParams();
        params.set('sport', options.sport);
        if (options?.status) params.set('status', options.status);

        const res = await fetch(`/api/events?${params}`);
        const data = await res.json();
        setEvents(data.data || []);
      } else {
        // Fetch both football and esports
        const params = new URLSearchParams();
        if (options?.status) {
          params.set('status', options.status);
        }

        const [footballRes, esportsRes] = await Promise.all([
          fetch(`/api/events?${params}`),
          fetch(`/api/esports?${params}`),
        ]);

        const [footballData, esportsData] = await Promise.all([
          footballRes.json(),
          esportsRes.json(),
        ]);

        const all = [...(footballData.data || []), ...(esportsData.data || [])];

        // Sort: LIVE first, then by startTime
        all.sort((a: Event, b: Event) => {
          if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
          if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });

        if (options?.sport) {
          setEvents(all.filter((e: Event) => e.sport === options.sport));
        } else {
          setEvents(all);
        }
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [options?.sport, options?.status, options?.esportsOnly]);

  useEffect(() => {
    setLoading(true);
    fetchData();

    const interval = options?.refreshInterval;
    if (interval) {
      const id = setInterval(fetchData, interval);
      return () => clearInterval(id);
    }
  }, [fetchData, options?.refreshInterval]);

  return { events, loading, refetch: fetchData };
}
