import { useState } from 'react';

import { SimpleGrid, Box, VisuallyHidden } from '@chakra-ui/react';

import { LeagueCard } from './LeagueCard';

import type { League } from '@/api/leagues/leagues.types';

interface LeagueGridProps {
  leagues: League[];
  isLoading?: boolean;
  skeletonCount?: number;
  searchTerm?: string;
}

function LeagueCardSkeleton() {
  return (
    <Box rounded="2xl" borderWidth="1px" borderColor="border" overflow="hidden" bg="bg">
      <Box bg="bg.muted" aspectRatio={16 / 9} />
      <Box p={4}>
        <Box h="4" w="70%" bg="bg.muted" rounded="md" />
        <Box h="3" w="40%" bg="bg.muted" rounded="md" mt={2} />
      </Box>
    </Box>
  );
}

export function LeagueGrid({ leagues, isLoading, skeletonCount = 6, searchTerm }: LeagueGridProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (leagueId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(leagueId)) {
        newSet.delete(leagueId);
      } else {
        newSet.add(leagueId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <>
        <VisuallyHidden aria-live="polite">Loading {skeletonCount} leagues…</VisuallyHidden>
        <SimpleGrid role="list" gap={5} minChildWidth="280px" mt={4}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Box role="listitem" key={i}>
              <LeagueCardSkeleton />
            </Box>
          ))}
        </SimpleGrid>
      </>
    );
  }

  return (
    <SimpleGrid
      role="list"
      gap={5}
      columns={{ base: 1, md: 2, xl: 3 }}
      minChildWidth="280px"
      mt={4}
      pt={1}
    >
      {leagues.map((league) => (
        <Box role="listitem" key={league.idLeague}>
          <LeagueCard
            league={league}
            searchTerm={searchTerm}
            isExpanded={expandedCards.has(league.idLeague)}
            onToggle={() => toggleCard(league.idLeague)}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
