import type { Meta, StoryObj } from '@storybook/react';
import Logout from './Logout';

const meta: Meta<typeof Logout> = {
  title: 'Auth/Logout',
  component: Logout,
  parameters: {
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof Logout>;

export const Default: Story = {
  args: {},
};

export const CustomRedirect: Story = {
  args: { redirectTo: '/auth/login' },
};

export const Home: Story = {
  args: { redirectTo: '/' },
};
