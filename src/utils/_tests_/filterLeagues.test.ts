import { describe, it, expect } from 'vitest';

import { filterLeagues } from '@/utils/filterLeagues';

const leagues = [
  { idLeague: '1', strLeague: 'Premier League', strLeagueAlternate: 'EPL', strSport: 'Soccer' },
  {
    idLeague: '2',
    strLeague: 'NBA',
    strLeagueAlternate: 'National Basketball Association',
    strSport: 'Basketball',
  },
  {
    idLeague: '3',
    strLeague: 'La Liga',
    strLeagueAlternate: 'Primera División',
    strSport: 'Soccer',
  },
];

describe('filterLeagues', () => {
  it('returns [] for undefined leagues', () => {
    expect(filterLeagues(undefined, '', '')).toEqual([]);
  });

  it('matches by name (case-insensitive, trimmed)', () => {
    expect(filterLeagues(leagues, '  premier ', '')).toHaveLength(1);
  });

  it('matches by alternate name', () => {
    expect(filterLeagues(leagues, 'basketball', '')).toHaveLength(1);
  });

  it('filters by sport only', () => {
    const res = filterLeagues(leagues, '', 'Soccer');
    expect(res.map((l) => l.idLeague)).toEqual(['1', '3']);
  });

  it('combines search + sport', () => {
    const res = filterLeagues(leagues, 'liga', 'Soccer');
    expect(res.map((l) => l.idLeague)).toEqual(['3']);
  });
});
