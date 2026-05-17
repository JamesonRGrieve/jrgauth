/**
 * useAuthentication is a thin hook that reads the AuthenticationContext
 * and asserts the context's `authModes` invariants. Without a React
 * provider in scope it throws "must be used within an
 * AuthenticationProvider" — that's the only behaviour we can pin
 * without a DOM env.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { useAuthentication } from './useAuthentication';

describe('useAuthentication', () => {
  it('is a parameterless hook', () => {
    expectTypeOf(useAuthentication).toBeFunction();
    expectTypeOf(useAuthentication).parameters.toEqualTypeOf<[]>();
  });

  it('throws when called outside a React render tree (no provider in scope)', () => {
    // Calling a hook outside a component triggers React's dispatcher
    // null guard. Once a renderHook-driven test environment lands, this
    // becomes the stricter "must be used within AuthenticationProvider"
    // assertion.
    expect(() => useAuthentication()).toThrow();
  });

  it('does not return `any` (the inferred return type stays narrow)', () => {
    expectTypeOf<ReturnType<typeof useAuthentication>>().not.toBeAny();
  });
});
