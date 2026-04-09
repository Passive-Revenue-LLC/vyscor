'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useEvents } from '@/hooks/useEvents';
import { EventStatus } from '@/types';
import FeaturedMatch from '@/components/events/FeaturedMatch';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import Sidebar from '@/components/layout/Sidebar';
import BettingTeaser from '@/components/betting/BettingTeaser';
import LiveScoreboard from '@/components/events/LiveScoreboard';

export default function HomePage() {
  const { viewTab, sportFilter, setSportFilter } = useAppStore();
  const { events: allEvents, loading } = useEvents({ refreshInterval: 60000 });

  const filteredEvents = useMemo(() => {
    let events = allEvents;

    if (viewTab === 'LIVE') {
      events = events.filter(e => e.status === EventStatus.LIVE);
    } else if (viewTab === 'RESULTS') {
      events = events.filter(e => e.status === EventStatus.FINISHED);
    } else {
      events = events.filter(e => e.status === EventStatus.UPCOMING || e.status === EventStatus.LIVE);
    }

    if (sportFilter !== 'TODOS') {
      events = events.filter(e => e.sport === sportFilter);
    }

    return events;
  }, [allEvents, viewTab, sportFilter]);

  const featured = useMemo(() => {
    const live = allEvents.filter(e => e.status === EventStatus.LIVE);
    const upcoming = allEvents.filter(e => e.status === EventStatus.UPCOMING);
    const picks = [...live.slice(0, 2)];
    if (picks.length < 2) {
      picks.push(...upcoming.slice(0, 2 - picks.length));
    }
    return picks;
  }, [allEvents]);

  const liveEvents = useMemo(() =>
    allEvents.filter(e => e.status === EventStatus.LIVE),
    [allEvents]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero: Featured matches */}
      {viewTab !== 'RESULTS' && featured.length > 0 && (
        <section className="mb-8">
          <h2 className="font-syncopate text-xs font-bold text-white uppercase tracking-[0.1em] mb-4">
            DESTACADOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((event) => (
              <FeaturedMatch key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Main content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Events section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syncopate text-xs font-bold text-white uppercase tracking-[0.1em]">
              {viewTab === 'LIVE' ? 'EN VIVO' : viewTab === 'RESULTS' ? 'RESULTADOS' : 'EVENTOS'}
            </h2>
            <span className="font-inter text-xs text-muted">
              {loading ? '...' : `${filteredEvents.length} evento${filteredEvents.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <EventFilters
            activeFilter={sportFilter}
            onFilterChange={setSportFilter}
          />

          <div className="mt-4">
            <EventGrid events={filteredEvents} showOdds={viewTab === 'UPCOMING'} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Sidebar events={allEvents} />
          {liveEvents.length > 0 && (
            <LiveScoreboard events={liveEvents} />
          )}
          <BettingTeaser />
        </div>
      </div>
    </div>
  );
}
