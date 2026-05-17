import type { Meta, StoryObj } from '@storybook/react';
import Close from './Close';

const meta: Meta<typeof Close> = {
  title: 'Auth/OAuth/Close',
  component: Close,
  parameters: {
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof Close>;

export const Default: Story = {};
