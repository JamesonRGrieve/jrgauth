import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
};
export default meta;

type Story = StoryObj<typeof Sheet>;

function StoryShell({ side }: { side: 'top' | 'right' | 'bottom' | 'left' }) {
  return (
    <Sheet>
      <SheetTrigger>Open {side} sheet</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <p className='py-4 text-sm'>Profile form fields would render here.</p>
        <SheetFooter>
          <button type='button'>Save changes</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Right: Story = {
  render: () => <StoryShell side='right' />,
};

export const Left: Story = {
  render: () => <StoryShell side='left' />,
};

export const Top: Story = {
  render: () => <StoryShell side='top' />,
};

export const Bottom: Story = {
  render: () => <StoryShell side='bottom' />,
};

export const DefaultOpen: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mounted open</SheetTitle>
          <SheetDescription>This sheet renders open on mount, useful for visual snapshots.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
