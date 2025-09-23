import { useEffect } from 'react';

import { Box } from '@chakra-ui/react';

import { useLeagues } from '@/hooks/useLeagues';

import { toaster } from './AppToaster/toast';
import { Hero } from './Hero';
import LeagueFilters from './LeagueFilters';
import { LeagueGrid } from './LeagueGrid';

export function Leagues() {
  const {
    filteredLeagues,
    availableSports,
    searchTerm,
    selectedSport,
    setSearchTerm,
    setSelectedSport,
    resetFilters,
    isLoading,
    error,
  } = useLeagues();

  useEffect(() => {
    if (error) {
      toaster.create({
        title: 'Error loading leagues',
        description: 'Please try again later.',
        type: 'error',
        duration: 5000,
        closable: true,
      });
    }
  }, [error]);

  return (
    <>
      <Hero title="Sports Leagues" subtitle="Discover and explore leagues from around the world" />
      <LeagueFilters
        search={searchTerm}
        onSearch={setSearchTerm}
        sport={selectedSport}
        onSport={setSelectedSport}
        sports={availableSports}
        total={filteredLeagues.length}
        isLoading={isLoading}
        onClear={resetFilters}
      />
      <Box px={{ base: '16px', md: '3%' }} py="40px" maxW="1400px" mx="auto">
        <LeagueGrid leagues={filteredLeagues} isLoading={isLoading} searchTerm={searchTerm} />
      </Box>
    </>
  );
}
