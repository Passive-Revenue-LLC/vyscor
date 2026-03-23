'use client';

import { useMemo, useState } from 'react';
import { mockEvents } from '@/lib/mock-data';
import { Sport, FilterTab, SPORT_CONFIG, EventStatus } from '@/types';
import { cn, isEsport } from '@/lib/utils';
import EventGrid from '@/components/events/EventGrid';

const esportFilters: { key: FilterTab; label: string; emoji: string }[] = [
  { key: 'TODOS', label: 'TODOS', emoji: '' },
  { key: Sport.CS2, label: 'CS2', emoji: SPORT_CONFIG[Sport.CS2].emoji },
  { key: Sport.LOL, label: 'LOL', emoji: SPORT_CONFIG[Sport.LOL].emoji },
  { key: Sport.DOTA2, label: 'DOTA 2', emoji: SPORT_CONFIG[Sport.DOTA2].emoji },
  { key: Sport.VALORANT, label: 'VALORANT', emoji: SPORT_CONFIG[Sport.VALORANT].emoji },
  { key: Sport.ROCKETLEAGUE, label: 'ROCKET LEAGUE', emoji: SPORT_CONFIG[Sport.ROCKETLEAGUE].emoji },
];

export default function EsportsPage() {
  const [filter, setFilter] = useState<FilterTab>('TODOS');

  const events = useMemo(() => {
    let filtered = mockEvents.filter((e) => isEsport(e.sport));
    if (filter !== 'TODOS') {
      filtered = filtered.filter((e) => e.sport === filter);
    }
    return filtered.sort((a, b) => {
      if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
      if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-orbitron text-lg font-bold text-cyber-purple2 tracking-wider">
          E-SPORTS
        </h1>
        <span className="font-mono text-xs text-muted">
          {events.length} evento{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {esportFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs whitespace-nowrap transition-all duration-150 border',
              filter === f.key
                ? 'border-cyber-purple2 text-cyber-purple2 bg-cyber-purple2/5'
                : 'border-border-hover bg-bg-tertiary text-muted hover:text-[#e8e8f0]'
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
