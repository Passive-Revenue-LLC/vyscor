'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useEvents } from '@/hooks/useEvents';
import { EventStatus } from '@/types';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';

export default function EventsPage() {
  const { sportFilter, setSportFilter } = useAppStore();
  const { events: allEvents } = useEvents({ refreshInterval: 60000 });

  const events = useMemo(() => {
    let filtered = allEvents.filter(
      (e) => e.status === EventStatus.UPCOMING || e.status === EventStatus.LIVE
    );
    if (sportFilter !== 'TODOS') {
      filtered = filtered.filter((e) => e.sport === sportFilter);
    }
    return filtered;
  }, [allEvents, sportFilter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-orbitron text-lg font-bold text-[#e8e8f0] tracking-wider mb-6">
        TODOS LOS EVENTOS
      </h1>
      <EventFilters activeFilter={sportFilter} onFilterChange={setSportFilter} />
      <div className="mt-4">
        <EventGrid events={events} showOdds />
      </div>
    </div>
  );
}
