import type { Meta, StoryObj } from '@storybook/react';
import Login from './Login';

const meta: Meta<typeof Login> = {
  title: 'Auth/Login',
  component: Login,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Login>;

// Login renders the password / MFA form gated by AuthenticationContext +
// reCAPTCHA env. The stories below pin the searchParams matrix Next.js
// passes in; live submission requires a backing API and is out of scope
// for Storybook.

export const Default: Story = {
  args: { searchParams: {} },
};

export const CustomEndpoint: Story = {
  args: { searchParams: {}, userLoginEndpoint: '/v2/user/authorize' },
};

export const WithOtpUri: Story = {
  args: {
    searchParams: {
      otp_uri: 'otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
    },
  },
};

export const WithUnknownSearchParam: Story = {
  args: { searchParams: { redirect: '/dashboard' } },
};
