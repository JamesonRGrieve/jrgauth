import type { Meta, StoryObj } from '@storybook/react';
import { ConnectedServices } from './ConnectedServices';

const meta: Meta<typeof ConnectedServices> = {
  title: 'Auth/Management/ConnectedServices',
  component: ConnectedServices,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ConnectedServices>;

// ConnectedServices reads OAuth2 provider config + the user's connections
// from the API. The story relies on the in-process providers map and
// shows the empty state without a backing /v1/user/connections payload.

export const Default: Story = {
  args: {},
};
