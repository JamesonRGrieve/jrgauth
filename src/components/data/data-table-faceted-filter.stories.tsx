import type { Meta, StoryObj } from '@storybook/react';
import { Check, CircleDashed, Clock, X } from 'lucide-react';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

const meta: Meta<typeof DataTableFacetedFilter> = {
  title: 'Auth/Data/DataTableFacetedFilter',
  component: DataTableFacetedFilter,
  parameters: {
    docs: {
      description: {
        component:
          'DataTableFacetedFilter renders a popover with a checkbox list of pre-defined options. When a `column` is provided, selected values are pushed back into the column filter; without one (these stories), the component is purely presentational.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTableFacetedFilter>;

const statusOptions = [
  { label: 'Active', value: 'active', icon: Check },
  { label: 'Pending', value: 'pending', icon: Clock },
  { label: 'Suspended', value: 'suspended', icon: X },
  { label: 'Inactive', value: 'inactive', icon: CircleDashed },
];

export const Default: Story = {
  args: { title: 'Status', options: statusOptions },
};

export const NoTitle: Story = {
  args: { options: statusOptions },
};

export const ManyOptions: Story = {
  args: {
    title: 'Tags',
    options: Array.from({ length: 12 }, (_, i) => ({ label: `Tag ${i + 1}`, value: `tag-${i + 1}` })),
  },
};

export const Empty: Story = {
  args: { title: 'No Options', options: [] },
};
