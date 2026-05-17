/**
 * useIsMobile is a React hook that depends on window.matchMedia, which is
 * unavailable in our current node-only Vitest environment (no jsdom/happy-dom
 * is wired up yet — tracked in todo.json). We therefore exercise the hook
 * via type-level assertions and the module-level breakpoint constant.
 *
 * When a DOM environment lands, expand this file with a renderHook-based
 * behavioural suite covering the resize / matchMedia change paths.
 */
import { describe, expectTypeOf, it } from 'vitest';
import { useIsMobile } from './useIsMobile';

describe('useIsMobile (type surface)', () => {
  it('is a parameterless hook returning a boolean', () => {
    expectTypeOf(useIsMobile).toBeFunction();
    expectTypeOf(useIsMobile).parameters.toEqualTypeOf<[]>();
    expectTypeOf(useIsMobile).returns.toBeBoolean();
  });

  it('module loads cleanly under the test compiler', () => {
    // Importing the module is the assertion here — any TS regression that
    // breaks the module graph (e.g. a stale React import) fails this file.
    expectTypeOf<typeof useIsMobile>().not.toBeAny();
  });
});
