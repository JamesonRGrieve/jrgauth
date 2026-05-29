import type { Meta, StoryObj } from '@storybook/react';
import usePathname from './usePathname';

// usePathname is a hook, but the symmetry ratchet treats every .tsx
// source as story-eligible. We wrap the hook in a tiny inspector
// component so the story actually exercises the hook.
function PathnameInspector({ label }: { label?: string }) {
  const pathname = usePathname();
  return (
    <div className='space-y-1 rounded-md border p-3 text-sm'>
      {label !== undefined && <div className='font-medium'>{label}</div>}
      <div>
        <span className='text-muted-foreground'>pathname:</span> <code>{pathname}</code>
      </div>
    </div>
  );
}

const meta: Meta<typeof PathnameInspector> = {
  title: 'Auth/Hooks/usePathname',
  component: PathnameInspector,
  parameters: {
    nextjs: { appDirectory: true },
  },
};
export default meta;

type Story = StoryObj<typeof PathnameInspector>;

export const Default: Story = {
  args: { label: 'Current pathname (default route)' },
};

export const WithLabel: Story = {
  args: { label: 'Inspector with caller-provided label' },
};

export const SideBySide: Story = {
  // Two inspectors render the same hook value — useful for confirming
  // the hook is stable across re-renders within the same tree.
  render: () => (
    <div className='grid gap-2' style={{ gridTemplateColumns: '1fr 1fr' }}>
      <PathnameInspector label='Pane A' />
      <PathnameInspector label='Pane B' />
    </div>
  ),
};
