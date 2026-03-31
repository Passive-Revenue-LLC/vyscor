import type { FixtureStatistic, H2HMatch } from './apifootball';
import { areTeamsMatching } from './team-name-normalizer';

const OPENDOTA_BASE_URL = 'https://api.opendota.com/api';
const API_KEY = process.env.OPENDOTA_API_KEY; // Optional, increases rate limit

// --- Types ---

interface ProMatch {
  match_id: number;
  duration: number;
  start_time: number;
  radiant_team_id: number;
  dire_team_id: number;
  radiant_name: string;
  dire_name: string;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  league_name: string;
}

interface MatchDetail {
  match_id: number;
  duration: number;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  radiant_team: { team_id: number; name: string } | null;
  dire_team: { team_id: number; name: string } | null;
  radiant_gold_adv: number[] | null;
  radiant_xp_adv: number[] | null;
  tower_status_radiant: number;
  tower_status_dire: number;
  barracks_status_radiant: number;
  barracks_status_dire: number;
  first_blood_time: number;
  players: Array<{
    player_slot: number;
    hero_id: number;
    kills: number;
    deaths: number;
    assists: number;
    gold_per_min: number;
    xp_per_min: number;
    last_hits: number;
    denies: number;
    hero_damage: number;
    tower_damage: number;
    hero_healing: number;
    personaname: string | null;
    name: string | null;
    isRadiant: boolean;
  }>;
}

// --- Helpers ---

function odFetch(path: string, revalidate = 120) {
  const url = API_KEY
    ? `${OPENDOTA_BASE_URL}${path}${path.includes('?') ? '&' : '?'}api_key=${API_KEY}`
    : `${OPENDOTA_BASE_URL}${path}`;

  return fetch(url, { next: { revalidate } });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function countTowers(status: number): number {
  let count = 0;
  let n = status;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}

// --- ID Resolution ---

async function findProMatch(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<ProMatch | null> {
  try {
    const res = await odFetch('/proMatches', 300);
    if (!res.ok) return null;

    const matches: ProMatch[] = await res.json();

    // Convert date string to timestamp range (whole day)
    const dateStart = new Date(date).getTime() / 1000;
    const dateEnd = dateStart + 86400;

    for (const match of matches) {
      if (match.start_time < dateStart || match.start_time > dateEnd) continue;

      const radiantMatchesHome = areTeamsMatching(homeTeam, match.radiant_name || '');
      const direMatchesAway = areTeamsMatching(awayTeam, match.dire_name || '');

      if (radiantMatchesHome && direMatchesAway) return match;

      const radiantMatchesAway = areTeamsMatching(awayTeam, match.radiant_name || '');
      const direMatchesHome = areTeamsMatching(homeTeam, match.dire_name || '');

      if (radiantMatchesAway && direMatchesHome) return match;
    }

    return null;
  } catch {
    return null;
  }
}

// --- Stats ---

export async function fetchOpenDotaStats(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<FixtureStatistic[]> {
  const proMatch = await findProMatch(date, homeTeam, awayTeam);
  if (!proMatch) return [];

  try {
    const res = await odFetch(`/matches/${proMatch.match_id}`);
    if (!res.ok) return [];

    const match: MatchDetail = await res.json();

    // Determine which side is "home" and "away"
    const radiantIsHome = areTeamsMatching(
      homeTeam,
      match.radiant_team?.name || proMatch.radiant_name || ''
    );

    const homePlayers = match.players.filter((p) =>
      radiantIsHome ? p.isRadiant : !p.isRadiant
    );
    const awayPlayers = match.players.filter((p) =>
      radiantIsHome ? !p.isRadiant : p.isRadiant
    );

    const sum = (players: typeof match.players, key: keyof typeof match.players[0]) =>
      players.reduce((acc, p) => acc + (Number(p[key]) || 0), 0);

    const avg = (players: typeof match.players, key: keyof typeof match.players[0]) => {
      const total = sum(players, key);
      return players.length > 0 ? Math.round(total / players.length) : 0;
    };

    const homeKills = sum(homePlayers, 'kills');
    const awayKills = sum(awayPlayers, 'kills');
    const homeDeaths = sum(homePlayers, 'deaths');
    const awayDeaths = sum(awayPlayers, 'deaths');
    const homeAssists = sum(homePlayers, 'assists');
    const awayAssists = sum(awayPlayers, 'assists');

    const homeScore = radiantIsHome ? match.radiant_score : match.dire_score;
    const awayScore = radiantIsHome ? match.dire_score : match.radiant_score;
    const homeTowers = countTowers(
      radiantIsHome ? match.tower_status_radiant : match.tower_status_dire
    );
    const awayTowers = countTowers(
      radiantIsHome ? match.tower_status_dire : match.tower_status_radiant
    );

    const winner = radiantIsHome
      ? match.radiant_win ? homeTeam : awayTeam
      : match.radiant_win ? awayTeam : homeTeam;

    const stats: FixtureStatistic[] = [
      { type: 'Result', home: winner === homeTeam ? 'Victoria' : 'Derrota', away: winner === awayTeam ? 'Victoria' : 'Derrota' },
      { type: 'Score', home: homeScore, away: awayScore },
      { type: 'Kills', home: homeKills, away: awayKills },
      { type: 'Deaths', home: homeDeaths, away: awayDeaths },
      { type: 'Assists', home: homeAssists, away: awayAssists },
      { type: 'KDA', home: `${homeKills}/${homeDeaths}/${homeAssists}`, away: `${awayKills}/${awayDeaths}/${awayAssists}` },
      { type: 'Last Hits', home: sum(homePlayers, 'last_hits'), away: sum(awayPlayers, 'last_hits') },
      { type: 'Denies', home: sum(homePlayers, 'denies'), away: sum(awayPlayers, 'denies') },
      { type: 'GPM (avg)', home: avg(homePlayers, 'gold_per_min'), away: avg(awayPlayers, 'gold_per_min') },
      { type: 'XPM (avg)', home: avg(homePlayers, 'xp_per_min'), away: avg(awayPlayers, 'xp_per_min') },
      { type: 'Hero Damage', home: sum(homePlayers, 'hero_damage'), away: sum(awayPlayers, 'hero_damage') },
      { type: 'Tower Damage', home: sum(homePlayers, 'tower_damage'), away: sum(awayPlayers, 'tower_damage') },
      { type: 'Hero Healing', home: sum(homePlayers, 'hero_healing'), away: sum(awayPlayers, 'hero_healing') },
      { type: 'Towers Standing', home: homeTowers, away: awayTowers },
      { type: 'Duration', home: formatDuration(match.duration), away: formatDuration(match.duration) },
    ];

    if (match.first_blood_time > 0) {
      stats.push({
        type: 'First Blood',
        home: formatDuration(match.first_blood_time),
        away: null,
      });
    }

    return stats;
  } catch {
    return [];
  }
}

// --- H2H ---

export async function fetchOpenDotaH2H(
  date: string,
  homeTeam: string,
  awayTeam: string
): Promise<H2HMatch[]> {
  // Use proMatches to find recent games between the same teams
  try {
    const res = await odFetch('/proMatches', 300);
    if (!res.ok) return [];

    const matches: ProMatch[] = await res.json();
    const h2h: H2HMatch[] = [];

    for (const match of matches) {
      const r = match.radiant_name || '';
      const d = match.dire_name || '';

      const isMatch =
        (areTeamsMatching(homeTeam, r) && areTeamsMatching(awayTeam, d)) ||
        (areTeamsMatching(homeTeam, d) && areTeamsMatching(awayTeam, r));

      if (!isMatch) continue;

      h2h.push({
        date: new Date(match.start_time * 1000).toISOString(),
        homeTeam: match.radiant_name || 'Radiant',
        awayTeam: match.dire_name || 'Dire',
        homeScore: match.radiant_score,
        awayScore: match.dire_score,
        league: match.league_name || 'Dota 2',
      });

      if (h2h.length >= 10) break;
    }

    return h2h;
  } catch {
    return [];
  }
}
