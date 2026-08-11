// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import type { AuthenticationConfig } from '../Router';
import { Profile } from './Profile';

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

const stubRouter = {
  push: (_path: string) => {
    /* no-op */
  },
};

const userData = {
  user: {
    id: '11111111-2222-3333-4444-555555555555',
    email: 'demo@example.com',
    first_name: 'Demo',
    last_name: 'User',
  },
};

const meta: Meta<typeof Profile> = {
  title: 'Auth/Management/Profile',
  component: Profile,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Profile>;

// Profile renders the user's own data + a list of teams pulled from
// useTeams(). Stories pin the loading / error / loaded matrix.

export const Loading: Story = {
  args: {
    isLoading: true,
    error: undefined,
    data: undefined,
    router: stubRouter,
    authConfig: baseAuthConfig,
    userDataSWRKey: '/user',
    responseMessage: '',
    userUpdateEndpoint: '/v1/user',
    setResponseMessage: () => {
      /* no-op */
    },
  },
};

export const Loaded: Story = {
  args: {
    isLoading: false,
    error: undefined,
    data: userData,
    router: stubRouter,
    authConfig: baseAuthConfig,
    userDataSWRKey: '/user',
    responseMessage: '',
    userUpdateEndpoint: '/v1/user',
    setResponseMessage: () => {
      /* no-op */
    },
  },
};

export const WithError: Story = {
  args: {
    isLoading: false,
    error: new Error('Failed to load user data'),
    data: undefined,
    router: stubRouter,
    authConfig: baseAuthConfig,
    userDataSWRKey: '/user',
    responseMessage: 'Failed to load user data',
    userUpdateEndpoint: '/v1/user',
    setResponseMessage: () => {
      /* no-op */
    },
  },
};
