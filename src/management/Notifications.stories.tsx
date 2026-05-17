import type { Meta, StoryObj } from '@storybook/react';
import { Notifications } from './Notifications';

const meta: Meta<typeof Notifications> = {
  title: 'Auth/Management/Notifications',
  component: Notifications,
};
export default meta;

type Story = StoryObj<typeof Notifications>;

export const Default: Story = {};

export const InNarrowContainer: Story = {
  // The component is purely presentational (heading + separator), so the
  // most useful variant is verifying it gracefully scales inside a
  // narrow management-pane column.
  render: () => (
    <div style={{ maxWidth: 280, padding: 16, border: '1px dashed var(--border)' }}>
      <Notifications />
    </div>
  ),
};

export const StackedWithSibling: Story = {
  // Verifies the trailing <Separator className='my-4' /> visually
  // separates this pane from a downstream sibling section.
  render: () => (
    <>
      <Notifications />
      <p className='text-sm'>Sibling section renders below the notifications pane.</p>
    </>
  ),
};
