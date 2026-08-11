// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { type Item, items } from './NavMenu';

// NavMenu exports a static data structure, not a renderable component.
// To satisfy the story symmetry contract we colocate a tiny preview that
// renders the tree so designers / reviewers can eyeball the data.
const NavMenuPreview = ({ tree }: { tree: Item[] }): ReactNode => {
  return (
    <nav style={{ fontFamily: 'system-ui', padding: 16 }}>
      {tree.map((group) => {
        const GroupIcon = group.icon;
        return (
          <details key={group.title} open style={{ marginBottom: 8 }}>
            <summary style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {GroupIcon ? <GroupIcon size={16} /> : null}
              <strong>{group.title}</strong>
            </summary>
            <ul style={{ marginTop: 4, paddingLeft: 24 }}>
              {group.items?.map((leaf) => {
                const LeafIcon = leaf.icon;
                return (
                  <li key={`${leaf.title}-${leaf.url}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {LeafIcon ? <LeafIcon size={14} /> : null}
                    <a href={leaf.url}>{leaf.title}</a>
                    {leaf.queryParams ? (
                      <code style={{ fontSize: 11, color: '#666' }}>
                        ?{new URLSearchParams(leaf.queryParams as Record<string, string>).toString()}
                      </code>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </details>
        );
      })}
    </nav>
  );
};

const meta: Meta<typeof NavMenuPreview> = {
  title: 'Auth/NavMenu',
  component: NavMenuPreview,
  parameters: {
    docs: {
      description: {
        component:
          'NavMenu exports the static `items` array consumed by the auth submodule sidebar. This story renders the tree exactly as configured.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof NavMenuPreview>;

export const Default: Story = {
  args: { tree: items },
};

export const SingleGroup: Story = {
  args: { tree: items.slice(0, 1) },
};

export const Empty: Story = {
  args: { tree: [] },
};
