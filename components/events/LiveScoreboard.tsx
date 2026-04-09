'use client';

import { Event, SPORT_CONFIG } from '@/types';

interface LiveScoreboardProps {
  events: Event[];
}

export default function LiveScoreboard({ events }: LiveScoreboardProps) {
  if (events.length === 0) return null;

  return (
    <div className="bg-bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#354FE3] animate-pulse-live" />
        <h3 className="font-syncopate text-xs font-bold text-white uppercase tracking-[0.1em]">
          EN VIVO AHORA
        </h3>
      </div>
      <div className="space-y-3">
        {events.map((event) => {
          const config = SPORT_CONFIG[event.sport];
          return (
            <div key={event.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm">{config.emoji}</span>
                <div className="min-w-0">
                  <p className="font-inter text-xs font-medium text-white truncate">
                    {event.homeTeam} vs {event.awayTeam}
                  </p>
                  <p className="font-inter text-[11px] text-muted truncate">
                    {event.league}
                  </p>
                </div>
              </div>
              <span className="font-inter text-sm font-bold text-white ml-2 shrink-0">
                {event.homeScore} - {event.awayScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
