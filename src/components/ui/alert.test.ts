// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface-level contract test for the Alert primitive trio. The
 * component itself is a forwardRef wrapper around `<div role="alert">`;
 * its meaningful behaviour is the variant-driven className. Calling a
 * forwardRef's `render` directly requires reaching past the public
 * type, which trips the workspace `as unknown` ban — so this file
 * sticks to public type assertions and displayName invariants.
 *
 * When @testing-library/react is wired up (tracked in todo.json),
 * replace this with `render()` + class-list assertions per variant.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert surface', () => {
  it('exports all three subcomponents', () => {
    expectTypeOf(Alert).toBeObject();
    expectTypeOf(AlertTitle).toBeObject();
    expectTypeOf(AlertDescription).toBeObject();
  });

  it('preserves stable displayName values for devtools / snapshots', () => {
    expect(Alert.displayName).toBe('Alert');
    expect(AlertTitle.displayName).toBe('AlertTitle');
    expect(AlertDescription.displayName).toBe('AlertDescription');
  });

  it('Alert accepts the destructive variant', () => {
    type Props = React.ComponentPropsWithoutRef<typeof Alert>;
    expectTypeOf<Props['variant']>().toEqualTypeOf<'default' | 'destructive' | null | undefined>();
  });

  it('Alert accepts a className override (variant + caller compose)', () => {
    type Props = React.ComponentPropsWithoutRef<typeof Alert>;
    expectTypeOf<Props['className']>().toEqualTypeOf<string | undefined>();
  });

  it('AlertTitle / AlertDescription accept children + className like a generic block', () => {
    type TitleProps = React.ComponentPropsWithoutRef<typeof AlertTitle>;
    type DescProps = React.ComponentPropsWithoutRef<typeof AlertDescription>;
    expectTypeOf<TitleProps['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<DescProps['className']>().toEqualTypeOf<string | undefined>();
  });
});
