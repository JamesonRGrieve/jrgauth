/**
 * Surface tests for the DropdownMenu primitive bundle. The fifteen
 * exports mirror Radix's Menu surface plus a styled Shortcut + Sub
 * wrappers. Full interactive coverage waits on a DOM env (the menu
 * mounts into a portal); here we lock the export list and the
 * forwardRef shape of the wrappers.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

describe('DropdownMenu re-exports', () => {
  it('exposes Radix Root + Trigger + Portal + Sub + Group + RadioGroup pass-throughs', () => {
    expect(DropdownMenu).toBeDefined();
    expect(DropdownMenuTrigger).toBeDefined();
    expect(DropdownMenuPortal).toBeDefined();
    expect(DropdownMenuSub).toBeDefined();
    expect(DropdownMenuGroup).toBeDefined();
    expect(DropdownMenuRadioGroup).toBeDefined();
  });
});

describe('DropdownMenu styled wrappers', () => {
  it('wraps SubTrigger / SubContent / Content / Item / Checkbox / Radio / Label / Separator as forwardRef', () => {
    for (const cmp of [
      DropdownMenuSubTrigger,
      DropdownMenuSubContent,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuCheckboxItem,
      DropdownMenuRadioItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
    ]) {
      expectTypeOf(cmp).toBeObject();
      expect(typeof cmp.displayName).toBe('string');
      expect(String(cmp.displayName).length).toBeGreaterThan(0);
    }
  });

  it('SubTrigger accepts the optional `inset` boolean for second-level indentation', () => {
    type Props = React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>;
    expectTypeOf<Props['inset']>().toEqualTypeOf<boolean | undefined>();
  });

  it('Item accepts the optional `inset` boolean', () => {
    type Props = React.ComponentPropsWithoutRef<typeof DropdownMenuItem>;
    expectTypeOf<Props['inset']>().toEqualTypeOf<boolean | undefined>();
  });

  it('Label accepts the optional `inset` boolean', () => {
    type Props = React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>;
    expectTypeOf<Props['inset']>().toEqualTypeOf<boolean | undefined>();
  });

  it('CheckboxItem accepts a `checked` prop', () => {
    type Props = React.ComponentPropsWithoutRef<typeof DropdownMenuCheckboxItem>;
    expectTypeOf<Props>().toHaveProperty('checked');
  });

  it('RadioItem requires a `value` string prop', () => {
    type Props = React.ComponentPropsWithoutRef<typeof DropdownMenuRadioItem>;
    expectTypeOf<Props['value']>().toEqualTypeOf<string>();
  });
});

describe('DropdownMenuShortcut', () => {
  it('is a span-rendering helper with a fixed displayName', () => {
    expectTypeOf(DropdownMenuShortcut).toBeFunction();
    expect(DropdownMenuShortcut.displayName).toBe('DropdownMenuShortcut');
    const el = DropdownMenuShortcut({});
    expect(el.type).toBe('span');
  });

  it('merges base utilities with caller className', () => {
    const el = DropdownMenuShortcut({ className: 'opacity-50' });
    const cls = String(el.props.className);
    expect(cls).toContain('ml-auto');
    expect(cls).toContain('opacity-50');
  });
});
