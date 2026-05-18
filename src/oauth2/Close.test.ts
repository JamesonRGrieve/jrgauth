/**
 * Surface test for the OAuth Close component. The effect calls
 * window.close() on mount, which we cannot exercise without a DOM env.
 * Here we lock the public signature: parameterless default export
 * returning a ReactNode, with an exported empty CloseProps record.
 */
import type { ReactNode } from 'react';
import { describe, expectTypeOf, it } from 'vitest';
import Close from './Close';
import type { CloseProps } from './Close';

describe('Close (surface)', () => {
  it('default export is a parameterless React component', () => {
    expectTypeOf(Close).toBeFunction();
    expectTypeOf(Close).parameters.toEqualTypeOf<[]>();
  });

  it('returns a ReactNode', () => {
    type R = ReturnType<typeof Close>;
    expectTypeOf<R>().toExtend<ReactNode>();
  });

  it('CloseProps is an empty Record type (component takes no public props)', () => {
    expectTypeOf<CloseProps>().toEqualTypeOf<Record<string, never>>();
  });
});
