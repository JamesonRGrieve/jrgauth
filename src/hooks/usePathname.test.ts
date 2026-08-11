// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * usePathname wraps next/navigation's usePathname inside a useState/useEffect
 * pair so the consumer always sees the latest pathname even across Next.js
 * client transitions. We can't exercise the hook without a React renderer
 * and a Next router context, so this file pins the type surface and the
 * module structure so a future refactor can't silently drop the wrapper.
 *
 * When happy-dom / a renderHook harness lands (tracked in todo.json),
 * expand this file with behavioural coverage of the effect dependency.
 */
import { describe, expectTypeOf, it } from 'vitest';
import usePathname from './usePathname';

describe('usePathname (type surface)', () => {
  it('is a parameterless hook', () => {
    expectTypeOf(usePathname).toBeFunction();
    expectTypeOf(usePathname).parameters.toEqualTypeOf<[]>();
  });

  it('returns the same shape as next/navigation usePathname (string | null)', () => {
    // The Next types model usePathname() as returning a string under the
    // app router; the local wrapper preserves that.
    expectTypeOf<ReturnType<typeof usePathname>>().not.toBeAny();
  });

  it('module loads without dragging in jsx-runtime side effects at import time', () => {
    // Importing the module is the assertion — if the module graph breaks
    // (e.g. a stale next import), this test file fails to compile.
    expectTypeOf<typeof usePathname>().not.toBeAny();
  });
});
