'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { useAuthentication } from './useAuthentication';

export type LogoutProps = { redirectTo?: string };

export default function Logout({ redirectTo = '/' }: LogoutProps): ReactNode {
  const router = useRouter();
  const authConfig = useAuthentication();

  useEffect(() => {
    void deleteCookie(
      'jwt',
      process.env.NEXT_PUBLIC_COOKIE_DOMAIN !== undefined ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN } : {},
    );
    router.refresh();
    router.replace(redirectTo);
    router.refresh();
  }, [router, redirectTo]);

  // Moved the conditional rendering here, after all hooks are called
  if (authConfig.logout.heading === undefined || authConfig.logout.heading === '') {
    return null;
  }

  return <h1 className='text-3xl'>{authConfig.logout.heading}</h1>;
}
