// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import Gravatar from './Gravatar';

const meta: Meta<typeof Gravatar> = {
  title: 'Auth/Management/Gravatar',
  component: Gravatar,
};
export default meta;

type Story = StoryObj<typeof Gravatar>;

export const Default: Story = {
  args: { email: 'someone@example.com' },
};

export const LargeSize: Story = {
  args: { email: 'someone@example.com', size: 128 },
};

export const UnknownAddress: Story = {
  // The d=404 fallback makes unknown addresses render the UserRound icon.
  args: { email: 'no-such-address-zzzzz@example.invalid' },
};

export const TrimsAndLowercases: Story = {
  // md5 hashes are case-insensitive in Gravatar's API; the component trims +
  // lowercases the input. Two stories side by side make that visible.
  args: { email: '  Someone@Example.com  ' },
};
