import { useQuery, type QueryClient } from '@tanstack/react-query';

import { leaguesApi } from '@/api/leagues/leagues.api';

import type { SeasonBadgesResponse } from '@/api/leagues/leagues.types';

const DAY = 24 * 60 * 60 * 1000;

export const seasonBadgesQueryOptions = (leagueId: string) => ({
  queryKey: ['season-badges', leagueId] as const,
  queryFn: () => leaguesApi.fetchSeasonBadges(leagueId) as Promise<SeasonBadgesResponse>,
  staleTime: DAY,
  gcTime: Infinity,
});

export function useSeasonBadges(leagueId: string | null) {
  return useQuery({
    queryKey: ['season-badges', leagueId] as const,
    queryFn: () => leaguesApi.fetchSeasonBadges(leagueId as string),
    enabled: !!leagueId,
    placeholderData: (prev) => prev,
    staleTime: DAY,
    gcTime: Infinity,
  });
}

export function prefetchSeasonBadges(qc: QueryClient, leagueId: string) {
  return qc.prefetchQuery(seasonBadgesQueryOptions(leagueId));
}
