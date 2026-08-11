// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * AuthenticationContext is a thin React context with an `undefined` default.
 * We exercise the public surface: identity, default value, displayName
 * (via Provider/Consumer presence), and the type parameter.
 */
import type { Context } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { AuthenticationContext } from './AuthenticationContext';
import type { AuthenticationConfig } from './Router';

// React context objects carry internal fields ($$typeof, _currentValue) that
// are not part of the public `Context<T>` type surface. We describe them with a
// runtime-internal interface that also includes the public members, so the
// assertion overlaps structurally and needs no `as unknown` escape hatch.
interface ReactContextInternals extends Context<AuthenticationConfig | undefined> {
  $$typeof: symbol;
  _currentValue: AuthenticationConfig | undefined;
}
const internals: ReactContextInternals = AuthenticationContext as ReactContextInternals;

describe('AuthenticationContext', () => {
  it('is a React Context object', () => {
    expect(AuthenticationContext).toBeDefined();
    expect(AuthenticationContext).toHaveProperty('Provider');
    expect(AuthenticationContext).toHaveProperty('Consumer');
    // React 18+ contexts also expose $$typeof.
    expect(internals.$$typeof).toBeTypeOf('symbol');
  });

  it('defaults to `undefined` so consumers without a Provider can detect the missing context', () => {
    // The default value lives on `_currentValue`; the contract the rest of this
    // repo depends on is that `useContext(AuthenticationContext)` returns
    // `undefined` when un-provided, which mirrors the default exactly.
    const consumerDefault = internals._currentValue;
    expect(consumerDefault).toBeUndefined();
  });

  it('is generically parameterised over AuthenticationConfig | undefined', () => {
    expectTypeOf(AuthenticationContext).toEqualTypeOf<Context<AuthenticationConfig | undefined>>();
  });
});
