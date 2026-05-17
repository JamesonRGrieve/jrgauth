import type { Meta, StoryObj } from '@storybook/react';
import VerifyAuthenticator from './Authenticator';

const meta: Meta<typeof VerifyAuthenticator> = {
  title: 'Auth/MFA/Authenticator',
  component: VerifyAuthenticator,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof VerifyAuthenticator>;

// VerifyAuthenticator reads cookies (totpUri / email) at render time;
// the QR placeholder will render empty when no totpUri cookie is set.
// These stories are scaffolds — set the cookies in dev to see real QR.

export const Default: Story = {
  args: { verifiedCallback: () => undefined },
};

export const RecordingCallback: Story = {
  args: {
    verifiedCallback: (verified: boolean) => {
      window.dispatchEvent(new CustomEvent('mfa-totp-verified', { detail: verified }));
    },
  },
};

export const InCardLayout: Story = {
  render: () => (
    <div style={{ maxWidth: 420, padding: 24, border: '1px solid var(--border)', borderRadius: 8 }}>
      <VerifyAuthenticator verifiedCallback={() => undefined} />
    </div>
  ),
};
