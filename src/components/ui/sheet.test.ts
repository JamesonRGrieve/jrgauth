/**
 * Surface tests for the Sheet (side-drawer dialog) primitive bundle.
 * Sheet wraps Radix Dialog with a class-variance-authority `side`
 * variant. Behaviour-level coverage of side animations needs a DOM
 * env; here we lock the exported surface and the SheetContent side
 * variant prop.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from './sheet';

describe('Sheet exports', () => {
  it('re-exports the Radix Dialog primitives under Sheet* names', () => {
    expect(Sheet).toBeDefined();
    expect(SheetTrigger).toBeDefined();
    expect(SheetClose).toBeDefined();
    expect(SheetPortal).toBeDefined();
  });

  it('exposes forwardRef wrappers for Content / Overlay / Title / Description', () => {
    expectTypeOf(SheetContent).toBeObject();
    expectTypeOf(SheetOverlay).toBeObject();
    expectTypeOf(SheetTitle).toBeObject();
    expectTypeOf(SheetDescription).toBeObject();
  });

  it('Header / Footer are inline function components with stable displayNames', () => {
    expectTypeOf(SheetHeader).toBeFunction();
    expectTypeOf(SheetFooter).toBeFunction();
    expect(SheetHeader.displayName).toBe('SheetHeader');
    expect(SheetFooter.displayName).toBe('SheetFooter');
  });

  it('SheetContent accepts a side variant of top | right | bottom | left | null | undefined', () => {
    type ContentProps = React.ComponentPropsWithoutRef<typeof SheetContent>;
    expectTypeOf<ContentProps['side']>().toMatchTypeOf<'top' | 'right' | 'bottom' | 'left' | null | undefined>();
  });

  it('SheetHeader merges base layout utilities with caller className', () => {
    const el = SheetHeader({ className: 'gap-8' });
    const cls = String(el.props.className);
    expect(el.type).toBe('div');
    expect(cls).toContain('flex');
    expect(cls).toContain('gap-8');
  });
});
