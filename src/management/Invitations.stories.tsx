// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { InvitationsTable } from './Invitations';

const meta: Meta<typeof InvitationsTable> = {
  title: 'Auth/Management/InvitationsTable',
  component: InvitationsTable,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof InvitationsTable>;

// InvitationsTable is an SWR-backed table over the user's pending team
// invitations. The stories pin the prop matrix; live invitation data
// requires a backing /v1/user/{id}/invitation endpoint.

export const Default: Story = {
  args: {},
};

export const ForKnownUser: Story = {
  args: { userId: '11111111-2222-3333-4444-555555555555' },
};
