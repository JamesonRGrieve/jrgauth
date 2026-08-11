// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataTableViewOptions } from './data-table-view-options';

interface Row {
  id: string;
  email: string;
  status: string;
  role: string;
  department: string;
}

const columnsAll: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'department', header: 'Department' },
];

const ViewOptionsHarness = ({
  columns,
  hidden = {},
}: {
  columns: ColumnDef<Row>[];
  hidden?: Record<string, boolean>;
}): ReactNode => {
  const table = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: { columnVisibility: Object.fromEntries(Object.entries(hidden).map(([k, v]) => [k, !v])) },
  });
  return (
    <div style={{ padding: 16 }}>
      <DataTableViewOptions table={table} />
    </div>
  );
};

const meta: Meta<typeof ViewOptionsHarness> = {
  title: 'Auth/Data/DataTableViewOptions',
  component: ViewOptionsHarness,
  parameters: {
    docs: {
      description: {
        component:
          'DataTableViewOptions renders a dropdown that lets the user toggle visibility of each hideable column. Columns that explicitly opt out of hiding (`enableHiding: false`) are excluded.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ViewOptionsHarness>;

export const Default: Story = {
  args: { columns: columnsAll },
};

export const FewColumns: Story = {
  args: { columns: columnsAll.slice(0, 2) },
};

export const SomePreHidden: Story = {
  args: { columns: columnsAll, hidden: { department: true } },
};
