/**
 * Surface test for the Identify component. The component drives a
 * react-hook-form + axios flow that needs a Next router + happy-dom
 * harness to exercise; until that lands we pin the prop type surface so
 * downstream apps cannot have it widened/narrowed silently.
 *
 * Uses `import type` to avoid loading the runtime module — Identify
 * transitively imports `@jgrieve/dynamic-form/*`, which does not resolve
 * when the auth repo is opened standalone.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type Identify from './Identify';
import type { IdentifyProps } from './Identify';

describe('Identify (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof Identify>().toBeFunction();
  });

  it('IdentifyProps exposes the four optional config fields', () => {
    expectTypeOf<IdentifyProps>().toEqualTypeOf<{
      identifyEndpoint?: string;
      redirectToOnExists?: string;
      redirectToOnNotExists?: string;
      oAuthOverrides?: Record<string, unknown>;
    }>();
  });

  it('every IdentifyProps field is optional', () => {
    expectTypeOf<IdentifyProps>().toExtend<Partial<IdentifyProps>>();
  });
});
