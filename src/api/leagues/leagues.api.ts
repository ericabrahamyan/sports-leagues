import { validateResponse } from '@/utils/validateResponse';

import { apiClient } from '../index';

import { LeaguesResponseSchema, SeasonBadgesResponseSchema } from './leagues.schema';

import type { LeaguesResponse, SeasonBadgesResponse } from './leagues.types';

export const leaguesApi = {
  async fetchLeagues(): Promise<LeaguesResponse> {
    const response = await apiClient.get('/all_leagues.php');
    return validateResponse(response.data, LeaguesResponseSchema, 'leagues API response');
  },

  async fetchSeasonBadges(leagueId: string): Promise<SeasonBadgesResponse> {
    const response = await apiClient.get('/search_all_seasons.php', {
      params: { badge: 1, id: leagueId },
    });
    return validateResponse(
      response.data,
      SeasonBadgesResponseSchema,
      'season badges API response'
    );
  },
};
