import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataTableToolbar } from './data-table-toolbar';

interface Row {
  id: string;
  email: string;
  status: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
];

const ToolbarHarness = ({
  title,
  preFilter,
}: {
  title?: string;
  preFilter?: { columnId: string; value: string };
}): ReactNode => {
  const table = useReactTable({
    data: [{ id: '1', email: 'alice@example.com', status: 'active' }],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: title !== undefined && title !== '' ? { title } : undefined,
    initialState: preFilter ? { columnFilters: [{ id: preFilter.columnId, value: preFilter.value }] } : undefined,
  });
  return (
    <div style={{ padding: 16 }}>
      <DataTableToolbar table={table} />
    </div>
  );
};

const meta: Meta<typeof ToolbarHarness> = {
  title: 'Auth/Data/DataTableToolbar',
  component: ToolbarHarness,
  parameters: {
    docs: {
      description: {
        component:
          'DataTableToolbar renders the table title (when set via `table.options.meta.title`), a Reset button when any column filter is active, and the Filter / View Options dropdowns.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ToolbarHarness>;

export const Default: Story = {
  args: {},
};

export const WithTitle: Story = {
  args: { title: 'Team Members' },
};

export const FilterActive: Story = {
  args: { title: 'Team Members', preFilter: { columnId: 'status', value: 'active' } },
};
