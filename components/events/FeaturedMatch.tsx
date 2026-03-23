'use client';

import Link from 'next/link';
import { Event, EventStatus, SPORT_CONFIG } from '@/types';
import { cn, getStatusLabel, getRelativeTime, meta } from '@/lib/utils';

interface FeaturedMatchProps {
  event: Event;
}

export default function FeaturedMatch({ event }: FeaturedMatchProps) {
  const sportConfig = SPORT_CONFIG[event.sport];
  const isLive = event.status === EventStatus.LIVE;

  return (
    <Link href={`/eventos/${event.id}`}>
      <div className="relative bg-bg-card border border-border rounded-xl overflow-hidden group cursor-pointer transition-all duration-150 hover:border-border-hover">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-purple" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sportConfig.emoji}</span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                {event.league}
              </span>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-orbitron text-[10px] font-bold tracking-wider',
                isLive ? 'bg-cyber-red/10 text-cyber-red' : 'bg-cyber-cyan/10 text-cyber-cyan'
              )}
            >
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse-live" />}
              {getStatusLabel(event.status)}
            </span>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <p className="font-body font-semibold text-base sm:text-lg text-[#e8e8f0]">
                {event.homeTeam}
              </p>
            </div>

            <div className="px-4 text-center">
              {isLive || event.status === EventStatus.FINISHED ? (
                <p className={cn(
                  'font-mono text-3xl font-bold',
                  isLive ? 'text-cyber-red' : 'text-[#e8e8f0]'
                )}>
                  {event.homeScore} - {event.awayScore}
                </p>
              ) : (
                <p className="font-mono text-sm text-cyber-cyan">
                  {getRelativeTime(event.startTime)}
                </p>
              )}
            </div>

            <div className="flex-1 text-center">
              <p className="font-body font-semibold text-base sm:text-lg text-[#e8e8f0]">
                {event.awayTeam}
              </p>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {event.venue && (
              <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-mono text-muted">
                {event.venue}
              </span>
            )}
            {meta(event.metadata, 'format') && (
              <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[10px] font-mono text-muted">
                {meta(event.metadata, 'format')}
              </span>
            )}
            {meta(event.metadata, 'minute') !== undefined && (
              <span className="px-2 py-0.5 bg-cyber-red/10 rounded text-[10px] font-mono text-cyber-red">
                {meta(event.metadata, 'minute')}&apos;
              </span>
            )}
            {event.streamUrl && (
              <span className="px-2 py-0.5 bg-cyber-purple/10 rounded text-[10px] font-mono text-cyber-purple2">
                STREAM
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
