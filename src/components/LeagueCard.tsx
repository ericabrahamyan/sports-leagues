import { Box, Text, Badge, HStack, VStack, Image, Skeleton } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { FaEye } from 'react-icons/fa';

import { useSeasonBadges, seasonBadgesQueryOptions } from '@/hooks/useSeasonBadges';
import { highlightText } from '@/utils/highlight';

import type { League } from '@/api/leagues/leagues.types';

interface BadgeContainerProps {
  children: React.ReactNode;
  badgeHeight?: number | string;
}

function BadgeContainer({ children, badgeHeight = 160 }: BadgeContainerProps) {
  return (
    <Box px={4} pb={4}>
      <Box
        mt={2}
        p={3}
        h={badgeHeight}
        rounded="xl"
        borderWidth="1px"
        borderColor="gray.200"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        {children}
      </Box>
    </Box>
  );
}

function CollapsedBadge() {
  return (
    <VStack gap={1} opacity={0.5}>
      <FaEye size={24} />
      <Text fontSize="xs">Show badge</Text>
    </VStack>
  );
}

interface ExpandedBadgeProps {
  imageUrl?: string;
  isLoading: boolean;
  leagueName?: string;
  initials: string;
}

function ExpandedBadge({ imageUrl, isLoading, leagueName, initials }: ExpandedBadgeProps) {
  if (isLoading) {
    return <Skeleton w="80%" h="70%" rounded="md" />;
  }

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={leagueName ? `${leagueName} badge` : 'League badge'}
        maxH="100px"
        maxW="100%"
        objectFit="contain"
        loading="lazy"
        transition="opacity .25s ease"
        filter="drop-shadow(0 0 1px rgba(0,0,0,0.25))"
      />
    );
  }

  return (
    <VStack gap={2} color="gray.500">
      <Box
        rounded="full"
        w="56px"
        h="56px"
        display="grid"
        placeItems="center"
        fontWeight="bold"
        fontSize="lg"
        bg="gray.200"
        color="gray.600"
      >
        {initials}
      </Box>
      <Text fontSize="xs" opacity={0.8}>
        No badge
      </Text>
    </VStack>
  );
}

interface LeagueCardProps {
  league: League;
  isExpanded: boolean;
  onToggle: () => void;
  badgeHeight?: number | string;
  searchTerm?: string;
}

export function LeagueCard({
  league,
  isExpanded,
  onToggle,
  badgeHeight = 160,
  searchTerm,
}: LeagueCardProps) {
  const qc = useQueryClient();

  const prefetchDetails = () => {
    if (!league.idLeague) return;
    qc.prefetchQuery(seasonBadgesQueryOptions(league.idLeague));
  };

  const { data, isLoading } = useSeasonBadges(isExpanded ? league.idLeague : null);

  const lastSeason = data?.seasons?.[data?.seasons?.length - 1];
  const imageUrl = lastSeason?.strBadge || undefined;

  const initials =
    league.strLeague?.match(/[A-Z]/g)?.slice(0, 2).join('') ||
    league.strLeague?.slice(0, 2).toUpperCase() ||
    'NL';

  return (
    <Box
      as="button"
      aria-pressed={isExpanded}
      aria-expanded={isExpanded}
      onClick={onToggle}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
      onTouchStart={prefetchDetails}
      cursor="pointer"
      rounded="2xl"
      borderWidth="1px"
      borderColor={isExpanded ? 'red.500' : 'gray.200'}
      bg="white"
      textAlign="left"
      transition="border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease"
      _hover={{
        borderColor: isExpanded ? 'red.600' : 'gray.300',
        transform: 'translateY(-1px)',
      }}
      _focusVisible={{ boxShadow: 'outline' }}
      overflow="hidden"
      w="100%"
    >
      <VStack align="start" gap={2} p={4} minH="92px">
        <HStack gap={2} flexWrap="wrap">
          {league.strSport && <Badge colorPalette="red">{league.strSport}</Badge>}
          {league.strLeague && <Badge colorPalette="blue">{league.strLeague}</Badge>}
        </HStack>

        <VStack align="start" gap={0} w="full">
          <Text fontWeight="semibold" lineClamp={1}>
            {searchTerm ? highlightText(league.strLeague || '', searchTerm) : league.strLeague}
          </Text>
          {league.strLeagueAlternate ? (
            <Text fontSize="sm" color="gray.600" lineClamp={1}>
              {searchTerm
                ? highlightText(league.strLeagueAlternate, searchTerm)
                : league.strLeagueAlternate}
            </Text>
          ) : (
            <Text fontSize="sm" visibility="hidden">
              .
            </Text>
          )}
        </VStack>
      </VStack>

      <BadgeContainer badgeHeight={badgeHeight}>
        {isExpanded ? (
          <ExpandedBadge
            imageUrl={imageUrl}
            isLoading={isLoading}
            leagueName={league.strLeague}
            initials={initials}
          />
        ) : (
          <CollapsedBadge />
        )}
      </BadgeContainer>
    </Box>
  );
}
