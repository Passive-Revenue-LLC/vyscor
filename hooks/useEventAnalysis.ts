'use client';

import { useState, useCallback } from 'react';
import type { Event } from '@/types';
import type { FixtureStatistic, H2HMatch, TeamLineup } from '@/lib/api/apifootball';

interface MetricaClave {
  titulo: string;
  valor: string;
  interpretacion: string;
}

export interface MatchAnalysis {
  resumen: string;
  prediccion: {
    favorito: string;
    confianza: 'alta' | 'media' | 'baja';
    razon: string;
  };
  metricas_clave: MetricaClave[];
  analisis_global: string;
}

interface AnalysisState {
  analysis: MatchAnalysis | null;
  loading: boolean;
  error: string | null;
}

export function useEventAnalysis(event: Event | undefined) {
  const [state, setState] = useState<AnalysisState>({
    analysis: null,
    loading: false,
    error: null,
  });

  const fetchAnalysis = useCallback(
    async (context?: {
      statistics?: FixtureStatistic[];
      h2hMatches?: H2HMatch[];
      lineups?: TeamLineup[];
    }) => {
      if (!event) return;

      setState({ analysis: null, loading: true, error: null });

      try {
        const res = await fetch('/api/events/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sport: event.sport,
            league: event.league,
            homeTeam: event.homeTeam,
            awayTeam: event.awayTeam,
            homeScore: event.homeScore,
            awayScore: event.awayScore,
            status: event.status,
            venue: event.venue,
            startTime: event.startTime,
            statistics: context?.statistics,
            h2hMatches: context?.h2hMatches,
            lineups: context?.lineups,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Error al obtener análisis');
        }

        const data = await res.json();
        setState({ analysis: data.analysis, loading: false, error: null });
      } catch (err) {
        setState({
          analysis: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      }
    },
    [event]
  );

  return { ...state, fetchAnalysis };
}
