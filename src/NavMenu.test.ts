// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * NavMenu exports a static `items` array describing the auth-submodule's
 * navigation tree. The tests pin the shape of the data so a future edit
 * cannot silently drop a top-level group or break the `Item` type.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { type Item, items } from './NavMenu';

describe('NavMenu items', () => {
  it('exports a non-empty array of top-level groups', () => {
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('every top-level group has a title and an icon', () => {
    for (const group of items) {
      expect(typeof group.title).toBe('string');
      expect(group.title.length).toBeGreaterThan(0);
      expect(group.icon).toBeTypeOf('object');
    }
  });

  it('every leaf entry under a group has a non-empty title and url', () => {
    for (const group of items) {
      if (!group.items) {
        continue;
      }
      for (const leaf of group.items) {
        expect(leaf.title.length).toBeGreaterThan(0);
        expect(leaf.url.length).toBeGreaterThan(0);
        expect(leaf.url.startsWith('/')).toBe(true);
      }
    }
  });

  it('contains the canonical Team Management group', () => {
    const team = items.find((group) => group.title === 'Team Management');
    expect(team).toBeDefined();
    expect(team?.items?.some((leaf) => leaf.url === '/team')).toBe(true);
  });

  it('Item type is exported and shape-accurate', () => {
    expectTypeOf<Item>().toExtend<{ title: string; items?: { title: string; url: string }[] }>();
  });

  it('leaf urls under a single group are unique', () => {
    for (const group of items) {
      if (!group.items) {
        continue;
      }
      // Different titles may share a url with different queryParams — dedupe by
      // url+queryParams to catch true duplicates without false positives.
      const seen = new Set<string>();
      for (const leaf of group.items) {
        const key = `${leaf.url}::${JSON.stringify(leaf.queryParams ?? {})}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });
});
