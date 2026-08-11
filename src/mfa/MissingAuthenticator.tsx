// SPDX-License-Identifier: AGPL-3.0-or-later
import { Button } from '@jgrieve/forms/components/ui/button';
import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import { useState } from 'react';
import { LuLoader as Loader2, LuMail as Mail } from 'react-icons/lu';
import { Disclosure, DisclosureContent, DisclosureTrigger } from '../components/ui/disclosure';

export const AuthenticatorHelp = (): React.JSX.Element => {
  const [loading, setLoading] = useState({
    email: false,
    sms: false,
  });

  const handleEmailSend = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, email: true }));
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/v1/user/mfa/email`,
      {
        email: getCookie('email'),
      },
      {
        headers: {
          Authorization: getCookie('jwt'),
        },
      },
    );
    setLoading((prev) => ({ ...prev, email: false }));
  };

  const _handleSMSSend = async (): Promise<void> => {
    setLoading((prev) => ({ ...prev, sms: true }));
    // Simulate API call
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    setLoading((prev) => ({ ...prev, sms: false }));
  };

  return (
    <Disclosure>
      <DisclosureTrigger>
        <Button className='w-full bg-transparent' type='button' variant='outline'>
          I don&apos;t have my authenticator
        </Button>
      </DisclosureTrigger>
      <DisclosureContent>
        <div className='p-2 space-y-2'>
          <Button
            onClick={() => {
              void handleEmailSend();
            }}
            disabled={loading.email}
            variant='outline'
            type='button'
            size='sm'
            className='flex w-full gap-2 bg-transparent'
          >
            {loading.email ? <Loader2 className='w-4 h-4 animate-spin' /> : <Mail className='w-4 h-4' />}
            Send Email Code
          </Button>

          {/* <Button
            onClick={handleSMSSend}
            disabled={loading.sms}
            variant='outline'
            type='button'
            size='sm'
            className='flex w-full gap-2 bg-transparent'
          >
            {loading.sms ? <Loader2 className='w-4 h-4 animate-spin' /> : <MessageSquare className='w-4 h-4' />}
            Send SMS Code
          </Button> */}
        </div>
      </DisclosureContent>
    </Disclosure>
  );
};
