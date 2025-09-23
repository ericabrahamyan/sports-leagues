import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { leaguesApi } from '@/api/leagues/leagues.api';

import { useLeagues } from '../useLeagues';

vi.mock('@/api/leagues/leagues.api', () => ({
  leaguesApi: {
    fetchLeagues: vi.fn(),
  },
}));

describe('useLeagues', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches leagues successfully', async () => {
    const mockData = {
      leagues: [
        {
          idLeague: '1',
          strLeague: 'Premier League',
          strSport: 'Soccer',
          strLeagueAlternate: 'EPL',
        },
        {
          idLeague: '2',
          strLeague: 'NBA',
          strSport: 'Basketball',
          strLeagueAlternate: 'National Basketball Association',
        },
      ],
    };

    vi.mocked(leaguesApi.fetchLeagues).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLeagues(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.filteredLeagues).toEqual(mockData.leagues);
    expect(result.current.availableSports).toEqual(['Basketball', 'Soccer']);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedSport).toBe('');
    expect(typeof result.current.setSearchTerm).toBe('function');
    expect(typeof result.current.setSelectedSport).toBe('function');
    expect(typeof result.current.resetFilters).toBe('function');
  });

  it('handles error state', async () => {
    const error = new Error('Failed to fetch');
    vi.mocked(leaguesApi.fetchLeagues).mockRejectedValue(error);

    const { result } = renderHook(() => useLeagues(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.filteredLeagues).toEqual([]);
    expect(result.current.availableSports).toEqual([]);
  });

  it('shows loading state initially', () => {
    vi.mocked(leaguesApi.fetchLeagues).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useLeagues(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.filteredLeagues).toEqual([]);
    expect(result.current.availableSports).toEqual([]);
  });

  it('filters leagues by search term', async () => {
    const mockData = {
      leagues: [
        {
          idLeague: '1',
          strLeague: 'Premier League',
          strSport: 'Soccer',
          strLeagueAlternate: 'EPL',
        },
        {
          idLeague: '2',
          strLeague: 'NBA',
          strSport: 'Basketball',
          strLeagueAlternate: 'National Basketball Association',
        },
      ],
    };

    vi.mocked(leaguesApi.fetchLeagues).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLeagues(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    act(() => {
      result.current.setSearchTerm('Premier');
    });

    await waitFor(() => {
      expect(result.current.filteredLeagues).toHaveLength(1);
    });

    expect(result.current.filteredLeagues[0].strLeague).toBe('Premier League');
  });

  it('filters leagues by sport', async () => {
    const mockData = {
      leagues: [
        {
          idLeague: '1',
          strLeague: 'Premier League',
          strSport: 'Soccer',
          strLeagueAlternate: 'EPL',
        },
        {
          idLeague: '2',
          strLeague: 'NBA',
          strSport: 'Basketball',
          strLeagueAlternate: 'National Basketball Association',
        },
      ],
    };

    vi.mocked(leaguesApi.fetchLeagues).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLeagues(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    act(() => {
      result.current.setSelectedSport('Soccer');
    });

    expect(result.current.filteredLeagues).toHaveLength(1);
    expect(result.current.filteredLeagues[0].strSport).toBe('Soccer');
  });

  it('clears all filters', async () => {
    const mockData = {
      leagues: [
        {
          idLeague: '1',
          strLeague: 'Premier League',
          strSport: 'Soccer',
          strLeagueAlternate: 'EPL',
        },
        {
          idLeague: '2',
          strLeague: 'NBA',
          strSport: 'Basketball',
          strLeagueAlternate: 'National Basketball Association',
        },
      ],
    };

    vi.mocked(leaguesApi.fetchLeagues).mockResolvedValue(mockData);

    const { result } = renderHook(() => useLeagues(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });

    act(() => {
      result.current.setSearchTerm('Premier');
      result.current.setSelectedSport('Soccer');
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedSport).toBe('');
    expect(result.current.filteredLeagues).toEqual(mockData.leagues);
  });
});
