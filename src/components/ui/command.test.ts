// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface tests for the Command (cmdk-based command palette) primitive
 * bundle. The interactive search / filter behaviour requires the cmdk
 * runtime + DOM env; here we lock the export list, the displayName
 * chain, and the CommandShortcut helper.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

describe('Command exports', () => {
  it('exposes a Command root + every cmdk subcomponent wrapper', () => {
    for (const cmp of [Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem]) {
      expectTypeOf(cmp).toBeObject();
      expect(cmp).toBeDefined();
    }
  });

  it('CommandDialog is a plain function component (re-uses Dialog under the hood)', () => {
    expectTypeOf(CommandDialog).toBeFunction();
  });
});

describe('CommandShortcut', () => {
  it('renders a span with default utility classes', () => {
    expectTypeOf(CommandShortcut).toBeFunction();
    expect(CommandShortcut.displayName).toBe('CommandShortcut');
    const el: React.ReactElement<{ className?: string }> = CommandShortcut({});
    expect(el.type).toBe('span');
    expect(String(el.props.className)).toContain('ml-auto');
    expect(String(el.props.className)).toContain('text-muted-foreground');
  });

  it('merges base utilities with caller-provided className', () => {
    const el: React.ReactElement<{ className?: string }> = CommandShortcut({ className: 'text-red-500' });
    const cls = String(el.props.className);
    expect(cls).toContain('text-red-500');
    expect(cls).toContain('ml-auto');
  });
});

describe('Command subcomponent prop surface', () => {
  it('CommandItem accepts a className override', () => {
    type Props = React.ComponentPropsWithoutRef<typeof CommandItem>;
    expectTypeOf<Props['className']>().toEqualTypeOf<string | undefined>();
  });

  it('CommandInput exposes the cmdk input prop surface', () => {
    type Props = React.ComponentPropsWithoutRef<typeof CommandInput>;
    expectTypeOf<Props>().toHaveProperty('value');
  });
});
