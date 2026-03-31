'use client';

import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Event, SPORT_CONFIG } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday=0
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { events } = useEvents({ refreshInterval: 60000 });

  const eventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((event) => {
      const d = new Date(event.startTime);
      const key = dateKey(d);
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  };

  const todayKey = dateKey(today);

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-orbitron text-lg font-bold text-[#e8e8f0]">CALENDARIO</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border text-muted hover:text-[#e8e8f0] font-mono text-sm transition-all duration-150"
          >
            &#8592;
          </button>
          <span className="font-orbitron text-sm text-cyber-cyan min-w-[160px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border text-muted hover:text-[#e8e8f0] font-mono text-sm transition-all duration-150"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border min-w-[320px]">
          {DAYS.map((day) => (
            <div key={day} className="px-1 sm:px-2 py-2 sm:py-3 text-center font-mono text-[10px] sm:text-xs text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 min-w-[320px]">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[60px] sm:min-h-[100px] border-b border-r border-border/50 bg-bg-primary/30" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = eventsByDay[key] || [];
            const isToday = key === todayKey;
            const isSelected = key === selectedDay;

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(isSelected ? null : key)}
                className={cn(
                  'min-h-[60px] sm:min-h-[100px] border-b border-r border-border/50 p-1 sm:p-2 text-left transition-all duration-150 hover:bg-bg-tertiary',
                  isSelected && 'bg-cyber-cyan/5 border-cyber-cyan/30',
                  isToday && !isSelected && 'bg-cyber-purple/5'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'font-mono text-xs',
                      isToday ? 'text-cyber-cyan font-bold' : 'text-muted'
                    )}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="font-mono text-[10px] text-cyber-purple2">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                {/* Event dots */}
                <div className="flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 4).map((event) => {
                    const config = SPORT_CONFIG[event.sport];
                    return (
                      <span
                        key={event.id}
                        className="text-[10px]"
                        title={`${event.homeTeam} vs ${event.awayTeam}`}
                      >
                        {config?.emoji}
                      </span>
                    );
                  })}
                  {dayEvents.length > 4 && (
                    <span className="font-mono text-[9px] text-muted">+{dayEvents.length - 4}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-6">
          <h2 className="font-orbitron text-xs font-bold text-cyber-cyan tracking-widest mb-4">
            EVENTOS DEL {selectedDay.split('-').reverse().join('/')}
          </h2>
          {selectedEvents.length === 0 ? (
            <div className="bg-bg-card border border-border rounded-xl p-6 text-center">
              <p className="font-mono text-sm text-muted">No hay eventos este dia</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => {
                const config = SPORT_CONFIG[event.sport];
                const time = new Date(event.startTime).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="flex items-center gap-3 px-4 py-3 bg-bg-card border border-border rounded-lg hover:border-border-hover transition-all duration-150"
                  >
                    <span className="text-lg">{config?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-[#e8e8f0] truncate">
                        {event.homeTeam} vs {event.awayTeam}
                      </p>
                      <p className="font-mono text-xs text-muted">{config?.label} &middot; {event.league}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-cyber-cyan">{time}</p>
                      <p className={cn(
                        'font-mono text-[10px]',
                        event.status === 'LIVE' ? 'text-cyber-red' : 'text-muted'
                      )}>
                        {event.status === 'LIVE' ? 'EN VIVO' : event.status === 'FINISHED' ? 'FINALIZADO' : 'PROXIMO'}
                      </p>
                    </div>
                    {(event.homeScore != null && event.awayScore != null) && (
                      <div className="font-orbitron text-sm font-bold text-[#e8e8f0] ml-2">
                        {event.homeScore} - {event.awayScore}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
