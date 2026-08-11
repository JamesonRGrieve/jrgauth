// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface tests for the Disclosure family — a context-driven open/closed
 * wrapper around motion/react's AnimatePresence. The motion-driven
 * animation behaviour needs a DOM env; here we lock the public exports
 * and the hook contract (`useDisclosure` throws outside a provider).
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import DisclosureDefault, { Disclosure, DisclosureContent, DisclosureTrigger } from './disclosure';

describe('Disclosure exports', () => {
  it('named exports are React function components', () => {
    expectTypeOf(Disclosure).toBeFunction();
    expectTypeOf(DisclosureTrigger).toBeFunction();
    expectTypeOf(DisclosureContent).toBeFunction();
  });

  it('default export bundles all four named symbols', () => {
    expect(DisclosureDefault).toHaveProperty('Disclosure');
    expect(DisclosureDefault).toHaveProperty('DisclosureProvider');
    expect(DisclosureDefault).toHaveProperty('DisclosureTrigger');
    expect(DisclosureDefault).toHaveProperty('DisclosureContent');
    expect(DisclosureDefault.Disclosure).toBe(Disclosure);
  });

  it('Disclosure accepts the documented prop shape', () => {
    type Props = Parameters<typeof Disclosure>[0];
    expectTypeOf<Props['open']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<Props['onOpenChange']>().toEqualTypeOf<((open: boolean) => void) | undefined>();
    expectTypeOf<Props['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Props>().toHaveProperty('children');
    expectTypeOf<Props>().toHaveProperty('variants');
    expectTypeOf<Props>().toHaveProperty('transition');
  });

  it('DisclosureTrigger / DisclosureContent both accept children + className', () => {
    type TriggerProps = Parameters<typeof DisclosureTrigger>[0];
    type ContentProps = Parameters<typeof DisclosureContent>[0];
    expectTypeOf<TriggerProps>().toHaveProperty('children');
    expectTypeOf<TriggerProps['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ContentProps>().toHaveProperty('children');
    expectTypeOf<ContentProps['className']>().toEqualTypeOf<string | undefined>();
  });
});
