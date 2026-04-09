'use client';

import { useMemo, useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { EventStatus, FilterTab } from '@/types';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';

export default function ResultsPage() {
  const [filter, setFilter] = useState<FilterTab>('TODOS');
  const { events: allEvents } = useEvents({ status: EventStatus.FINISHED });

  const events = useMemo(() => {
    let filtered = allEvents;
    if (filter !== 'TODOS') {
      filtered = filtered.filter((e) => e.sport === filter);
    }
    return filtered.sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }, [allEvents, filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-syncopate text-lg font-bold text-white uppercase tracking-[0.1em] mb-6">
        RESULTADOS
      </h1>
      <EventFilters activeFilter={filter} onFilterChange={setFilter} />
      <div className="mt-4">
        <EventGrid events={events} />
      </div>
    </div>
  );
}
