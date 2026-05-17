/**
 * Type / surface-level lockdown for the Avatar primitive trio.
 *
 * Avatar is a Radix re-export with className composition, so without a
 * DOM environment we cannot exercise image-loading fallback behaviour.
 * We can still pin the exported surface, the displayName values used by
 * devtools, and the props each subcomponent accepts.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

describe('Avatar exports', () => {
  it('exposes Avatar, AvatarImage, AvatarFallback as React forwardRef components', () => {
    expectTypeOf(Avatar).toBeObject();
    expectTypeOf(AvatarImage).toBeObject();
    expectTypeOf(AvatarFallback).toBeObject();
  });

  it('preserves Radix-derived displayName values so devtools show meaningful labels', () => {
    expect(typeof Avatar.displayName).toBe('string');
    expect(typeof AvatarImage.displayName).toBe('string');
    expect(typeof AvatarFallback.displayName).toBe('string');
    expect(String(Avatar.displayName).length).toBeGreaterThan(0);
  });

  it('AvatarImage accepts an alt prop (a11y guarantee)', () => {
    type ImageProps = React.ComponentPropsWithoutRef<typeof AvatarImage>;
    expectTypeOf<ImageProps['alt']>().toEqualTypeOf<string | undefined>();
  });

  it('AvatarFallback accepts a children prop', () => {
    type FallbackProps = React.ComponentPropsWithoutRef<typeof AvatarFallback>;
    expectTypeOf<FallbackProps>().toHaveProperty('children');
  });

  it('Avatar accepts a className override', () => {
    type AvatarProps = React.ComponentPropsWithoutRef<typeof Avatar>;
    expectTypeOf<AvatarProps['className']>().toEqualTypeOf<string | undefined>();
  });
});
