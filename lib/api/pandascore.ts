const PANDASCORE_BASE_URL = 'https://api.pandascore.co';
const API_KEY = process.env.PANDASCORE_API_KEY;

interface PandaScoreMatch {
  id: number;
  name: string;
  status: string;
  scheduled_at: string;
  tournament: { name: string };
  opponents: Array<{ opponent: { name: string; image_url: string } }>;
  results: Array<{ team_id: number; score: number }>;
  videogame: { slug: string };
  number_of_games: number;
  streams_list: Array<{ raw_url: string; language: string }>;
}

export async function fetchEsportsMatches(game: string, status?: string) {
  if (!API_KEY) return [];

  const params = new URLSearchParams({
    token: API_KEY,
    sort: status === 'running' ? '-scheduled_at' : 'begin_at',
    per_page: '20',
  });

  if (status) params.set('filter[status]', status);

  const res = await fetch(
    `${PANDASCORE_BASE_URL}/${game}/matches?${params}`,
    { next: { revalidate: status === 'running' ? 60 : 300 } }
  );

  if (!res.ok) return [];

  const data: PandaScoreMatch[] = await res.json();
  return data;
}

export function mapPandaScoreToEvent(match: PandaScoreMatch) {
  const gameMap: Record<string, string> = {
    'cs-go': 'CS2',
    'league-of-legends': 'LOL',
    'dota-2': 'DOTA2',
    valorant: 'VALORANT',
    rl: 'ROCKETLEAGUE',
  };

  const statusMap: Record<string, string> = {
    not_started: 'UPCOMING',
    running: 'LIVE',
    finished: 'FINISHED',
    canceled: 'CANCELLED',
  };

  return {
    externalId: String(match.id),
    sport: gameMap[match.videogame.slug] || 'CS2',
    league: match.tournament?.name || 'Desconocido',
    homeTeam: match.opponents?.[0]?.opponent?.name || 'TBD',
    awayTeam: match.opponents?.[1]?.opponent?.name || 'TBD',
    homeScore: match.results?.[0]?.score,
    awayScore: match.results?.[1]?.score,
    status: statusMap[match.status] || 'UPCOMING',
    startTime: match.scheduled_at,
    streamUrl: match.streams_list?.[0]?.raw_url,
    metadata: {
      format: `BO${match.number_of_games}`,
    },
  };
}
