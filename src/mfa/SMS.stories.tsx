// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import VerifySMS from './SMS';

const meta: Meta<typeof VerifySMS> = {
  title: 'Auth/MFA/SMS',
  component: VerifySMS,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof VerifySMS>;

// VerifySMS currently renders an "unavailable" placeholder body. The
// stories below pin that surface so we notice if the placeholder is
// replaced with the actual form (the placeholder copy will disappear).
export const Default: Story = {
  args: { verifiedCallback: () => undefined },
};

export const InCardLayout: Story = {
  render: () => (
    <div style={{ maxWidth: 360, padding: 24, border: '1px solid var(--border)', borderRadius: 8 }}>
      <VerifySMS verifiedCallback={() => undefined} />
    </div>
  ),
};

export const NextToAuthenticator: Story = {
  // Documents how the placeholder looks alongside a real verifier in
  // the side-by-side MFA picker layout.
  render: () => (
    <div className='grid gap-4' style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 720 }}>
      <VerifySMS verifiedCallback={() => undefined} />
      <div className='text-sm text-muted-foreground'>(Authenticator panel placeholder)</div>
    </div>
  ),
};
