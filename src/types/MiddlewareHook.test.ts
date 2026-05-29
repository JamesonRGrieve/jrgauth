import { describe, expectTypeOf, it } from 'vitest';
import type { MiddlewareHook } from './MiddlewareHook';

describe('MiddlewareHook', () => {
  it('is a function returning a Promise<{ activated, response }>', () => {
    // Type-level assertion: a value implementing the MiddlewareHook contract
    // must produce an object with the expected shape. If the type changes
    // (e.g. activated drops to optional), this test must be updated.
    const stub: MiddlewareHook = async () =>
      Promise.resolve({
        activated: true,
        response: {} as never,
      });

    expectTypeOf(stub).toBeFunction();
    expectTypeOf(stub).parameters.toBeObject();
    expectTypeOf(stub).returns.resolves.toHaveProperty('activated');
    expectTypeOf(stub).returns.resolves.toHaveProperty('response');
  });

  it('reports activated as a boolean', async () => {
    const stub: MiddlewareHook = async () =>
      Promise.resolve({
        activated: false,
        response: {} as never,
      });
    const out = await stub({} as never);
    expectTypeOf(out.activated).toBeBoolean();
  });
});
