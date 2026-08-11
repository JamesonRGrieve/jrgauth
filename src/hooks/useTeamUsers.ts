// SPDX-License-Identifier: AGPL-3.0-or-later
import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import useSWR, { type SWRResponse } from 'swr';

/**
 * SWR hook to fetch users for a specific team by teamId
 * @param teamId - The ID of the team
 * @returns SWR response containing the users of the team
 */
type TeamUser = Record<string, unknown>;

export default function useTeamUsers(teamId: string | undefined): SWRResponse<TeamUser[]> {
  return useSWR<TeamUser[]>(
    teamId !== undefined && teamId !== '' ? [`/v1/team/${teamId}/user`, teamId] : null,
    async () => {
      if (teamId === undefined || teamId === '') {
        return [];
      }
      const response = await axios.get<{ user_teams: TeamUser[] }>(
        `${process.env.NEXT_PUBLIC_API_URI}/v1/team/${teamId}/user`,
        {
          headers: {
            Authorization: `Bearer ${getCookie('jwt')}`,
          },
        },
      );
      return response.data.user_teams;
    },
    {
      fallbackData: [],
    },
  );
}
