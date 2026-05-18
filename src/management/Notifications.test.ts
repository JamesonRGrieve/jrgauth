/**
 * Notifications is a near-empty heading/separator placeholder for a future
 * notification preferences pane. Surface tests pin the named export so a
 * downstream consumer cannot silently drift while the implementation
 * remains a stub.
 */
import { describe, expectTypeOf, it } from 'vitest';
import { Notifications } from './Notifications';

describe('Notifications (surface)', () => {
  it('is exported as a named callable component', () => {
    expectTypeOf(Notifications).toBeFunction();
  });

  it('accepts no required props (zero-arity render)', () => {
    expectTypeOf(Notifications).parameters.toEqualTypeOf<[]>();
  });
});
