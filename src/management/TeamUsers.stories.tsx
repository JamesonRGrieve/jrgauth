import type { Meta, StoryObj } from '@storybook/react';
import { Team as TeamUsers } from './TeamUsers';

const meta: Meta<typeof TeamUsers> = {
  title: 'Auth/Management/TeamUsers',
  component: TeamUsers,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof TeamUsers>;

// TeamUsers renders the team-members data table. The component pulls
// useTeam() / useInvitations() from SWR; without a backing API the
// empty state is shown.

export const Default: Story = {
  args: {},
};
