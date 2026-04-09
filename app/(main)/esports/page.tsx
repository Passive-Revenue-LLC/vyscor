'use client';

import { useMemo, useState } from 'react';
import { Sport, FilterTab, SPORT_CONFIG } from '@/types';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useEvents';
import EventGrid from '@/components/events/EventGrid';

const esportFilters: { key: FilterTab; label: string; emoji: string }[] = [
  { key: 'TODOS', label: 'Todos', emoji: '' },
  { key: Sport.CS2, label: 'CS2', emoji: SPORT_CONFIG[Sport.CS2].emoji },
  { key: Sport.LOL, label: 'LoL', emoji: SPORT_CONFIG[Sport.LOL].emoji },
  { key: Sport.DOTA2, label: 'Dota 2', emoji: SPORT_CONFIG[Sport.DOTA2].emoji },
  { key: Sport.VALORANT, label: 'Valorant', emoji: SPORT_CONFIG[Sport.VALORANT].emoji },
  { key: Sport.ROCKETLEAGUE, label: 'Rocket League', emoji: SPORT_CONFIG[Sport.ROCKETLEAGUE].emoji },
];

export default function EsportsPage() {
  const [filter, setFilter] = useState<FilterTab>('TODOS');
  const { events: allEvents, loading } = useEvents({ esportsOnly: true, refreshInterval: 60000 });

  const events = useMemo(() => {
    let filtered = allEvents;
    if (filter !== 'TODOS') {
      filtered = filtered.filter((e) => e.sport === filter);
    }
    return filtered;
  }, [allEvents, filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-syncopate text-lg font-bold text-white uppercase tracking-[0.1em]">
          E-SPORTS
        </h1>
        <span className="font-inter text-xs text-muted">
          {loading ? '...' : `${events.length} evento${events.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {esportFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-inter text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-all duration-150 border',
              filter === f.key
                ? 'border-[#354FE3] text-white bg-[#354FE3]/12'
                : 'border-border-hover bg-bg-tertiary text-muted hover:text-white'
            )}
          >
            {f.emoji && <span>{f.emoji}</span>}
            {f.label}
          </button>
        ))}
      </div>

      <EventGrid events={events} showOdds />
    </div>
  );
}
