'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Separator } from '@jgrieve/forms/components/ui/separator';

export const Notifications = (): React.JSX.Element => {
  return (
    <div>
      <div>
        <h3 className='text-lg font-medium'>Notifications</h3>
        <p className='text-sm text-muted-foreground'>Change your notification preferences</p>
      </div>
      <Separator className='my-4' />
    </div>
  );
};
