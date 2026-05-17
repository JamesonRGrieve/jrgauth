/**
 * Surface tests for the Checkbox primitive. It's a Radix Checkbox.Root
 * re-export with className composition; behavioural coverage
 * (toggle / indeterminate / disabled) needs a DOM environment which
 * isn't wired up yet (tracked in todo.json).
 *
 * What we *can* pin without a DOM:
 *   - displayName carries through from Radix for devtools
 *   - the prop surface admits the controlled / disabled / form-name
 *     triad downstream forms depend on
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Checkbox } from './checkbox';

type CheckboxProps = React.ComponentPropsWithoutRef<typeof Checkbox>;

describe('Checkbox surface', () => {
  it('is a forwardRef component with a stable displayName', () => {
    expect(typeof Checkbox.displayName).toBe('string');
    expect(String(Checkbox.displayName).length).toBeGreaterThan(0);
  });

  it('admits the Radix Checkbox.Root controlled prop trio', () => {
    expectTypeOf<CheckboxProps['checked']>().not.toBeAny();
    expectTypeOf<CheckboxProps['defaultChecked']>().not.toBeAny();
    expectTypeOf<CheckboxProps['disabled']>().not.toBeAny();
  });

  it('exposes onCheckedChange (controlled value updates)', () => {
    expectTypeOf<CheckboxProps['onCheckedChange']>().not.toBeAny();
  });

  it('accepts a className override (consumer styling pass-through)', () => {
    expectTypeOf<CheckboxProps['className']>().toEqualTypeOf<string | undefined>();
  });

  it('exposes name for form participation', () => {
    expectTypeOf<CheckboxProps['name']>().not.toBeAny();
  });
});
