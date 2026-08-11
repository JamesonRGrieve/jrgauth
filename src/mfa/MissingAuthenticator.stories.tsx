// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { AuthenticatorHelp } from './MissingAuthenticator';

const meta: Meta<typeof AuthenticatorHelp> = {
  title: 'Auth/MFA/MissingAuthenticator',
  component: AuthenticatorHelp,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof AuthenticatorHelp>;

export const Default: Story = {};

export const InNarrowContainer: Story = {
  // The disclosure trigger spans 100% of its container — shrinking the
  // wrapping width verifies the inner content remains usable.
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <AuthenticatorHelp />
    </div>
  ),
};

export const WithIntroCopy: Story = {
  // Renders the disclosure beneath context-setting copy, the way it
  // appears in Login.tsx's MFA step.
  render: () => (
    <div className='space-y-3' style={{ maxWidth: 360 }}>
      <p className='text-sm text-muted-foreground'>
        Can&apos;t find your authenticator app? Use a one-time backup option below.
      </p>
      <AuthenticatorHelp />
    </div>
  ),
};
