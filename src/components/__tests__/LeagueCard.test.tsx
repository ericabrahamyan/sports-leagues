import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LeagueCard } from '@/components/LeagueCard';
import { render } from '@/test-utils';

import type { League } from '@/api/leagues/leagues.types';

vi.mock('@/hooks/useSeasonBadges', () => ({
  useSeasonBadges: vi.fn(() => ({ data: undefined, isLoading: false })),
  seasonBadgesQueryOptions: vi.fn((leagueId: string) => ({
    queryKey: ['season-badges', leagueId],
    queryFn: () => Promise.resolve({ seasons: [] }),
  })),
}));

const mockPrefetchQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      prefetchQuery: mockPrefetchQuery,
    }),
  };
});

const league: League = {
  idLeague: '999',
  strLeague: 'Test League',
  strSport: 'Soccer',
  strLeagueAlternate: 'TL',
};

describe('LeagueCard prefetch', () => {
  beforeEach(() => {
    mockPrefetchQuery.mockClear();
  });

  it('prefetches on hover and focus', () => {
    const { getByRole } = render(
      <LeagueCard league={league} isExpanded={false} onToggle={() => {}} />
    );

    const card = getByRole('button');
    fireEvent.mouseEnter(card);

    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ['season-badges', '999'],
      queryFn: expect.any(Function),
    });

    mockPrefetchQuery.mockClear();
    fireEvent.focus(card);

    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ['season-badges', '999'],
      queryFn: expect.any(Function),
    });
  });
});
