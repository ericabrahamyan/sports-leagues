import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { leaguesApi } from '@/api/leagues/leagues.api';
import { useSeasonBadges } from '@/hooks/useSeasonBadges';

vi.mock('@/api/leagues/leagues.api', () => ({
  leaguesApi: { fetchSeasonBadges: vi.fn() },
}));

describe('useSeasonBadges', () => {
  let qc: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    vi.clearAllMocks();
  });

  it('does not fetch when leagueId is null', async () => {
    const { result } = renderHook(() => useSeasonBadges(null), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(leaguesApi.fetchSeasonBadges).not.toHaveBeenCalled();
  });

  it('fetches when leagueId is provided', async () => {
    const mock = {
      seasons: [
        { strSeason: '2023', strBadge: 'https://example.com/badge-2023.png' },
        { strSeason: '2022', strBadge: null },
      ],
    };

    vi.mocked(leaguesApi.fetchSeasonBadges).mockResolvedValue(mock);

    const { result } = renderHook(() => useSeasonBadges('123'), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(leaguesApi.fetchSeasonBadges).toHaveBeenCalledTimes(1);
    expect(leaguesApi.fetchSeasonBadges).toHaveBeenCalledWith('123');
    expect(result.current.data).toEqual(mock);
    expect(result.current.isLoading).toBe(false);
  });

  it('starts disabled and fetches after leagueId toggles from null to id', async () => {
    const mock = { seasons: [{ strSeason: '2024', strBadge: 'https://example.com/2024.png' }] };
    vi.mocked(leaguesApi.fetchSeasonBadges).mockResolvedValue(mock);

    const { result, rerender } = renderHook(({ leagueId }) => useSeasonBadges(leagueId), {
      initialProps: { leagueId: null as string | null },
      wrapper,
    });

    expect(leaguesApi.fetchSeasonBadges).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();

    rerender({ leagueId: '999' });

    await waitFor(() => expect(result.current.data).toEqual(mock));
    expect(leaguesApi.fetchSeasonBadges).toHaveBeenCalledWith('999');
  });
});
