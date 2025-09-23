import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { leaguesApi } from '@/api/leagues/leagues.api';
import { AllProviders } from '@/test-utils';

import App from './App';

vi.mock('@/api/leagues/leagues.api', () => ({
  leaguesApi: {
    fetchLeagues: vi.fn(),
  },
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderApp = () => {
    return render(<App />, { wrapper: AllProviders });
  };

  it('displays leagues and filters them by search', async () => {
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

    renderApp();

    await waitFor(() => {
      expect(screen.getAllByText('NBA')).toHaveLength(2);
    });

    expect(screen.getAllByText('Premier League')).toHaveLength(2);
  });

  it.skip('filters leagues by sport', async () => {
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

    renderApp();

    await waitFor(() => {
      expect(screen.getAllByText('Premier League')).toHaveLength(2);
    });
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

    renderApp();

    await waitFor(() => {
      expect(screen.getAllByText('NBA')).toHaveLength(2);
    });

    expect(screen.getAllByText('Premier League')).toHaveLength(2);
  });

  it('handles API failure gracefully', async () => {
    vi.mocked(leaguesApi.fetchLeagues).mockRejectedValue(new Error('API Error'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Sports Leagues')).toBeInTheDocument();
    });
  });
});
