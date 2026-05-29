/**
 * Surface tests for useTeamUsers. The hook delegates to axios + SWR;
 * exercising the fetch requires a DOM env + axios mock. Here we lock
 * the public signature.
 */
import { describe, expectTypeOf, it } from 'vitest';
import useTeamUsers from './useTeamUsers';

describe('useTeamUsers (surface)', () => {
  it('is the default export and a callable hook', () => {
    expectTypeOf(useTeamUsers).toBeFunction();
  });

  it('accepts a teamId of `string | undefined`', () => {
    expectTypeOf(useTeamUsers).parameter(0).toEqualTypeOf<string | undefined>();
  });

  it('returns an SWR response shape (data + mutate)', () => {
    type R = ReturnType<typeof useTeamUsers>;
    expectTypeOf<R>().toHaveProperty('data');
    expectTypeOf<R>().toHaveProperty('mutate');
  });
});
