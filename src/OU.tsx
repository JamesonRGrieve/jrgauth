'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import type { ReactNode } from 'react';
import useSWR from 'swr';
import { useAuthentication } from './useAuthentication';

export type OrganizationalUnitProps = {
  organizationalUnitEndpoint?: string;
};
export interface OrganizationalUnit {
  id: number;
  name: string;
  stripe_id: string;
  enabled: boolean;
  properties: Record<string, unknown>; // This indicates an object with dynamic keys and unknown values
  subscriptions: unknown[]; // Assuming subscriptions is an array of unknown type
  companies: object[];
  quotas: Quotas;
}
export interface Quotas {
  [quotaType: string]: {
    available: number;
    used: number;
  };
}

export default function OrganizationalUnit({
  searchParams,
  organizationalUnitEndpoint = '/ou',
}: { searchParams: Record<string, string | string[] | undefined> } & OrganizationalUnitProps): ReactNode {
  const authConfig = useAuthentication();
  useSWR<OrganizationalUnit[]>(`/ou/${searchParams.ou}`, async () => {
    const response = await axios.get(`${authConfig.authServer}${organizationalUnitEndpoint}`, {
      headers: {
        Authorization: `Bearer ${getCookie('jwt')}`,
      },
    });
    return response.data.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  });
  return null;
}
