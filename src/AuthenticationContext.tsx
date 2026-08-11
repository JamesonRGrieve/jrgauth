'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createContext } from 'react';
import type { AuthenticationConfig } from './Router';

// Create the context
export const AuthenticationContext = createContext<AuthenticationConfig | undefined>(undefined);
