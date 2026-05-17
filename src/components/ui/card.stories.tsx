import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>A short description.</CardDescription>
      </CardHeader>
      <CardContent>Some content goes here.</CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your preferences.</CardDescription>
      </CardHeader>
      <CardContent>Body content.</CardContent>
      <CardFooter>Footer actions</CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className='w-80'>
      <CardHeader>
        <CardTitle>Just a header</CardTitle>
      </CardHeader>
    </Card>
  ),
};
