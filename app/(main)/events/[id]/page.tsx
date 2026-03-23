'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEvents } from '@/hooks/useEvents';
import { useEventDetails } from '@/hooks/useEventDetails';
import { EventStatus, SPORT_CONFIG } from '@/types';
import { cn, getStatusLabel, formatDateTime, getRelativeTime } from '@/lib/utils';
import OddsDisplay from '@/components/betting/OddsDisplay';
import EventCard from '@/components/events/EventCard';
import Badge from '@/components/ui/Badge';
import type { FixtureStatistic, H2HMatch, TeamLineup } from '@/lib/api/apifootball';

type DetailTab = 'RESUMEN' | 'ESTADISTICAS' | 'H2H' | 'ALINEACION';

const TAB_TO_API: Record<DetailTab, string> = {
  RESUMEN: '',
  ESTADISTICAS: 'stats',
  H2H: 'h2h',
  ALINEACION: 'lineups',
};

export default function EventDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<DetailTab>('RESUMEN');
  const { events: allEvents, loading } = useEvents({ refreshInterval: 30000 });

  const event = allEvents.find((e) => e.id === params.id);

  const apiTab = TAB_TO_API[activeTab];
  const { data: detailData, loading: detailLoading } = useEventDetails(
    apiTab ? event : undefined,
    apiTab as 'stats' | 'h2h' | 'lineups'
  );

  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return allEvents
      .filter((e) => e.id !== event.id && e.league === event.league)
      .slice(0, 3);
  }, [event, allEvents]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="font-mono text-muted">Cargando evento...</p>
      </div>
    );
  }

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
          <DetailSection loading={detailLoading} data={detailData}>
            <StatisticsView
              statistics={detailData?.statistics || []}
              homeTeam={event.homeTeam}
              awayTeam={event.awayTeam}
            />
          </DetailSection>
        )}

        {activeTab === 'H2H' && (
          <DetailSection loading={detailLoading} data={detailData}>
            <H2HView matches={detailData?.matches || []} />
          </DetailSection>
        )}

        {activeTab === 'ALINEACION' && (
          <DetailSection loading={detailLoading} data={detailData}>
            <LineupsView lineups={detailData?.lineups || []} />
          </DetailSection>
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

// --- Sub-components ---

function DetailSection({
  loading,
  data,
  children,
}: {
  loading: boolean;
  data: { available?: boolean; message?: string } | null;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-muted">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.available) {
    return (
      <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
        <p className="font-mono text-sm text-muted">
          {data?.message || 'No hay datos disponibles para este evento'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

function StatisticsView({
  statistics,
  homeTeam,
  awayTeam,
}: {
  statistics: FixtureStatistic[];
  homeTeam: string;
  awayTeam: string;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-cyber-cyan font-bold truncate max-w-[40%]">{homeTeam}</span>
        <span className="font-orbitron text-[10px] text-muted tracking-widest">ESTADISTICAS</span>
        <span className="font-mono text-xs text-cyber-purple2 font-bold truncate max-w-[40%] text-right">{awayTeam}</span>
      </div>
      <div className="space-y-3">
        {statistics.map((stat) => {
          const homeVal = parseStatValue(stat.home);
          const awayVal = parseStatValue(stat.away);
          const total = homeVal + awayVal;
          const homePct = total > 0 ? (homeVal / total) * 100 : 50;
          const awayPct = total > 0 ? (awayVal / total) * 100 : 50;

          return (
            <div key={stat.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-[#e8e8f0] w-16 text-left">
                  {formatStatDisplay(stat.home)}
                </span>
                <span className="font-mono text-[10px] text-muted flex-1 text-center">
                  {translateStatType(stat.type)}
                </span>
                <span className="font-mono text-xs text-[#e8e8f0] w-16 text-right">
                  {formatStatDisplay(stat.away)}
                </span>
              </div>
              <div className="flex gap-1 h-1.5">
                <div className="flex-1 bg-bg-tertiary rounded-full overflow-hidden flex justify-end">
                  <div
                    className="bg-cyber-cyan rounded-full transition-all duration-500"
                    style={{ width: `${homePct}%` }}
                  />
                </div>
                <div className="flex-1 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="bg-cyber-purple2 rounded-full transition-all duration-500"
                    style={{ width: `${awayPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function H2HView({ matches }: { matches: H2HMatch[] }) {
  return (
    <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-orbitron text-xs font-bold text-[#e8e8f0] tracking-wider">
          ULTIMOS ENFRENTAMIENTOS
        </h3>
      </div>
      <div className="divide-y divide-border">
        {matches.map((match, i) => {
          const date = new Date(match.date);
          const dateStr = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <span className="font-mono text-[10px] text-muted w-20 shrink-0">{dateStr}</span>
              <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
                <span className="font-mono text-xs text-[#e8e8f0] truncate text-right flex-1">
                  {match.homeTeam}
                </span>
                <span className={cn(
                  'font-mono text-sm font-bold px-2 py-0.5 rounded shrink-0',
                  match.homeScore !== null ? 'text-[#e8e8f0] bg-bg-tertiary' : 'text-muted'
                )}>
                  {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
                </span>
                <span className="font-mono text-xs text-[#e8e8f0] truncate flex-1">
                  {match.awayTeam}
                </span>
              </div>
              <span className="font-mono text-[9px] text-muted w-24 shrink-0 text-right truncate">
                {match.league}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineupsView({ lineups }: { lineups: TeamLineup[] }) {
  if (lineups.length < 2) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lineups.map((lineup) => (
        <div key={lineup.team} className="bg-bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#e8e8f0]">{lineup.team}</span>
            {lineup.formation && (
              <span className="font-mono text-[10px] text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded">
                {lineup.formation}
              </span>
            )}
          </div>

          {/* Starting XI */}
          <div className="px-4 py-2">
            <p className="font-mono text-[10px] text-muted tracking-widest mb-2">TITULARES</p>
            <div className="space-y-1">
              {lineup.startXI.map((player) => (
                <div key={player.number} className="flex items-center gap-2 py-0.5">
                  <span className="font-mono text-[10px] text-cyber-cyan w-5 text-right">{player.number}</span>
                  <span className="font-mono text-xs text-[#e8e8f0]">{player.name}</span>
                  <span className="font-mono text-[9px] text-muted ml-auto">{translatePosition(player.pos)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Substitutes */}
          {lineup.substitutes.length > 0 && (
            <div className="px-4 py-2 border-t border-border/50">
              <p className="font-mono text-[10px] text-muted tracking-widest mb-2">SUPLENTES</p>
              <div className="space-y-1">
                {lineup.substitutes.map((player) => (
                  <div key={player.number} className="flex items-center gap-2 py-0.5">
                    <span className="font-mono text-[10px] text-muted w-5 text-right">{player.number}</span>
                    <span className="font-mono text-xs text-muted">{player.name}</span>
                    <span className="font-mono text-[9px] text-muted/50 ml-auto">{translatePosition(player.pos)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
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

// --- Helpers ---

function parseStatValue(val: string | number | null): number {
  if (val === null) return 0;
  if (typeof val === 'number') return val;
  const num = parseFloat(val.replace('%', ''));
  return isNaN(num) ? 0 : num;
}

function formatStatDisplay(val: string | number | null): string {
  if (val === null) return '0';
  return String(val);
}

function translateStatType(type: string): string {
  const translations: Record<string, string> = {
    'Ball Possession': 'Posesion',
    'Total Shots': 'Tiros totales',
    'Shots on Goal': 'Tiros a puerta',
    'Shots off Goal': 'Tiros fuera',
    'Blocked Shots': 'Tiros bloqueados',
    'Shots insidebox': 'Tiros dentro area',
    'Shots outsidebox': 'Tiros fuera area',
    'Fouls': 'Faltas',
    'Corner Kicks': 'Corners',
    'Offsides': 'Fuera de juego',
    'Yellow Cards': 'Tarjetas amarillas',
    'Red Cards': 'Tarjetas rojas',
    'Goalkeeper Saves': 'Paradas',
    'Total passes': 'Pases totales',
    'Passes accurate': 'Pases precisos',
    'Passes %': 'Precision pases',
    'expected_goals': 'xG',
  };
  return translations[type] || type;
}

function translatePosition(pos: string): string {
  const map: Record<string, string> = { G: 'POR', D: 'DEF', M: 'MED', F: 'DEL' };
  return map[pos] || pos;
}
