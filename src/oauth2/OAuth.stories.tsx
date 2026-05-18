import type { Meta, StoryObj } from '@storybook/react';
import OAuth from './OAuth';

const meta: Meta<typeof OAuth> = {
  title: 'Auth/OAuth/OAuth',
  component: OAuth,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          'OAuth renders a button per configured provider (provider.client_id !== undefined). Without env vars set, none of the built-in providers are active — this story exists primarily to lock the prop surface and exercise overrides.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof OAuth>;

export const Default: Story = {
  args: {},
};

export const WithGoogleOverride: Story = {
  args: {
    overrides: {
      Google: { client_id: 'storybook-google-client-id' },
    },
  },
};

export const WithMultipleOverrides: Story = {
  args: {
    overrides: {
      GitHub: { client_id: 'storybook-github-client-id' },
      Microsoft: { client_id: 'storybook-microsoft-client-id' },
      Apple: { client_id: 'storybook-apple-client-id' },
    },
  },
};

export const CustomScopeOverride: Story = {
  args: {
    overrides: {
      Google: { client_id: 'storybook-google-client-id', scope: 'profile email openid' },
    },
  },
};
