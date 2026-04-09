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
    <Link href={`/events/${event.id}`}>
      <div className="relative bg-bg-card border border-border rounded-xl overflow-hidden group cursor-pointer transition-all duration-150 hover:border-border-hover">
        {/* Top accent line */}
        <div className="h-[2px] bg-[#354FE3]" />

        <div className="p-3 sm:p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sportConfig.emoji}</span>
              <span className="font-inter text-[11px] text-muted">
                {event.league}
              </span>
            </div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-syncopate text-[10px] font-bold uppercase tracking-[0.1em] border',
                isLive
                  ? 'bg-[#354FE3]/12 text-[#3E60EA] border-[#354FE3]/30'
                  : 'bg-white/5 text-[#AAAAAA] border-[#252525]'
              )}
            >
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#354FE3] animate-pulse-live" />}
              {getStatusLabel(event.status)}
            </span>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 text-center min-w-0">
              <p className="font-inter font-semibold text-sm sm:text-lg text-white truncate">
                {event.homeTeam}
              </p>
            </div>

            <div className="px-2 sm:px-4 text-center shrink-0">
              {isLive || event.status === EventStatus.FINISHED ? (
                <p className="font-inter text-2xl sm:text-3xl font-bold text-white">
                  {event.homeScore} - {event.awayScore}
                </p>
              ) : (
                <p className="font-inter text-xs sm:text-sm text-[#AAAAAA]">
                  {getRelativeTime(event.startTime)}
                </p>
              )}
            </div>

            <div className="flex-1 text-center min-w-0">
              <p className="font-inter font-semibold text-sm sm:text-lg text-white truncate">
                {event.awayTeam}
              </p>
            </div>
          </div>

          {/* Meta chips */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {event.venue && (
              <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[11px] font-inter text-muted">
                {event.venue}
              </span>
            )}
            {meta(event.metadata, 'format') && (
              <span className="px-2 py-0.5 bg-bg-tertiary rounded text-[11px] font-inter text-muted">
                {meta(event.metadata, 'format')}
              </span>
            )}
            {meta(event.metadata, 'minute') !== undefined && (
              <span className="px-2 py-0.5 bg-[#354FE3]/12 rounded text-[11px] font-inter text-[#3E60EA] border border-[#354FE3]/30">
                {meta(event.metadata, 'minute')}&apos;
              </span>
            )}
            {event.streamUrl && (
              <span className="px-2 py-0.5 bg-[#354FE3]/12 rounded text-[10px] font-syncopate uppercase tracking-[0.1em] text-[#3E60EA] border border-[#354FE3]/30">
                STREAM
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
