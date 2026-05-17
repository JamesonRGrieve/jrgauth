import { Button } from '@jgrieve/dynamic-form/components/ui/button';
import { useToast } from '@jgrieve/dynamic-form/hooks/useToast';
import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import useSWR, { type SWRResponse } from 'swr';
import { DataTable } from '../components/data/data-table';
import { DataTableColumnHeader } from '../components/data/data-table-column-header';
import type { Invitation } from '../hooks/z';
import log from '../lib/log';

export function InvitationsTable({ userId }: { userId?: string }) {
  const { data: invitations, mutate } = useInvitationsByUserId(userId);
  const { toast } = useToast();

  const handleAccept = async (orgObj: Invitation) => {
    try {
      await axios.patch(
        `${String(process.env.NEXT_PUBLIC_API_URI ?? '')}/v1/invitation/${orgObj.id}`,
        {
          invitation: {
            invitation_code: orgObj.code,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${String(getCookie('jwt') ?? '')}`,
          },
        },
      );
      await mutate();
      toast({
        title: 'Invitation accepted',
        description: 'You have successfully accepted the invitation.',
      });
    } catch (_e) {
      toast({
        title: 'Error accepting invitation',
        description: 'There was an error accepting the invitation. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const columns: ColumnDef<Invitation>[] = [
    {
      accessorKey: 'team.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Team' />,
      cell: ({ row }) => {
        const team = (row.original as unknown as { team?: { name?: string } }).team;
        return <span>{team?.name ?? '-'}</span>;
      },
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
      cell: ({ row }) => <span>{row.original.code}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ row }) => {
        const createdAt = (row.original as unknown as { created_at?: string }).created_at ?? row.original.createdAt;
        return <span>{new Date(createdAt).toLocaleString()}</span>;
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Action' />,
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button variant='default' size='sm' onClick={() => void handleAccept(row.original)}>
            {'Accept Invitation'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable data={invitations} columns={columns} meta={{ title: 'Invitations' }} />
  );
}


export function useInvitationsByUserId(userId?: string): SWRResponse<Invitation[]> {
  return useSWR<Invitation[]>(
    userId !== undefined && userId !== '' ? [`/user/invitation`, userId] : '/user/invitation',
    async (): Promise<Invitation[]> => {
      const jwt = getCookie('jwt');
      if (jwt === undefined || jwt === '' || userId === undefined || userId === '') {
        return [];
      }
      try {
        log(['REST useInvitationsByUserId() Fetching', { userId }], {
          client: 1,
        });
        const response = await axios.get<{ invitations?: RawInvitationGroup[] }>(
          `${String(process.env.NEXT_PUBLIC_API_URI ?? '')}/v1/user/invitation`,
          {
            headers: {
              Authorization: `Bearer ${String(jwt)}`,
            },
            params: { userId },
          },
        );
        log(['REST useInvitationsByUserId() Response', response.data], {
          client: 3,
        });

        const data = convertInvitationsData(response.data.invitations ?? [], userId);

        return data;
      } catch (error) {
        log(['REST useInvitationsByUserId() Error', error], {
          client: 3,
        });
        return [];
      }
    },
    { fallbackData: [] },
  );
}


type RawInvitee = { user_id: string; status: string; [key: string]: unknown };
type RawInvitationGroup = {
  team?: unknown;
  role_id?: unknown;
  role?: unknown;
  created_at?: unknown;
  code?: unknown;
  invitees: RawInvitee[];
};

function convertInvitationsData(invitationsData: RawInvitationGroup[], userId: string): Invitation[] {
  if (invitationsData.length === 0) {
    return [];
  }
  const list: Invitation[] = [];
  invitationsData.forEach((data) => {
    for (let i = 0; i < data.invitees.length; i++) {
      if (data.invitees[i].user_id === userId && data.invitees[i].status === 'pending') {
        const inviteeWithTeam = {
          team: data.team,
          role_id: data.role_id,
          role: data.role,
          created_at: data.created_at,
          code: data.code,
          ...data.invitees[i],
        } as unknown as Invitation;
        list.push(inviteeWithTeam);
      }
    }
  });
  return list;
}

