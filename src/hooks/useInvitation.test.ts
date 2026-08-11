// SPDX-License-Identifier: AGPL-3.0-or-later
import useSWR, { type BareFetcher } from 'swr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInvitations } from './useInvitation';

vi.mock('swr', () => ({
  default: vi.fn(() => ({ data: undefined, error: undefined, isLoading: true })),
}));

vi.mock('cookies-next/client', () => ({
  getCookie: vi.fn(() => 'test-jwt'),
}));

vi.mock('../lib/log', () => ({ default: vi.fn() }));

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));
vi.mock('axios', () => ({
  default: { get: getMock },
}));

const lastFetcher = (): BareFetcher => {
  const fetcher = vi.mocked(useSWR).mock.calls.at(-1)?.[1];
  if (typeof fetcher !== 'function') {
    throw new TypeError('expected a fetcher function to be passed to useSWR');
  }
  return fetcher;
};

describe('useInvitations', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  afterEach(() => {
    vi.mocked(useSWR).mockClear();
  });

  it('passes a null SWR key when no team id is supplied', () => {
    useInvitations();
    expect(vi.mocked(useSWR).mock.calls.at(-1)?.[0]).toBeNull();
  });

  it('passes a null SWR key when the team id is an empty string', () => {
    useInvitations('');
    expect(vi.mocked(useSWR).mock.calls.at(-1)?.[0]).toBeNull();
  });

  it('builds a team-scoped array key when a team id is supplied', () => {
    useInvitations('team-42');
    expect(vi.mocked(useSWR).mock.calls.at(-1)?.[0]).toEqual(['/v1/team/team-42/invitation', 'team-42']);
  });

  it('seeds an empty-array fallback on the SWR options', () => {
    useInvitations('team-42');
    expect(vi.mocked(useSWR).mock.calls.at(-1)?.[2]).toEqual({ fallbackData: [] });
  });

  it('fetcher returns an empty array when there is no team id', async () => {
    useInvitations();
    await expect(lastFetcher()(null)).resolves.toEqual([]);
    expect(getMock).not.toHaveBeenCalled();
  });

  it('fetcher returns the invitations array from a successful response', async () => {
    const invitations = [{ id: 'inv-1' }];
    getMock.mockResolvedValue({ data: { invitations } });
    useInvitations('team-7');
    await expect(lastFetcher()(['/v1/team/team-7/invitation', 'team-7'])).resolves.toEqual(invitations);
    expect(getMock).toHaveBeenCalledOnce();
  });

  it('fetcher falls back to an empty array when the response omits invitations', async () => {
    getMock.mockResolvedValue({ data: {} });
    useInvitations('team-7');
    await expect(lastFetcher()(['/v1/team/team-7/invitation', 'team-7'])).resolves.toEqual([]);
  });

  it('fetcher returns an empty array when the request rejects', async () => {
    getMock.mockRejectedValue(new Error('boom'));
    useInvitations('team-7');
    await expect(lastFetcher()(['/v1/team/team-7/invitation', 'team-7'])).resolves.toEqual([]);
  });
});
