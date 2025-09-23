import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { leaguesApi } from '@/api/leagues/leagues.api';
import { filterLeagues } from '@/utils/filterLeagues';

import type { LeaguesResponse, League } from '@/api/leagues/leagues.types';

type UseLeaguesOptions = {
  initialSearchTerm?: string;
  initialSelectedSport?: string;
};

interface UseLeaguesReturn {
  data?: LeaguesResponse;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  leagues: League[];
  filteredLeagues: League[];
  availableSports: string[];
  searchTerm: string;
  selectedSport: string;
  setSearchTerm: (term: string) => void;
  setSelectedSport: (sport: string) => void;
  resetFilters: () => void;
}

export function useLeagues({
  initialSearchTerm = '',
  initialSelectedSport = '',
}: UseLeaguesOptions = {}): UseLeaguesReturn {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedSport, setSelectedSport] = useState(initialSelectedSport);

  const { data, isLoading, isFetching, error } = useQuery<LeaguesResponse>({
    queryKey: ['leagues'],
    queryFn: () => leaguesApi.fetchLeagues(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnMount: 'always',
  });

  const leagues = data?.leagues ?? [];

  const availableSports = Array.from(
    new Set(leagues.map((l) => l?.strSport).filter(Boolean) as string[])
  ).sort();

  const filteredLeagues = filterLeagues(leagues, searchTerm, selectedSport);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSport('');
  };

  return {
    data,
    isLoading,
    isFetching,
    error,
    leagues,
    filteredLeagues,
    availableSports,
    searchTerm,
    selectedSport,
    setSearchTerm,
    setSelectedSport,
    resetFilters,
  };
}
