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
        <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse-live" />
        <h3 className="font-orbitron text-xs font-bold text-cyber-red tracking-wider">
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
                  <p className="text-xs text-[#e8e8f0] truncate">
                    {event.homeTeam} vs {event.awayTeam}
                  </p>
                  <p className="font-mono text-[10px] text-muted truncate">
                    {event.league}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm font-bold text-cyber-red ml-2 shrink-0">
                {event.homeScore} - {event.awayScore}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
