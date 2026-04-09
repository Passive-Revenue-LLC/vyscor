'use client';

import { Event } from '@/types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
  showOdds?: boolean;
}

export default function EventGrid({ events, showOdds = false }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-inter text-sm text-muted">No se encontraron eventos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} showOdds={showOdds} />
      ))}
    </div>
  );
}
