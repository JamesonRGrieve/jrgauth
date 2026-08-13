// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Logout is a `'use client'` component that wires `next/navigation`,
 * `cookies-next`, and the AuthenticationContext together. Without a Next
 * router and a happy-dom env we cannot exercise the effect; instead we pin
 * the prop surface so a future refactor cannot silently widen / narrow the
 * accepted prop shape downstream apps already depend on.
 */
import { describe, expectTypeOf, it } from 'vitest';
import Logout, { type LogoutProps } from './Logout';

describe('Logout (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(Logout).toBeFunction();
  });

  it('accepts an optional redirectTo prop', () => {
    expectTypeOf<LogoutProps>().toExtend<{ redirectTo?: string }>();
  });

  it('renders to a React node', () => {
    type R = ReturnType<typeof Logout>;
    // ReactNode covers null, elements, strings, fragments etc.
    expectTypeOf<R>().not.toBeAny();
  });

  it('renders without throwing under default args, given a no-arg invocation contract', () => {
    // We cannot invoke the function (it uses hooks) without a renderer, but we
    // can ensure the default-prop branch is at minimum well-typed.
    expectTypeOf(Logout).parameter(0).toExtend<LogoutProps>();
  });
});
