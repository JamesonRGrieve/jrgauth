// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import ErrorPage from './ErrorPage';

const meta: Meta<typeof ErrorPage> = {
  title: 'Auth/ErrorPage',
  component: ErrorPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {
  args: {},
};

export const CustomRedirect: Story = {
  args: { redirectTo: '/auth/login' },
};

export const RootRedirect: Story = {
  args: { redirectTo: '/' },
};
