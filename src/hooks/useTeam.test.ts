import { getCookie, setCookie } from 'cookies-next/client';
import useSWR, { type BareFetcher, type Key } from 'swr';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SYSTEM_TEAM_ID, useTeam, useTeams } from './useTeam';

const { requestMock, chainMutationsMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
  chainMutationsMock: vi.fn((_dep: object, original: () => Promise<unknown>) => original),
}));

vi.mock('swr', () => ({
  default: vi.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: true,
    mutate: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  })),
}));

vi.mock('cookies-next/client', () => ({
  getCookie: vi.fn(() => 'auth-team-id'),
  setCookie: vi.fn(),
}));

vi.mock('../lib/log', () => ({ default: vi.fn() }));

vi.mock('./lib', () => ({
  createGraphQLClient: vi.fn(() => ({ request: requestMock })),
  chainMutations: chainMutationsMock,
}));

const lastFetcher = (): BareFetcher => {
  const fetcher = vi.mocked(useSWR).mock.calls.at(-1)?.[1];
  if (typeof fetcher !== 'function') {
    throw new TypeError('expected a fetcher function to be passed to useSWR');
  }
  return fetcher;
};

const lastKeyHead = (): Key | undefined => {
  const key = vi.mocked(useSWR).mock.calls.at(-1)?.[0];
  return Array.isArray(key) ? (key[0] as Key) : key;
};

describe('useTeam module', () => {
  beforeEach(() => {
    requestMock.mockReset();
    vi.mocked(getCookie).mockReturnValue('auth-team-id');
    vi.mocked(setCookie).mockReset();
    chainMutationsMock.mockClear();
    vi.mocked(useSWR).mockClear();
  });

  it('exports the well-known system team sentinel id', () => {
    expect(SYSTEM_TEAM_ID).toBe('FFFFFFFF-FFFF-FFFF-0000-FFFFFFFFFFFF');
  });

  describe('useTeams', () => {
    it('fetches under the /teams key', () => {
      useTeams();
      expect(vi.mocked(useSWR).mock.calls.at(-1)?.[0]).toBe('/teams');
    });

    it('seeds an empty-array fallback', () => {
      useTeams();
      expect(vi.mocked(useSWR).mock.calls.at(-1)?.[2]).toEqual({ fallbackData: [] });
    });

    it('fetcher filters out the system team', async () => {
      requestMock.mockResolvedValue({
        teams: [{ id: 'team-1' }, { id: SYSTEM_TEAM_ID }, { id: 'team-2' }],
      });
      vi.mocked(getCookie).mockReturnValue('team-1');
      useTeams();
      await expect(lastFetcher()('/teams')).resolves.toEqual([{ id: 'team-1' }, { id: 'team-2' }]);
    });

    it('fetcher sets the auth-team cookie when none is selected', async () => {
      requestMock.mockResolvedValue({ teams: [{ id: 'team-1' }] });
      vi.mocked(getCookie).mockReturnValue(undefined);
      useTeams();
      await lastFetcher()('/teams');
      expect(setCookie).toHaveBeenCalledWith('auth-team', 'team-1', expect.any(Object));
    });

    it('fetcher returns an empty array when the request rejects', async () => {
      requestMock.mockRejectedValueOnce(new Error('down'));
      useTeams();
      await expect(lastFetcher()('/teams')).resolves.toEqual([]);
    });
  });

  describe('useTeam', () => {
    it('invokes useSWR twice (teams list plus the single-team lookup)', () => {
      useTeam('team-9');
      expect(vi.mocked(useSWR).mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it('builds a single-team key from the supplied id', () => {
      useTeam('team-9');
      expect(lastKeyHead()).toBe('/team?id=team-9');
    });

    it('falls back to the auth-team cookie when no id is supplied', () => {
      vi.mocked(getCookie).mockReturnValue('cookie-team');
      useTeam();
      expect(lastKeyHead()).toBe('/team?id=cookie-team');
    });

    it('rewires the single-team mutate through chainMutations', () => {
      useTeam('team-9');
      expect(chainMutationsMock).toHaveBeenCalled();
    });

    it('single-team fetcher returns null without a jwt cookie', () => {
      vi.mocked(getCookie).mockReturnValue(undefined);
      useTeam('team-9');
      expect(lastFetcher()(['/team?id=team-9', [], undefined])).toBeNull();
    });
  });
});
