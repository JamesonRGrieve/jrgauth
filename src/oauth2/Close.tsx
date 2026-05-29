'use client';

import { type ReactNode, useEffect } from 'react';
import { useAuthentication } from '../useAuthentication';

export type CloseProps = Record<string, never>;

export default function Close(): ReactNode {
  const authConfig = useAuthentication();

  useEffect(() => {
    window.close();
  }, []);

  return authConfig.close.heading !== undefined && authConfig.close.heading !== '' ? (
    <h2 className='text-3xl'>{authConfig.close.heading}</h2>
  ) : null;
}
