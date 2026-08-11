// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface tests for the Sidebar primitive family — a shadcn-style,
 * context-driven sidebar bundle (left/right sides, mobile sheet
 * fallback, resizable rail). The bundle is a mix of `forwardRef`
 * wrappers around native tags / Radix-ish primitives and inline
 * function components, all sharing a `useSidebar(side)` context.
 *
 * Without a DOM environment (no jsdom / happy-dom is wired in this repo
 * yet — see CLAUDE.md "Current State") we can't mount the provider and
 * click the trigger. What we pin here is the public export surface, the
 * stable `displayName` of every `forwardRef` wrapper (devtools /
 * snapshot stability), the `useSidebar` hook contract (it throws outside
 * a provider), and the documented prop contracts downstream layouts
 * rely on (side, variant, collapsible, isActive, controlled-open).
 *
 * Once @testing-library/react + a DOM env land (tracked in todo.json),
 * expand this to mount SidebarProvider and assert toggle behaviour.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

describe('Sidebar export surface', () => {
  it('exports every documented primitive', () => {
    const exported = [
      Sidebar,
      SidebarContent,
      SidebarFooter,
      SidebarGroup,
      SidebarGroupAction,
      SidebarGroupContent,
      SidebarGroupLabel,
      SidebarHeader,
      SidebarInput,
      SidebarInset,
      SidebarMenu,
      SidebarMenuAction,
      SidebarMenuBadge,
      SidebarMenuButton,
      SidebarMenuItem,
      SidebarMenuSkeleton,
      SidebarMenuSub,
      SidebarMenuSubButton,
      SidebarMenuSubItem,
      SidebarProvider,
      SidebarRail,
      SidebarSeparator,
      SidebarTrigger,
    ];
    for (const member of exported) {
      expect(member).toBeDefined();
    }
  });

  it('exposes useSidebar as a callable hook', () => {
    expectTypeOf(useSidebar).toBeFunction();
  });
});

describe('Sidebar forwardRef displayNames (devtools / snapshot stability)', () => {
  it('pins a stable displayName for every forwardRef wrapper', () => {
    const named: ReadonlyArray<readonly [{ displayName?: string }, string]> = [
      [SidebarProvider, 'SidebarProvider'],
      [Sidebar, 'Sidebar'],
      [SidebarTrigger, 'SidebarTrigger'],
      [SidebarRail, 'SidebarRail'],
      [SidebarInset, 'SidebarInset'],
      [SidebarInput, 'SidebarInput'],
      [SidebarHeader, 'SidebarHeader'],
      [SidebarFooter, 'SidebarFooter'],
      [SidebarSeparator, 'SidebarSeparator'],
      [SidebarContent, 'SidebarContent'],
      [SidebarGroup, 'SidebarGroup'],
      [SidebarGroupLabel, 'SidebarGroupLabel'],
      [SidebarGroupAction, 'SidebarGroupAction'],
      [SidebarGroupContent, 'SidebarGroupContent'],
      [SidebarMenu, 'SidebarMenu'],
      [SidebarMenuItem, 'SidebarMenuItem'],
      [SidebarMenuButton, 'SidebarMenuButton'],
      [SidebarMenuAction, 'SidebarMenuAction'],
      [SidebarMenuBadge, 'SidebarMenuBadge'],
      [SidebarMenuSkeleton, 'SidebarMenuSkeleton'],
      [SidebarMenuSub, 'SidebarMenuSub'],
      [SidebarMenuSubItem, 'SidebarMenuSubItem'],
      [SidebarMenuSubButton, 'SidebarMenuSubButton'],
    ];
    for (const [component, name] of named) {
      expect(component.displayName).toBe(name);
    }
  });
});

describe('useSidebar contract', () => {
  // Note: useSidebar reads React context, so its outside-provider guard
  // (`throw new Error('useSidebar must be used with a SidebarProvider…')`)
  // can only fire inside a render. This repo has no DOM / renderer wired
  // yet (see CLAUDE.md "Current State"), so we pin the hook's call/return
  // contract at the type level here; once @testing-library/react lands,
  // add a render-based assertion that the guard throws.
  it('accepts an optional side argument defaulting to a sidebar side', () => {
    expectTypeOf(useSidebar).parameter(0).toEqualTypeOf<'left' | 'right' | undefined>();
  });

  it('returns a context value exposing the open/collapsed contract', () => {
    type SidebarContextValue = ReturnType<typeof useSidebar>;
    expectTypeOf<SidebarContextValue['state']>().toEqualTypeOf<'expanded' | 'collapsed'>();
    expectTypeOf<SidebarContextValue['open']>().toEqualTypeOf<boolean>();
    expectTypeOf<SidebarContextValue['isMobile']>().toEqualTypeOf<boolean>();
    expectTypeOf<SidebarContextValue['width']>().toEqualTypeOf<number>();
    expectTypeOf<SidebarContextValue['toggleSidebar']>().toEqualTypeOf<() => void>();
    expectTypeOf<SidebarContextValue['setOpen']>().toEqualTypeOf<(open: boolean) => void>();
    expectTypeOf<SidebarContextValue['setWidth']>().toEqualTypeOf<(width: number) => void>();
  });
});

describe('SidebarProvider prop contract', () => {
  type ProviderProps = React.ComponentPropsWithoutRef<typeof SidebarProvider>;

  it('accepts independent default-open flags for each side', () => {
    expectTypeOf<ProviderProps['defaultLeftOpen']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<ProviderProps['defaultRightOpen']>().toEqualTypeOf<boolean | undefined>();
  });

  it('accepts per-side controlled open-change callbacks', () => {
    expectTypeOf<ProviderProps['onLeftOpenChange']>().toEqualTypeOf<((open: boolean) => void) | undefined>();
    expectTypeOf<ProviderProps['onRightOpenChange']>().toEqualTypeOf<((open: boolean) => void) | undefined>();
  });

  it('passes through native div attributes (className / children)', () => {
    expectTypeOf<ProviderProps['className']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<ProviderProps>().toHaveProperty('children');
  });
});

describe('Sidebar prop contract', () => {
  type SidebarProps = React.ComponentPropsWithoutRef<typeof Sidebar>;

  it('admits the side / variant / collapsible enums', () => {
    expectTypeOf<SidebarProps['side']>().toEqualTypeOf<'left' | 'right' | undefined>();
    expectTypeOf<SidebarProps['variant']>().toEqualTypeOf<'sidebar' | 'floating' | 'inset' | undefined>();
    expectTypeOf<SidebarProps['collapsible']>().toEqualTypeOf<'offcanvas' | 'icon' | 'none' | undefined>();
  });
});

describe('SidebarMenuButton prop contract', () => {
  type MenuButtonProps = React.ComponentPropsWithoutRef<typeof SidebarMenuButton>;

  it('exposes the active-state and asChild composition flags', () => {
    expectTypeOf<MenuButtonProps['isActive']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<MenuButtonProps['asChild']>().toEqualTypeOf<boolean | undefined>();
  });

  it('accepts the size / variant style discriminators', () => {
    expectTypeOf<MenuButtonProps['size']>().not.toBeAny();
    expectTypeOf<MenuButtonProps['variant']>().not.toBeAny();
  });

  it('targets the per-side context via an optional side prop', () => {
    expectTypeOf<MenuButtonProps['side']>().toEqualTypeOf<'left' | 'right' | undefined>();
  });
});

describe('SidebarMenuSkeleton prop contract', () => {
  type SkeletonProps = React.ComponentPropsWithoutRef<typeof SidebarMenuSkeleton>;

  it('toggles the leading icon placeholder via showIcon', () => {
    expectTypeOf<SkeletonProps['showIcon']>().toEqualTypeOf<boolean | undefined>();
  });
});

describe('SidebarRail prop contract', () => {
  type RailProps = React.ComponentPropsWithoutRef<typeof SidebarRail>;

  it('exposes the resize min/max width bounds', () => {
    expectTypeOf<RailProps['minWidth']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<RailProps['maxWidth']>().toEqualTypeOf<number | undefined>();
  });
});
