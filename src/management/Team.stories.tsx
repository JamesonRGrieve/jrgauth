import type { Meta, StoryObj } from '@storybook/react';
import { Team } from './Team';

const meta: Meta<typeof Team> = {
  title: 'Auth/Management/Team',
  component: Team,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Team>;

// Team renders the team-switcher sidebar. It pulls teams from useTeams()
// and renders the create/rename dialogs internally. Without a backing
// /teams response only the empty / placeholder state is visible.

export const Default: Story = {
  args: {},
};
