import type { League } from '@/api/leagues/leagues.types';

export function filterLeagues(
  leagues: League[] | undefined,
  searchTerm: string,
  selectedSport: string
): League[] {
  if (!leagues?.length) return [];

  const q = searchTerm.trim().toLowerCase();
  const hasSearch = q.length > 0;
  const hasSport = selectedSport.length > 0;

  return leagues.filter(({ strLeague, strLeagueAlternate, strSport }) => {
    const name = strLeague?.toLowerCase() ?? '';
    const alt = strLeagueAlternate?.toLowerCase() ?? '';

    const matchesSearch = !hasSearch || name.includes(q) || alt.includes(q);
    const matchesSport = !hasSport || strSport === selectedSport;

    return matchesSearch && matchesSport;
  });
}
