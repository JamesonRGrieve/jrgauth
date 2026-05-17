import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
};
export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className='rounded-lg border shadow-md w-96'>
      <CommandInput placeholder='Type a command or search…' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Suggestions'>
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Settings'>
          <CommandItem>
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Empty: Story = {
  render: () => (
    <Command className='rounded-lg border shadow-md w-96'>
      <CommandInput placeholder='Search something that does not exist' value='zzzz' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
};

export const FlatList: Story = {
  render: () => (
    <Command className='rounded-lg border shadow-md w-96'>
      <CommandInput placeholder='Pick one' />
      <CommandList>
        <CommandItem>One</CommandItem>
        <CommandItem>Two</CommandItem>
        <CommandItem>Three</CommandItem>
        <CommandItem>Four</CommandItem>
      </CommandList>
    </Command>
  ),
};
