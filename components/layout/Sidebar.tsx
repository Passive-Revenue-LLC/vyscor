'use client';

import { Event, EventStatus, Sport, SPORT_CONFIG } from '@/types';

interface SidebarProps {
  events: Event[];
}

export default function Sidebar({ events }: SidebarProps) {
  const liveCount = events.filter(e => e.status === EventStatus.LIVE).length;
  const upcomingCount = events.filter(e => e.status === EventStatus.UPCOMING).length;
  const finishedCount = events.filter(e => e.status === EventStatus.FINISHED).length;

  const sportCounts = Object.values(Sport).reduce((acc, sport) => {
    acc[sport] = events.filter(e => e.sport === sport).length;
    return acc;
  }, {} as Record<Sport, number>);

  return (
    <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
      {/* Stats card */}
      <div className="bg-bg-card border border-border rounded-lg p-4">
        <h3 className="font-orbitron text-xs font-bold text-cyber-cyan tracking-wider mb-4">
          ESTADISTICAS
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <StatBox label="En vivo" value={liveCount} color="text-cyber-red" />
          <StatBox label="Proximos" value={upcomingCount} color="text-cyber-cyan" />
          <StatBox label="Finalizados" value={finishedCount} color="text-muted" />
        </div>
      </div>

      {/* Sports breakdown */}
      <div className="bg-bg-card border border-border rounded-lg p-4">
        <h3 className="font-orbitron text-xs font-bold text-cyber-cyan tracking-wider mb-4">
          POR DEPORTE
        </h3>
        <div className="space-y-2">
          {Object.entries(sportCounts)
            .filter(([, count]) => count > 0)
            .map(([sport, count]) => {
              const config = SPORT_CONFIG[sport as Sport];
              return (
                <div key={sport} className="flex items-center justify-between text-sm">
                  <span className="text-muted font-mono text-xs">
                    {config.emoji} {config.label}
                  </span>
                  <span className="font-mono text-xs text-[#e8e8f0]">{count}</span>
                </div>
              );
            })}
        </div>
      </div>
    </aside>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
      <p className="font-mono text-[10px] text-muted uppercase tracking-wider">{label}</p>
    </div>
  );
}
