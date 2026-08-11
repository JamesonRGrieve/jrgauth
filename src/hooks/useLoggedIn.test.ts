// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * useLoggedIn is a Next.js client-side hook that fires an axios GET
 * against `${API_URI}/v1/user` once on mount and stores the boolean
 * result in state. Exercising the effect needs a renderHook harness
 * plus `axios` mocking — neither wired up yet (tracked in todo.json).
 *
 * Until that lands, this file pins the public surface so a refactor
 * can't silently change the return shape that every downstream consumer
 * destructures.
 */
import { describe, expectTypeOf, it } from 'vitest';
import useLoggedIn from './useLoggedIn';

describe('useLoggedIn (type surface)', () => {
  it('is a parameterless React hook', () => {
    expectTypeOf(useLoggedIn).toBeFunction();
    expectTypeOf(useLoggedIn).parameters.toEqualTypeOf<[]>();
  });

  it('returns an object with a boolean `isLoggedIn` field', () => {
    type Ret = ReturnType<typeof useLoggedIn>;
    expectTypeOf<Ret['isLoggedIn']>().toEqualTypeOf<boolean>();
  });

  it('exports a default function (matches the module convention)', () => {
    expectTypeOf<typeof useLoggedIn>().not.toBeAny();
  });
});
