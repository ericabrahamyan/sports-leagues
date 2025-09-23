import { z } from 'zod';

export const LeagueSchema = z.object({
  idLeague: z.string(),
  strLeague: z.string(),
  strSport: z.string(),
  strLeagueAlternate: z.string().nullable().optional(),
});

export const LeaguesResponseSchema = z.object({
  leagues: z.array(LeagueSchema),
});

export const SeasonBadgeSchema = z.object({
  strSeason: z.string(),
  strBadge: z.string().nullable().optional(),
});

export const SeasonBadgesResponseSchema = z.object({
  seasons: z.array(SeasonBadgeSchema).nullable(),
});
