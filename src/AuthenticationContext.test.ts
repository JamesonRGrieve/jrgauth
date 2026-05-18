/**
 * AuthenticationContext is a thin React context with an `undefined` default.
 * We exercise the public surface: identity, default value, displayName
 * (via Provider/Consumer presence), and the type parameter.
 */
import type { Context } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { AuthenticationContext } from './AuthenticationContext';
import type { AuthenticationConfig } from './Router';

describe('AuthenticationContext', () => {
  it('is a React Context object', () => {
    expect(AuthenticationContext).toBeDefined();
    expect(AuthenticationContext).toHaveProperty('Provider');
    expect(AuthenticationContext).toHaveProperty('Consumer');
    // React 18+ contexts also expose $$typeof.
    expect((AuthenticationContext as unknown as { $$typeof: symbol }).$$typeof).toBeTypeOf('symbol');
  });

  it('defaults to `undefined` so consumers without a Provider can detect the missing context', () => {
    // The 4th positional field on a React context object is the default value;
    // however it is not part of the public type — read it via the Consumer.
    // The contract the rest of this repo depends on is that
    // `useContext(AuthenticationContext)` returns `undefined` when un-provided,
    // which mirrors the default exactly.
    const consumerDefault = (AuthenticationContext as unknown as { _currentValue: unknown })._currentValue;
    expect(consumerDefault).toBeUndefined();
  });

  it('is generically parameterised over AuthenticationConfig | undefined', () => {
    expectTypeOf(AuthenticationContext).toEqualTypeOf<Context<AuthenticationConfig | undefined>>();
  });
});
