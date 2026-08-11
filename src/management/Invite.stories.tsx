// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { InviteDialog } from './Invite';

const meta: Meta<typeof InviteDialog> = {
  title: 'Auth/Management/InviteDialog',
  component: InviteDialog,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof InviteDialog>;

// InviteDialog is the team-invite sidebar entry. Stories pin the
// selected-team prop matrix; the live API send is out of scope.

export const NoTeamSelected: Story = {
  args: { selectedTeam: null },
};

export const TeamSelected: Story = {
  args: {
    selectedTeam: { id: '11111111-2222-3333-4444-555555555555', name: 'Acme Engineering' },
  },
};

export const TeamWithoutName: Story = {
  args: {
    selectedTeam: { id: '99999999-0000-0000-0000-000000000000' },
  },
};
