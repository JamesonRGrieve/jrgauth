import type { Meta, StoryObj } from '@storybook/react';
import OrganizationalUnit from './OU';

// OU is a `'use client'` SWR component that returns `null`. The story
// exists to satisfy the symmetry contract and to document the prop surface
// so a future expansion (rendering a real OU panel) has a hook to attach to.
const meta: Meta<typeof OrganizationalUnit> = {
  title: 'Auth/OrganizationalUnit',
  component: OrganizationalUnit,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          'OrganizationalUnit fetches `/ou/:slug` via SWR and currently renders nothing. The component exists as an integration seam for downstream apps to extend.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof OrganizationalUnit>;

export const Default: Story = {
  args: { searchParams: {} },
};

export const WithSlug: Story = {
  args: { searchParams: { ou: 'acme-corp' } },
};

export const CustomEndpoint: Story = {
  args: { searchParams: { ou: 'acme-corp' }, organizationalUnitEndpoint: '/organizational-units' },
};
