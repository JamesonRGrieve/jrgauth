'use client';

import { Button } from '@jgrieve/dynamic-form/components/ui/button';
import { Separator } from '@jgrieve/dynamic-form/components/ui/separator';
import DynamicForm from '@jgrieve/dynamic-form/DynamicForm';
import { toast } from '@jgrieve/dynamic-form/hooks/useToast';
import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { useCallback, useEffect } from 'react';
import { mutate } from 'swr';
import { DataTable } from '../components/data/data-table';
import { DataTableColumnHeader } from '../components/data/data-table-column-header';
import { useTeams } from '../hooks/useTeam';
import log from '../lib/log';
import VerifySMS from '../mfa/SMS';
import type { AuthenticationConfig } from '../Router';
import { InvitationsTable } from './Invitations';

type Team = {
  image_url: string | null;
  name: string;
  parent_id: string | null;
  parent: string | null;
  children: unknown[];
  updated_at: string;
  updated_by_user_id: string | null;
  id: string;
  created_at: string;
  created_by_user_id: string;
  description: string | null;
  encryption_key: string;
  token: string | null;
  training_data: string | null;
};

type MissingRequirements = Record<string, unknown> | Array<Record<string, unknown>>;
type ProfileUserData = {
  user?: Record<string, unknown> & { id?: string };
  missing_requirements?: MissingRequirements;
} & Record<string, unknown>;

type ProfileRouter = { push: (path: string) => void };

export const Profile = ({
  isLoading,
  error,
  data,
  router,
  authConfig,
  userDataSWRKey,
  responseMessage,
  userUpdateEndpoint,
  setResponseMessage,
}: {
  isLoading: boolean;
  error: Error | undefined;
  data: ProfileUserData | undefined;
  router: ProfileRouter;
  authConfig: AuthenticationConfig;
  userDataSWRKey: string;
  responseMessage: string;
  userUpdateEndpoint: string;
  setResponseMessage: (message: string) => void;
}) => {
  const { data: userTeams } = useTeams();
  // Use `data` passed from parent Manage component as the authoritative user object.
  // But be resilient to different API shapes. Try several common locations for fields.
  const readUserField = useCallback(
    (field: string): unknown => {
      // Try several common keys and shapes to be resilient to API variations.
      const candidates: string[] = [];
      const camel = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      candidates.push(field, camel, field.replace(/_/g, ''), field.replace('_name', ''), 'name');
      // Common identity keys
      if (field === 'first_name') {
        candidates.push('given_name', 'givenName');
      }
      if (field === 'last_name') {
        candidates.push('family_name', 'familyName');
      }
      if (field === 'display_name') {
        candidates.push('displayName', 'username', 'userName');
      }

      try {
        const root = data as Record<string, unknown> | undefined;
        const user = root?.user as Record<string, unknown> | undefined;
        const userUser = user?.user as Record<string, unknown> | undefined;
        const userProfile = user?.profile as Record<string, unknown> | undefined;
        for (const key of candidates) {
          if (user?.[key] !== undefined) {
            return user[key];
          }
          if (root?.[key] !== undefined) {
            return root[key];
          }
          if (userUser?.[key] !== undefined) {
            return userUser[key];
          }
          if (userProfile?.[key] !== undefined) {
            return userProfile[key];
          }
        }
      } catch (_e) {
        // ignore
      }
      return undefined;
    },
    [data],
  );

  // Debug: (removed runtime console output) - kept comment for dev reference

  // If the user has no timezone set on the server, detect the browser timezone and
  // persist it automatically on first sign-in so the UI and subsequent logins show
  // the correct timezone. Do NOT overwrite an existing timezone.
  useEffect(() => {
    try {
      if (typeof window === 'undefined') {
        return;
      }
      if (data === undefined) {
        return;
      }
      const existingTZ = readUserField('timezone');
      if (existingTZ !== undefined && existingTZ !== null && String(existingTZ).length > 0) {
        return;
      }

      const detectedTZ =
        typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : 'UTC';

      void (async () => {
        try {
          await axios.put(
            `${authConfig.authServer}${userUpdateEndpoint}`,
            { user: { timezone: detectedTZ } },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${String(getCookie('jwt') ?? '')}`,
              },
            },
          );
          await mutate(userDataSWRKey);
          await mutate('/user');
        } catch (_err) {
          // failed to persist timezone; swallow silently
        }
      })();
    } catch (_err) {
      // swallow errors
    }
  }, [data, authConfig, userUpdateEndpoint, userDataSWRKey, readUserField]);

  const user_teams_columns: ColumnDef<Team>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Team' />,
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[500px] truncate font-medium'>{row.getValue('name')}</span>
          </div>
        );
      },
      meta: {
        headerName: 'team',
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
      cell: ({ row }) => {
        return (
          <div className='flex w-[100px] items-center'>
            <span>{row.getValue('role')}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      meta: {
        headerName: 'role',
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Action' />,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex h-8 w-8 p-0'
                onClick={() => router.push(`/team/${row.original.id}`)}
              >
                <ArrowTopRightIcon />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        );
      },
      enableHiding: true,
      enableSorting: false,
      meta: {
        headerName: 'Actions',
      },
    },
  ];

  return (
    <div>
      <div>
        <h3 className='text-lg font-medium'>Profile</h3>
        <p className='text-sm text-muted-foreground'>Apply basic changes to your profile</p>
      </div>
      <Separator className='my-4' />
      {isLoading ? (
        <p>Loading Current Data...</p>
      ) : error !== undefined ? (
        <p>{error.message}</p>
      ) : data === undefined ||
        data.missing_requirements === undefined ||
        Object.keys(data.missing_requirements).length === 0 ? (
        <DynamicForm
          fields={{
            first_name: {
              type: 'text',
              display: 'First Name',
              validation: (value: string) => value.length > 0,
              value: readUserField('first_name') ?? '',
            },
            last_name: {
              type: 'text',
              display: 'Last Name',
              validation: (value: string) => value.length > 0,
              value: readUserField('last_name') ?? '',
            },
            display_name: {
              type: 'text',
              display: 'Display Name',
              validation: (value: string) => value.length > 0,
              // Prefer explicit display_name, otherwise compose from first+last if available
              value: (() => {
                const displayName = readUserField('display_name');
                if (displayName !== undefined && displayName !== null) {
                  return displayName;
                }
                const first = readUserField('first_name');
                const last = readUserField('last_name');
                if ((first !== undefined && first !== null) || (last !== undefined && last !== null)) {
                  return `${String(first ?? '')} ${String(last ?? '')}`.trim();
                }
                return '';
              })(),
            },
            timezone: {
              type: 'text',
              display: 'Timezone',
              validation: (value: string) => value.length > 0,
              // Use server value if present; otherwise fall back to browser timezone or UTC.
              value: (() => {
                const tz = readUserField('timezone');
                if (tz !== undefined && tz !== null && String(tz).length > 0) {
                  return String(tz);
                }
                return typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function'
                  ? Intl.DateTimeFormat().resolvedOptions().timeZone
                  : 'UTC';
              })(),
            },
          }}
          toUpdate={data?.user}
          submitButtonText='Update'
          excludeFields={[
            'id',
            'agent_id',
            'missing_requirements',
            'email',
            'subscription',
            'stripe_id',
            'ip_address',
            'companies',
          ]}
          readOnlyFields={['input_tokens', 'output_tokens']}
          additionalButtons={[
            <div key='teams-table' className='col-span-4'>
              <DataTable data={(userTeams as Team[] | undefined) ?? []} columns={user_teams_columns} meta={{ title: 'Teams' }} />
            </div>,
          ]}
          onConfirm={async (formData: Record<string, unknown>) => {
            try {
              const putResponse = await axios
                .put<{ detail?: string }>(
                  `${authConfig.authServer}${userUpdateEndpoint}`,
                  {
                    user: {
                      ...Object.entries(formData).reduce<Record<string, unknown>>((acc, [key, value]) => {
                        return value !== undefined && value !== null && value !== '' ? { ...acc, [key]: value } : acc;
                      }, {}),
                    },
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${String(getCookie('jwt') ?? '')}`,
                    },
                  },
                )
                .catch((exception: { response?: { data?: { detail?: string } } }) => ({
                  data: exception.response?.data ?? {},
                }));
              const updateResponse = putResponse.data;
              log(['Update Response', updateResponse], { client: 2 });
              setResponseMessage(updateResponse.detail !== undefined ? updateResponse.detail : 'Update successful.');
              await mutate('/user');
              toast({
                title: 'Profile updated',
                description: 'Your profile was updated successfully.',
              });
            } catch (err) {
              const message = err instanceof Error ? err.message : 'There was an error updating your profile.';
              toast({
                title: 'Profile update failed',
                description: message,
                variant: 'destructive',
              });
            }
          }}
        />
      ) : (
        <>
          {(() => {
            const reqs = data?.missing_requirements;
            const reqsArray = Array.isArray(reqs) ? reqs : [];
            const reqsRecord = reqs !== undefined && !Array.isArray(reqs) ? reqs : {};
            const hasVerifyEmail = reqsArray.some((obj) => Object.keys(obj).some((key) => key === 'verify_email'));
            const verifySms = reqsRecord['verify_sms'];
            const hasOther = reqsArray.some((obj) =>
              Object.keys(obj).some((key) => !['verify_email', 'verify_sms'].includes(key)),
            );
            return (
              <>
                {hasVerifyEmail && (
                  <p className='text-xl'>Please check your email and verify it using the link provided.</p>
                )}
                {verifySms !== undefined && verifySms !== null && verifySms !== false && (
                  <VerifySMS verifiedCallback={async () => mutate(userDataSWRKey)} />
                )}
                {hasOther && (
                  <DynamicForm
                    submitButtonText='Submit Missing Information'
                    fields={Object.entries(reqsRecord).reduce<Record<string, { type: unknown }>>((acc, [_key, value]) => {
                      const v = value as Record<string, unknown>;
                      const fieldKey = Object.keys(v)[0];
                      acc[fieldKey] = { type: Object.values(v)[0] };
                      return acc;
                    }, {})}
                    excludeFields={['verify_email', 'verify_sms']}
                    onConfirm={async (formData: Record<string, unknown>) => {
                      const putResponse = await axios
                        .put<{ detail?: string }>(
                          `${authConfig.authServer}${userUpdateEndpoint}`,
                          {
                            ...formData,
                          },
                          {
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${String(getCookie('jwt') ?? '')}`,
                            },
                          },
                        )
                        .catch((exception: { response?: { data?: { detail?: string } } }) => ({
                          data: exception.response?.data ?? {},
                        }));
                      const updateResponse = putResponse.data;
                      if (updateResponse.detail !== undefined) {
                        setResponseMessage(updateResponse.detail);
                      }
                      await mutate(userDataSWRKey);
                      const newReqs = (formData as { missing_requirements?: Record<string, unknown> })
                        .missing_requirements;
                      if (newReqs !== undefined && Object.keys(newReqs).length === 0) {
                        const redirect = (getCookie('href') as string | undefined) ?? '/';
                        deleteCookie('href');
                        router.push(redirect);
                      }
                    }}
                  />
                )}
              </>
            );
          })()}
          {responseMessage !== '' && <p>{responseMessage}</p>}
        </>
      )}
      <div className='pb-4' />
      {data?.user?.id !== undefined && <InvitationsTable userId={data.user.id} />}
    </div>
  );
};
