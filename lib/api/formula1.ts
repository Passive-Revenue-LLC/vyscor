const API_KEY = process.env.API_FOOTBALL_KEY;
const F1_BASE_URL = 'https://v1.formula-1.api-sports.io';

interface F1Race {
  id: number;
  competition: { name: string; location: { country: string; city: string } };
  circuit: { name: string };
  season: number;
  type: string;
  laps: { current: number | null; total: number };
  distance: string;
  date: string;
  status: string;
}

export async function fetchF1Races(season?: number) {
  if (!API_KEY) return [];

  const year = season || new Date().getFullYear();
  const res = await fetch(
    `${F1_BASE_URL}/races?season=${year}&type=Race`,
    {
      headers: { 'x-apisports-key': API_KEY },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const races: F1Race[] = data.response || [];

  return races.map((race) => {
    let status = 'UPCOMING';
    if (race.status === 'Completed') status = 'FINISHED';
    else if (race.status === 'Live' || (race.laps.current && race.laps.current > 0)) status = 'LIVE';
    else if (race.status === 'Cancelled') status = 'CANCELLED';

    return {
      externalId: String(race.id),
      sport: 'F1',
      league: `Formula 1 - ${race.competition.name}`,
      homeTeam: race.circuit.name,
      awayTeam: `${race.competition.location.city}, ${race.competition.location.country}`,
      status,
      startTime: race.date,
      venue: race.circuit.name,
      metadata: {
        laps: race.laps.total,
        distance: race.distance,
      },
    };
  });
}
