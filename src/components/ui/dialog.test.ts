/**
 * Surface tests for the Dialog primitive bundle. The Radix dialog uses
 * a portal, which we can't fully exercise without a DOM env (tracked
 * in todo.json). Here we pin every named export so a refactor can't
 * silently drop a subcomponent.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';

describe('Dialog exports', () => {
  it('re-exports Radix Root / Trigger / Portal / Close', () => {
    expect(Dialog).toBeDefined();
    expect(DialogTrigger).toBeDefined();
    expect(DialogPortal).toBeDefined();
    expect(DialogClose).toBeDefined();
  });

  it('exposes the forwardRef wrappers as object-shaped components', () => {
    expectTypeOf(DialogContent).toBeObject();
    expectTypeOf(DialogOverlay).toBeObject();
    expectTypeOf(DialogTitle).toBeObject();
    expectTypeOf(DialogDescription).toBeObject();
  });

  it('DialogHeader and DialogFooter are layout function components with stable displayNames', () => {
    expectTypeOf(DialogHeader).toBeFunction();
    expectTypeOf(DialogFooter).toBeFunction();
    expect(DialogHeader.displayName).toBe('DialogHeader');
    expect(DialogFooter.displayName).toBe('DialogFooter');
  });

  it('the Radix-wrapped subcomponents keep a non-empty displayName for devtools', () => {
    expect(typeof DialogContent.displayName).toBe('string');
    expect(typeof DialogOverlay.displayName).toBe('string');
    expect(typeof DialogTitle.displayName).toBe('string');
    expect(typeof DialogDescription.displayName).toBe('string');
    expect(String(DialogContent.displayName).length).toBeGreaterThan(0);
  });

  it('DialogTitle / DialogDescription accept className overrides', () => {
    type TitleProps = React.ComponentPropsWithoutRef<typeof DialogTitle>;
    type DescProps = React.ComponentPropsWithoutRef<typeof DialogDescription>;
    expectTypeOf<TitleProps['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<DescProps['className']>().toEqualTypeOf<string | undefined>();
  });

  it('DialogHeader renders a div element', () => {
    const el = DialogHeader({});
    expect(el.type).toBe('div');
  });

  it('DialogFooter renders a div element', () => {
    const el = DialogFooter({});
    expect(el.type).toBe('div');
  });

  it('DialogHeader merges base layout utilities with caller className', () => {
    const el = DialogHeader({ className: 'mt-4' });
    const cls = String(el.props.className);
    expect(cls).toContain('flex');
    expect(cls).toContain('mt-4');
  });
});
