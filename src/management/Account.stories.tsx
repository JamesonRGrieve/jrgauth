// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import type { AuthenticationConfig } from '../Router';
import { Account } from './Account';

const baseAuthConfig: AuthenticationConfig = {
  identify: { path: '/', heading: 'Welcome' },
  login: { path: '/login', heading: 'Please Authenticate' },
  manage: { path: '/manage', heading: 'Account Management' },
  register: { path: '/register', heading: 'Welcome, Please Register' },
  close: { path: '/close', heading: '' },
  subscribe: { path: '/subscribe', heading: 'Please Subscribe' },
  logout: { path: '/logout', heading: '', props: { redirectTo: '/' } },
  ou: { path: '/ou', heading: 'OU' },
  error: { path: '/error', heading: 'Error' },
  appName: 'Storybook',
  authBaseURI: 'https://auth.example.com',
  authServer: 'https://api.example.com',
  authModes: { basic: true, oauth2: false, magical: false },
  enableOU: false,
};

const meta: Meta<typeof Account> = {
  title: 'Auth/Management/Account',
  component: Account,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Account>;

// Account is the password-change form rendered inside the management
// sub-router. It expects an authConfig + a setResponseMessage callback.

export const Default: Story = {
  args: {
    authConfig: baseAuthConfig,
    data: {},
    setResponseMessage: () => {
      /* no-op */
    },
  },
};

export const CustomEndpoint: Story = {
  args: {
    authConfig: baseAuthConfig,
    data: {},
    userPasswordChangeEndpoint: '/v2/user/password',
    setResponseMessage: () => {
      /* no-op */
    },
  },
};

export const BasicAuthDisabled: Story = {
  args: {
    authConfig: { ...baseAuthConfig, authModes: { ...baseAuthConfig.authModes, basic: false } },
    data: {},
    setResponseMessage: () => {
      /* no-op */
    },
  },
};
