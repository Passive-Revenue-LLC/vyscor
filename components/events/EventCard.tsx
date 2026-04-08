'use client';

import Link from 'next/link';
import { Event, EventStatus, SPORT_CONFIG } from '@/types';
import { cn, getStatusBorderColor, getStatusLabel, getRelativeTime, formatTime, meta } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  showOdds?: boolean;
}

export default function EventCard({ event, showOdds = false }: EventCardProps) {
  const sportConfig = SPORT_CONFIG[event.sport];
  const isLive = event.status === EventStatus.LIVE;
  const isUpcoming = event.status === EventStatus.UPCOMING;
  const isFinished = event.status === EventStatus.FINISHED;

  return (
    <Link href={`/events/${event.id}`}>
      <div
        className={cn(
          'bg-bg-card border border-border rounded-lg p-3 sm:p-4 border-l-2 transition-all duration-150',
          'hover:translate-x-[2px] hover:border-border-hover cursor-pointer',
          getStatusBorderColor(event.status)
        )}
      >
        <div className="grid grid-cols-[32px_1fr_auto] sm:grid-cols-[38px_1fr_auto] gap-2 sm:gap-3 items-start">
          {/* Sport icon */}
          <div className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-base sm:text-lg">
            {sportConfig.emoji}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="font-mono text-[10px] text-muted uppercase tracking-wider truncate">
              {event.league}
            </p>
            <p className="text-sm font-medium text-[#FFFFFF] mt-0.5 truncate">
              {event.homeTeam} vs {event.awayTeam}
            </p>
            <p className="font-mono text-xs text-muted mt-1">
              {isLive && meta(event.metadata, 'minute') !== undefined && `${meta(event.metadata, 'minute')}'`}
              {isLive && meta(event.metadata, 'quarter') !== undefined && `Q${meta(event.metadata, 'quarter')} ${meta(event.metadata, 'timeLeft') || ''}`}
              {isLive && meta(event.metadata, 'map') !== undefined && `${meta(event.metadata, 'map')} · R${meta(event.metadata, 'round')}`}
              {isUpcoming && getRelativeTime(event.startTime)}
              {isFinished && formatTime(event.startTime)}
            </p>

            {/* Odds row (locked) */}
            {showOdds && isUpcoming && (
              <div className="flex gap-2 mt-2">
                {['1.85', 'X', '2.10'].map((odd, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-bg-tertiary border border-border rounded text-[10px] font-mono text-muted opacity-60 select-none"
                  >
                    🔒 {odd}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status + Score */}
          <div className="text-right flex flex-col items-end gap-1">
            <StatusBadge status={event.status} />
            {(isLive || isFinished) && event.homeScore !== undefined && event.awayScore !== undefined && (
              <p className={cn(
                'font-mono text-lg font-bold',
                isLive ? 'text-cyber-red' : 'text-muted'
              )}>
                {event.homeScore} - {event.awayScore}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: EventStatus }) {
  const isLive = status === EventStatus.LIVE;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-orbitron text-[9px] font-bold tracking-wider',
        isLive && 'bg-cyber-red/10 text-cyber-red',
        status === EventStatus.UPCOMING && 'bg-cyber-cyan/10 text-cyber-cyan',
        status === EventStatus.FINISHED && 'bg-bg-tertiary text-muted',
        status === EventStatus.CANCELLED && 'bg-bg-tertiary text-muted'
      )}
    >
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse-live" />}
      {getStatusLabel(status)}
    </span>
  );
}
