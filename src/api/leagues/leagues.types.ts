import { z } from 'zod';

import {
  LeagueSchema,
  LeaguesResponseSchema,
  SeasonBadgeSchema,
  SeasonBadgesResponseSchema,
} from './leagues.schema';

export type League = z.infer<typeof LeagueSchema>;
export type LeaguesResponse = z.infer<typeof LeaguesResponseSchema>;
export type SeasonBadge = z.infer<typeof SeasonBadgeSchema>;
export type SeasonBadgesResponse = z.infer<typeof SeasonBadgesResponseSchema>;
