'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

import { type ContextType, useContext } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import assert from './lib/assert';

export const useAuthentication = (): NonNullable<ContextType<typeof AuthenticationContext>> => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthenticationProvider');
  }
  assert(!context.authModes.basic || !context.authModes.magical, 'Basic and Magical modes cannot both be enabled.');
  return context;
};
