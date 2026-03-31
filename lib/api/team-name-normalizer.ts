/**
 * Normalizes team names for cross-API fuzzy matching.
 * Different APIs use different naming conventions
 * (e.g., "LA Lakers" vs "Los Angeles Lakers" vs "Lakers").
 */

const COMMON_SUFFIXES = [
  'fc', 'sc', 'cf', 'ac', 'bc', 'hc', 'rfc', 'afc',
  'united', 'city', 'town', 'athletic',
  'esports', 'gaming', 'team', 'club', 'org',
];

const KNOWN_ALIASES: Record<string, string[]> = {
  // NBA
  'los angeles lakers': ['la lakers', 'lakers'],
  'los angeles clippers': ['la clippers', 'clippers'],
  'golden state warriors': ['gs warriors', 'warriors'],
  'new york knicks': ['ny knicks', 'knicks'],
  'brooklyn nets': ['bk nets', 'nets'],
  'san antonio spurs': ['sa spurs', 'spurs'],
  'oklahoma city thunder': ['okc thunder', 'thunder'],
  'portland trail blazers': ['portland blazers', 'trail blazers', 'blazers'],
  'minnesota timberwolves': ['timberwolves', 'wolves'],
  'philadelphia 76ers': ['philly 76ers', 'sixers'],
  // NHL
  'montreal canadiens': ['canadiens montreal', 'canadiens', 'habs'],
  'toronto maple leafs': ['maple leafs', 'leafs'],
  'new york rangers': ['ny rangers', 'rangers'],
  'new york islanders': ['ny islanders', 'islanders'],
  'los angeles kings': ['la kings', 'kings'],
  'san jose sharks': ['sj sharks', 'sharks'],
  'tampa bay lightning': ['tb lightning', 'lightning'],
  'vegas golden knights': ['golden knights', 'vgk'],
  'seattle kraken': ['kraken'],
  'carolina hurricanes': ['hurricanes', 'canes'],
  'columbus blue jackets': ['blue jackets', 'cbj'],
  'st louis blues': ['st. louis blues', 'blues'],
  // Esports
  'team liquid': ['liquid', 'tl'],
  'cloud9': ['c9'],
  'fnatic': ['fnc'],
  'g2 esports': ['g2'],
  't1': ['sk telecom t1', 'skt t1', 'skt'],
  'natus vincere': ['navi', "na'vi"],
  'og': ['og esports'],
  'team spirit': ['spirit', 'ts'],
  'evil geniuses': ['eg'],
  'team secret': ['secret'],
  'psg lgd': ['lgd', 'lgd gaming'],
  'virtus pro': ['virtus.pro', 'vp'],
};

function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalize(name: string): string {
  let n = stripDiacritics(name).toLowerCase().trim();
  // Remove common punctuation
  n = n.replace(/[.'"]/g, '').replace(/\s+/g, ' ');
  return n;
}

function getCanonical(normalized: string): string | null {
  for (const [canonical, aliases] of Object.entries(KNOWN_ALIASES)) {
    if (normalized === canonical) return canonical;
    if (aliases.includes(normalized)) return canonical;
  }
  return null;
}

function stripSuffixes(normalized: string): string {
  const words = normalized.split(' ');
  const filtered = words.filter((w) => !COMMON_SUFFIXES.includes(w));
  return filtered.length > 0 ? filtered.join(' ') : normalized;
}

export function areTeamsMatching(name1: string, name2: string): boolean {
  const n1 = normalize(name1);
  const n2 = normalize(name2);

  // Exact match
  if (n1 === n2) return true;

  // Alias resolution
  const c1 = getCanonical(n1);
  const c2 = getCanonical(n2);
  if (c1 && c2 && c1 === c2) return true;
  if (c1 && (c1 === n2 || KNOWN_ALIASES[c1]?.includes(n2))) return true;
  if (c2 && (c2 === n1 || KNOWN_ALIASES[c2]?.includes(n1))) return true;

  // Substring containment (longer name contains shorter)
  if (n1.length > 3 && n2.length > 3) {
    if (n1.includes(n2) || n2.includes(n1)) return true;
  }

  // Match after stripping common suffixes
  const s1 = stripSuffixes(n1);
  const s2 = stripSuffixes(n2);
  if (s1 === s2) return true;
  if (s1.length > 3 && s2.length > 3) {
    if (s1.includes(s2) || s2.includes(s1)) return true;
  }

  return false;
}
