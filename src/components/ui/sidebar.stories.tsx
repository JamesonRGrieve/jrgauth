// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

function DemoSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className='px-2 py-1 font-semibold'>My App</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className='px-2 py-1 text-xs text-muted-foreground'>v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <DemoSidebar />
      <SidebarInset>
        <header className='flex h-10 items-center border-b px-2'>
          <SidebarTrigger />
          <span className='ml-2 text-sm'>Page content</span>
        </header>
        <main className='p-4 text-sm'>Body goes here.</main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultLeftOpen={false} defaultRightOpen={false}>
      <DemoSidebar />
      <SidebarInset>
        <header className='flex h-10 items-center border-b px-2'>
          <SidebarTrigger />
          <span className='ml-2 text-sm'>Collapsed by default</span>
        </header>
      </SidebarInset>
    </SidebarProvider>
  ),
};

export const RightSide: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarInset>
        <header className='flex h-10 items-center border-b px-2'>
          <span className='text-sm'>Sidebar on the right</span>
          <div className='ml-auto'>
            <SidebarTrigger />
          </div>
        </header>
      </SidebarInset>
      <Sidebar side='right'>
        <SidebarHeader>Right side</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Item one</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
};
