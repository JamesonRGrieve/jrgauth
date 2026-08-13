// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import providers from './OAuthProviders';

type ProviderEntry = {
  name: string;
  scope: string;
  uri: string;
  icon: React.ReactNode;
};

const entries: ProviderEntry[] = Object.entries(providers).map(([name, p]) => ({
  name,
  scope: p.scope,
  uri: p.uri,
  icon: p.icon,
}));

function ProvidersCatalog({ filter, limit }: { filter?: string; limit?: number }) {
  let list = entries;
  if (filter !== undefined && filter !== '') {
    const q = filter.toLowerCase();
    list = list.filter((e) => e.name.toLowerCase().includes(q));
  }
  if (typeof limit === 'number') {
    list = list.slice(0, limit);
  }
  return (
    <ul
      className='grid gap-2'
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', listStyle: 'none', padding: 0 }}
    >
      {list.map((e) => (
        <li key={e.name} className='flex items-center gap-2 rounded-md border p-2 text-sm' style={{ minWidth: 0 }}>
          <span aria-hidden style={{ display: 'inline-flex', width: 18, height: 18 }}>
            {e.icon}
          </span>
          <span className='truncate font-medium'>{e.name}</span>
        </li>
      ))}
    </ul>
  );
}

const meta: Meta<typeof ProvidersCatalog> = {
  title: 'Auth/OAuth/Providers',
  component: ProvidersCatalog,
};
export default meta;

type Story = StoryObj<typeof ProvidersCatalog>;

export const All: Story = {
  args: {},
};

export const TopTwelve: Story = {
  // Quick visual lockdown that the first dozen providers still resolve
  // their icon imports — a stale react-icons rename will break this.
  args: { limit: 12 },
};

export const FilteredByGoogle: Story = {
  args: { filter: 'oo' },
};

export const Empty: Story = {
  args: { filter: 'no-such-provider-zzz' },
};
