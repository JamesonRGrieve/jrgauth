/**
 * ErrorPage renders a "something went wrong" view with a "Try again" /
 * "Logout" button pair. Without a happy-dom + Next router renderer we
 * exercise the prop surface so a downstream consumer cannot silently drift.
 */
import { describe, expectTypeOf, it } from 'vitest';
import ErrorPage, { type ErrorPageProps } from './ErrorPage';

describe('ErrorPage (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(ErrorPage).toBeFunction();
  });

  it('accepts an optional redirectTo prop', () => {
    expectTypeOf<ErrorPageProps>().toEqualTypeOf<{ redirectTo?: string }>();
  });

  it('accepts an empty props object (redirectTo is optional)', () => {
    expectTypeOf(ErrorPage).parameter(0).toMatchTypeOf<ErrorPageProps>();
  });
});
