// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { DataTableColumnHeader } from './data-table-column-header';

interface Row {
  id: string;
  email: string;
}

const buildColumn = ({ enableSorting = true }: { enableSorting?: boolean } = {}): ColumnDef<Row>[] => [
  { accessorKey: 'email', header: 'Email', enableSorting },
];

const HeaderHarness = ({
  title,
  enableSorting = true,
  initialSort,
}: {
  title: string;
  enableSorting?: boolean;
  initialSort?: 'asc' | 'desc';
}): ReactNode => {
  const table = useReactTable({
    data: [
      { id: '1', email: 'alice@example.com' },
      { id: '2', email: 'bob@example.com' },
    ],
    columns: buildColumn({ enableSorting }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: initialSort ? { sorting: [{ id: 'email', desc: initialSort === 'desc' }] } : undefined,
  });
  const column = table.getColumn('email');
  if (!column) {
    return <div>missing column</div>;
  }
  return (
    <div style={{ padding: 16 }}>
      <DataTableColumnHeader column={column} title={title} />
    </div>
  );
};

const meta: Meta<typeof HeaderHarness> = {
  title: 'Auth/Data/DataTableColumnHeader',
  component: HeaderHarness,
  parameters: {
    docs: {
      description: {
        component:
          'DataTableColumnHeader renders a title alongside a sort dropdown for sortable columns. When the column is not sortable it falls back to a plain `<div>` containing the title.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof HeaderHarness>;

export const Sortable: Story = {
  args: { title: 'Email', enableSorting: true },
};

export const InitiallyAscending: Story = {
  args: { title: 'Email', enableSorting: true, initialSort: 'asc' },
};

export const InitiallyDescending: Story = {
  args: { title: 'Email', enableSorting: true, initialSort: 'desc' },
};

export const NotSortable: Story = {
  args: { title: 'Email', enableSorting: false },
};
