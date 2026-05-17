import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipBasic, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='px-3 py-1 border rounded'>Hover me</TooltipTrigger>
        <TooltipContent>Tooltip body</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Basic: Story = {
  render: () => (
    <TooltipProvider>
      <TooltipBasic title='Quick hint'>
        <button className='px-3 py-1 border rounded'>Trigger</button>
      </TooltipBasic>
    </TooltipProvider>
  ),
};

export const Sides: Story = {
  render: () => (
    <TooltipProvider>
      <div className='flex gap-4'>
        <TooltipBasic title='Top' side='top'>
          <button className='px-3 py-1 border rounded'>Top</button>
        </TooltipBasic>
        <TooltipBasic title='Bottom' side='bottom'>
          <button className='px-3 py-1 border rounded'>Bottom</button>
        </TooltipBasic>
        <TooltipBasic title='Left' side='left'>
          <button className='px-3 py-1 border rounded'>Left</button>
        </TooltipBasic>
        <TooltipBasic title='Right' side='right'>
          <button className='px-3 py-1 border rounded'>Right</button>
        </TooltipBasic>
      </div>
    </TooltipProvider>
  ),
};
