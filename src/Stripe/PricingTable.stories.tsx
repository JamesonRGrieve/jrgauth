import type { Meta, StoryObj } from '@storybook/react';
import PricingTable from './PricingTable';

const meta: Meta<typeof PricingTable> = {
  title: 'Auth/Stripe/PricingTable',
  component: PricingTable,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof PricingTable>;

// PricingTable pulls plan data via useProducts() (SWR + axios). Without
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY set the hook returns an empty
// array, so the default story renders the empty-grid layout.

export const Default: Story = {};

export const InNarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const InCenteredContainer: Story = {
  render: () => (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <PricingTable />
    </div>
  ),
};
