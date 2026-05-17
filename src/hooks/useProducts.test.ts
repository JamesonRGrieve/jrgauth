/**
 * useProducts wraps an axios GET behind SWR. The real network behaviour
 * needs a happy-dom env + axios mock (tracked in todo.json). For now we
 * pin the public surface: the export is the default, it's a hook
 * (function), and its return type is an SWRResponse over an array.
 */

import type { SWRResponse } from 'swr';
import { describe, expectTypeOf, it } from 'vitest';
import useProducts from './useProducts';

describe('useProducts (surface)', () => {
  it('is the default export and a callable hook', () => {
    expectTypeOf(useProducts).toBeFunction();
  });

  it('takes no arguments', () => {
    expectTypeOf(useProducts).parameters.toEqualTypeOf<[]>();
  });

  it('returns an SWRResponse over an array shape', () => {
    type R = ReturnType<typeof useProducts>;
    expectTypeOf<R>().toMatchTypeOf<SWRResponse<unknown[]>>();
  });
});
