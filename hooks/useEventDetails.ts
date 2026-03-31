'use client';

import { useState, useEffect } from 'react';
import type { Event } from '@/types';
import type { FixtureStatistic, H2HMatch, TeamLineup } from '@/lib/api/apifootball';

type DetailTab = 'stats' | 'h2h' | 'lineups';

interface DetailData {
  available: boolean;
  statistics?: FixtureStatistic[];
  matches?: H2HMatch[];
  lineups?: TeamLineup[];
  message?: string;
}

export function useEventDetails(event: Event | undefined, tab: DetailTab) {
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!event?.externalId) {
      setData(null);
      return;
    }

    const params = new URLSearchParams({
      fixtureId: event.externalId,
      sport: event.sport,
      tab,
      homeTeam: event.homeTeam,
      awayTeam: event.awayTeam,
      date: event.startTime.split('T')[0],
    });

    const meta = event.metadata as Record<string, unknown> | undefined;
    const homeTeamId = meta?.homeTeamId;
    const awayTeamId = meta?.awayTeamId;

    if (homeTeamId) params.set('homeTeamId', String(homeTeamId));
    if (awayTeamId) params.set('awayTeamId', String(awayTeamId));
    if (event.league) params.set('league', event.league);

    setLoading(true);
    fetch(`/api/events/details?${params}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData({ available: false }))
      .finally(() => setLoading(false));
  }, [event?.externalId, event?.sport, event?.metadata, event?.homeTeam, event?.awayTeam, event?.startTime, tab]);

  return { data, loading };
}
