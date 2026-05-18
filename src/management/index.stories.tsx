import type { Meta, StoryObj } from '@storybook/react';
import Manage from './index';

const meta: Meta<typeof Manage> = {
  title: 'Auth/Management/Manage',
  component: Manage,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Manage>;

// Manage is the management sub-router. It owns the active page tab
// state and delegates to Profile / Team / ConnectedServices /
// Account. Endpoint props let downstream apps redirect the SWR keys.

export const Default: Story = {
  args: {},
};

export const CustomEndpoints: Story = {
  args: {
    userDataSWRKey: '/v2/user',
    userDataEndpoint: '/v2/user',
    userUpdateEndpoint: '/v2/user',
    userPasswordChangeEndpoint: '/v2/user/password',
  },
};
