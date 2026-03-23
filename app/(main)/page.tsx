'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { mockEvents, getFeaturedEvents, getEventsByStatus } from '@/lib/mock-data';
import { EventStatus } from '@/types';
import FeaturedMatch from '@/components/events/FeaturedMatch';
import EventGrid from '@/components/events/EventGrid';
import EventFilters from '@/components/events/EventFilters';
import Sidebar from '@/components/layout/Sidebar';
import BettingTeaser from '@/components/betting/BettingTeaser';
import LiveScoreboard from '@/components/events/LiveScoreboard';

export default function HomePage() {
  const { viewTab, sportFilter, setSportFilter } = useAppStore();
  const featured = getFeaturedEvents();
  const liveEvents = getEventsByStatus(EventStatus.LIVE);

  const filteredEvents = useMemo(() => {
    let events = mockEvents;

    // Filter by view tab
    if (viewTab === 'LIVE') {
      events = events.filter(e => e.status === EventStatus.LIVE);
    } else if (viewTab === 'RESULTS') {
      events = events.filter(e => e.status === EventStatus.FINISHED);
    } else {
      events = events.filter(e => e.status === EventStatus.UPCOMING || e.status === EventStatus.LIVE);
    }

    // Filter by sport
    if (sportFilter !== 'TODOS') {
      events = events.filter(e => e.sport === sportFilter);
    }

    // Sort: LIVE first, then by startTime
    return events.sort((a, b) => {
      if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
      if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [viewTab, sportFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero: Featured matches */}
      {viewTab !== 'RESULTS' && featured.length > 0 && (
        <section className="mb-8">
          <h2 className="font-orbitron text-xs font-bold text-cyber-cyan tracking-widest mb-4">
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
            <h2 className="font-orbitron text-xs font-bold text-[#e8e8f0] tracking-widest">
              {viewTab === 'LIVE' ? 'EN VIVO' : viewTab === 'RESULTS' ? 'RESULTADOS' : 'EVENTOS'}
            </h2>
            <span className="font-mono text-xs text-muted">
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
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
          <Sidebar />
          {liveEvents.length > 0 && (
            <LiveScoreboard events={liveEvents} />
          )}
          <BettingTeaser />
        </div>
      </div>
    </div>
  );
}
