import type { Meta, StoryObj } from '@storybook/react';
import Register from './Register';

const meta: Meta<typeof Register> = {
  title: 'Auth/Register',
  component: Register,
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Register>;

// Register renders the new-user signup form. The story matrix pins
// the additionalFields + endpoint overrides downstream apps consume.

export const Default: Story = {
  args: {},
};

export const WithAdditionalFields: Story = {
  args: { additionalFields: ['first_name', 'last_name', 'company'] },
};

export const CustomEndpoint: Story = {
  args: { userRegisterEndpoint: '/v2/user' },
};

export const FullOverrides: Story = {
  args: {
    additionalFields: ['phone'],
    userRegisterEndpoint: '/v2/user/register',
  },
};
