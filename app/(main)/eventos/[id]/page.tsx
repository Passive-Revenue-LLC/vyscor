'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockEvents } from '@/lib/mock-data';
import { EventStatus, SPORT_CONFIG } from '@/types';
import { cn, getStatusLabel, formatDateTime, getRelativeTime } from '@/lib/utils';
import OddsDisplay from '@/components/betting/OddsDisplay';
import EventCard from '@/components/events/EventCard';
import Badge from '@/components/ui/Badge';

type DetailTab = 'RESUMEN' | 'ESTADISTICAS' | 'H2H' | 'ALINEACION';

export default function EventDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<DetailTab>('RESUMEN');
  const event = mockEvents.find((e) => e.id === params.id);

  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return mockEvents
      .filter((e) => e.id !== event.id && e.league === event.league)
      .slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="font-mono text-muted">Evento no encontrado</p>
        <Link href="/" className="font-mono text-xs text-cyber-cyan hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const sportConfig = SPORT_CONFIG[event.sport];
  const isLive = event.status === EventStatus.LIVE;
  const isFinished = event.status === EventStatus.FINISHED;
  const hasScore = (isLive || isFinished) && event.homeScore !== undefined;

  const tabs: DetailTab[] = ['RESUMEN', 'ESTADISTICAS', 'H2H', 'ALINEACION'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-cyber-cyan transition-colors duration-150 mb-6">
        &larr; Volver
      </Link>

      {/* Event header */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden mb-6">
        <div className="h-[2px] bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
        <div className="p-6">
          {/* League & status */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{sportConfig.emoji}</span>
              <span className="font-mono text-xs text-muted uppercase tracking-widest">
                {event.league}
              </span>
            </div>
            <Badge variant={isLive ? 'red' : event.status === EventStatus.UPCOMING ? 'cyan' : 'muted'}>
              {isLive && <span className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse-live mr-1" />}
              {getStatusLabel(event.status)}
            </Badge>
          </div>

          {/* Teams & score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <p className="font-body text-xl sm:text-2xl font-bold text-[#e8e8f0]">
                {event.homeTeam}
              </p>
            </div>
            <div className="px-6 text-center">
              {hasScore ? (
                <p className={cn(
                  'font-mono text-4xl sm:text-5xl font-bold',
                  isLive ? 'text-cyber-red' : 'text-[#e8e8f0]'
                )}>
                  {event.homeScore} - {event.awayScore}
                </p>
              ) : (
                <div className="text-center">
                  <p className="font-mono text-sm text-cyber-cyan">{getRelativeTime(event.startTime)}</p>
                  <p className="font-mono text-[10px] text-muted mt-1">{formatDateTime(event.startTime)}</p>
                </div>
              )}
            </div>
            <div className="flex-1 text-center">
              <p className="font-body text-xl sm:text-2xl font-bold text-[#e8e8f0]">
                {event.awayTeam}
              </p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {event.venue && (
              <span className="px-2.5 py-1 bg-bg-tertiary rounded text-[10px] font-mono text-muted">
                {event.venue}
              </span>
            )}
            {typeof event.metadata?.format === 'string' && (
              <span className="px-2.5 py-1 bg-bg-tertiary rounded text-[10px] font-mono text-muted">
                {event.metadata.format}
              </span>
            )}
            {typeof event.metadata?.minute === 'number' && (
              <span className="px-2.5 py-1 bg-cyber-red/10 rounded text-[10px] font-mono text-cyber-red">
                Minuto {event.metadata.minute}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg font-mono text-xs tracking-wide transition-all duration-150',
              activeTab === tab
                ? 'bg-cyber-cyan text-bg-primary font-bold'
                : 'text-muted hover:text-[#e8e8f0] hover:bg-bg-tertiary'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'RESUMEN' && (
          <>
            {/* Odds section (locked) */}
            <div className="bg-bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-orbitron text-xs font-bold text-[#e8e8f0] tracking-wider">
                  CUOTAS
                </h3>
                <Badge variant="purple">PROXIMAMENTE</Badge>
              </div>
              <OddsDisplay />
              <p className="font-mono text-[10px] text-muted text-center mt-3">
                Las cuotas estaran disponibles cuando lancemos el modulo de apuestas
              </p>
            </div>

            {/* Event info */}
            <div className="bg-bg-card border border-border rounded-lg p-4">
              <h3 className="font-orbitron text-xs font-bold text-[#e8e8f0] tracking-wider mb-3">
                INFORMACION
              </h3>
              <div className="space-y-2">
                <InfoRow label="Deporte" value={`${sportConfig.emoji} ${sportConfig.label}`} />
                <InfoRow label="Competicion" value={event.league} />
                <InfoRow label="Fecha" value={formatDateTime(event.startTime)} />
                {event.venue && <InfoRow label="Sede" value={event.venue} />}
                {event.streamUrl && (
                  <InfoRow label="Stream" value="Disponible" highlight />
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ESTADISTICAS' && (
          <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
            <p className="font-mono text-sm text-muted">Estadisticas no disponibles todavia</p>
          </div>
        )}

        {activeTab === 'H2H' && (
          <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
            <p className="font-mono text-sm text-muted">Historial de enfrentamientos proximamente</p>
          </div>
        )}

        {activeTab === 'ALINEACION' && (
          <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
            <p className="font-mono text-sm text-muted">Alineaciones no disponibles todavia</p>
          </div>
        )}

        {/* Related events */}
        {relatedEvents.length > 0 && (
          <div>
            <h3 className="font-orbitron text-xs font-bold text-[#e8e8f0] tracking-wider mb-3">
              EVENTOS RELACIONADOS
            </h3>
            <div className="space-y-3">
              {relatedEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
      <span className="font-mono text-xs text-muted">{label}</span>
      <span className={cn('font-mono text-xs', highlight ? 'text-cyber-green' : 'text-[#e8e8f0]')}>
        {value}
      </span>
    </div>
  );
}
