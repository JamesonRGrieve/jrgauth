'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

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

function OrganizationalUnitPage({
  searchParams,
  organizationalUnitEndpoint = '/ou',
}: { searchParams: Record<string, string | string[] | undefined> } & OrganizationalUnitProps): ReactNode {
  const authConfig = useAuthentication();
  const ouParam = searchParams['ou'];
  const ouKey = Array.isArray(ouParam) ? ouParam.join(',') : (ouParam ?? '');
  useSWR<OrganizationalUnit[]>(`/ou/${ouKey}`, async () => {
    const jwtCookie = getCookie('jwt');
    const jwt = typeof jwtCookie === 'string' ? jwtCookie : '';
    const response = await axios.get<OrganizationalUnit[]>(`${authConfig.authServer}${organizationalUnitEndpoint}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data.sort((a, b) => a.name.localeCompare(b.name));
  });
  return null;
}

export default OrganizationalUnitPage;
