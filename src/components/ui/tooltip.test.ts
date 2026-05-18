/**
 * Surface tests for the Tooltip primitive bundle. Five exports:
 *   - Tooltip wraps Radix Root with a 600ms default delayDuration
 *   - TooltipBasic synthesises the trigger/content sandwich from a
 *     single `title` prop (most-used downstream entry point)
 *   - TooltipContent / TooltipTrigger / TooltipProvider mirror Radix
 *
 * Behaviour-level coverage (hover-to-show, sideOffset visual offset)
 * needs a DOM + portal renderer; this file pins the public surface so
 * a refactor can't silently drop the wrapper.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Tooltip, TooltipBasic, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

describe('Tooltip surface', () => {
  it('exports five public symbols', () => {
    expectTypeOf(Tooltip).toBeFunction();
    expectTypeOf(TooltipProvider).toBeFunction();
    expectTypeOf(TooltipBasic).toBeFunction();
    expectTypeOf(TooltipContent).toBeObject();
    expect(TooltipTrigger).toBeDefined();
  });

  it('TooltipBasic accepts the four canonical side values', () => {
    type BasicProps = Parameters<typeof TooltipBasic>[0];
    expectTypeOf<BasicProps['side']>().toEqualTypeOf<'top' | 'right' | 'bottom' | 'left' | undefined>();
  });

  it('TooltipBasic requires a `title` string and accepts children', () => {
    type BasicProps = Parameters<typeof TooltipBasic>[0];
    expectTypeOf<BasicProps['title']>().toEqualTypeOf<string>();
    expectTypeOf<BasicProps>().toHaveProperty('children');
  });

  it('TooltipBasic carries a stable displayName for devtools', () => {
    expect(TooltipBasic.displayName).toBe('TooltipBasic');
  });

  it('Tooltip applies a 600ms default delayDuration when none is provided', () => {
    const el: React.ReactElement<{ delayDuration?: number }> = Tooltip({});
    expect(el.props.delayDuration).toBe(600);
  });

  it('Tooltip honours an explicit delayDuration override', () => {
    const el: React.ReactElement<{ delayDuration?: number }> = Tooltip({ delayDuration: 100 });
    expect(el.props.delayDuration).toBe(100);
  });

  it('TooltipProvider wraps its children in Radix Provider', () => {
    const el: React.ReactElement<{ children?: React.ReactNode }> = TooltipProvider({ children: 'hi' });
    expect(el.props.children).toBe('hi');
  });
});
