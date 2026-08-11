// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { className: 'h-4 w-32' },
};

export const Circle: Story = {
  args: { className: 'h-12 w-12 rounded-full' },
};

export const Card: Story = {
  render: () => (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='h-32 w-64 rounded-xl' />
      <Skeleton className='h-4 w-48' />
      <Skeleton className='h-4 w-32' />
    </div>
  ),
};
