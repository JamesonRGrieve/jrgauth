/**
 * Surface tests for the Switch primitive. Without a DOM environment we
 * can't click it; what we can do is pin the public prop contract that
 * downstream forms rely on (controlled / uncontrolled / disabled).
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Switch } from './switch';

type SwitchProps = React.ComponentPropsWithoutRef<typeof Switch>;

describe('Switch surface', () => {
  it('is a forwardRef component with a stable displayName', () => {
    expect(typeof Switch.displayName).toBe('string');
    expect(String(Switch.displayName).length).toBeGreaterThan(0);
  });

  it('admits the Radix Switch.Root controlled prop trio', () => {
    expectTypeOf<SwitchProps['checked']>().not.toBeAny();
    expectTypeOf<SwitchProps['defaultChecked']>().not.toBeAny();
    expectTypeOf<SwitchProps['disabled']>().not.toBeAny();
  });

  it('onCheckedChange is callable with a boolean', () => {
    type Handler = NonNullable<SwitchProps['onCheckedChange']>;
    expectTypeOf<Handler>().parameters.toEqualTypeOf<[boolean]>();
  });

  it('accepts a className override (consumer styling pass-through)', () => {
    expectTypeOf<SwitchProps['className']>().toEqualTypeOf<string | undefined>();
  });

  it('exposes name (form participation)', () => {
    expectTypeOf<SwitchProps['name']>().not.toBeAny();
  });
});
