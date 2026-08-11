// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './data-table';

interface Row {
  id: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  role: string;
}

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'role', header: 'Role' },
];

const sampleRows: Row[] = [
  { id: '1', email: 'alice@example.com', status: 'active', role: 'Owner' },
  { id: '2', email: 'bob@example.com', status: 'pending', role: 'Member' },
  { id: '3', email: 'carol@example.com', status: 'suspended', role: 'Member' },
  { id: '4', email: 'dave@example.com', status: 'active', role: 'Admin' },
  { id: '5', email: 'eve@example.com', status: 'active', role: 'Member' },
];

const meta: Meta<typeof DataTable<Row, unknown>> = {
  title: 'Auth/Data/DataTable',
  component: DataTable as typeof DataTable<Row, unknown>,
  parameters: {
    docs: {
      description: {
        component:
          'DataTable wires TanStack Table together with the shadcn-flavoured toolbar + pagination. Pass an array of rows and a typed column definition; sorting, faceting, and visibility are wired automatically.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable<Row, unknown>>;

export const Default: Story = {
  args: { columns, data: sampleRows },
};

export const Empty: Story = {
  args: { columns, data: [] },
};

export const OnRowClick: Story = {
  args: {
    columns,
    data: sampleRows,
    onRowClick: (row) => {
      // eslint-disable-next-line no-alert
      window.alert(`clicked ${row.email}`);
    },
  },
};

export const RowClassNames: Story = {
  args: {
    columns,
    data: sampleRows,
    rowClassName: (row) => (row.status === 'suspended' ? 'opacity-50' : ''),
  },
};
