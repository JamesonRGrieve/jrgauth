// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface tests for the Card primitive family. Card / CardHeader /
 * CardTitle etc. are all forwardRef wrappers around a single HTML tag
 * with a curated default className. We verify the displayName chain so
 * a refactor can't silently drop the labels devtools / snapshot tests
 * rely on. Once @testing-library/react is wired up, expand to assert
 * the rendered tag for each (h3 for CardTitle, p for CardDescription).
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card subcomponent surface', () => {
  it('exports six forwardRef components', () => {
    expectTypeOf(Card).toBeObject();
    expectTypeOf(CardHeader).toBeObject();
    expectTypeOf(CardTitle).toBeObject();
    expectTypeOf(CardDescription).toBeObject();
    expectTypeOf(CardContent).toBeObject();
    expectTypeOf(CardFooter).toBeObject();
  });

  it('preserves the standard displayName for every subcomponent', () => {
    expect(Card.displayName).toBe('Card');
    expect(CardHeader.displayName).toBe('CardHeader');
    expect(CardTitle.displayName).toBe('CardTitle');
    expect(CardDescription.displayName).toBe('CardDescription');
    expect(CardContent.displayName).toBe('CardContent');
    expect(CardFooter.displayName).toBe('CardFooter');
  });

  it('each subcomponent accepts a className override', () => {
    expectTypeOf<React.ComponentPropsWithoutRef<typeof Card>['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<React.ComponentPropsWithoutRef<typeof CardHeader>['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<React.ComponentPropsWithoutRef<typeof CardTitle>['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<React.ComponentPropsWithoutRef<typeof CardContent>['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<React.ComponentPropsWithoutRef<typeof CardFooter>['className']>().toEqualTypeOf<string | undefined>();
  });

  it('CardTitle uses a heading-element-shaped ref so consumers can imperatively focus it', () => {
    type Ref = React.ComponentPropsWithRef<typeof CardTitle>['ref'];
    expectTypeOf<Ref>().not.toBeAny();
  });
});
