'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later
import PasswordField from '@jgrieve/forms/PasswordField';
import { Separator } from '@jgrieve/forms/components/ui/separator';
import axios, { type AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import type { SyntheticEvent } from 'react';
import type { AuthenticationConfig } from '../Router';

type PasswordChangeResponseBody = { detail?: string };

const readJwtString = (): string => {
  const jwt = getCookie('jwt');
  return typeof jwt === 'string' ? jwt : '';
};

export const Account = ({
  authConfig,
  data,
  userPasswordChangeEndpoint = '/v1/user/password',
  setResponseMessage,
}: {
  authConfig: AuthenticationConfig;
  data: Record<string, unknown>;
  userPasswordChangeEndpoint?: string;
  setResponseMessage: (message: string) => void;
}): React.JSX.Element => {
  return (
    <div>
      <div>
        <h3 className='text-lg font-medium'>Account</h3>
        <p className='text-sm text-muted-foreground'>Update your account information</p>
      </div>
      <Separator className='my-4' />
      {authConfig.authModes.basic && (
        <form
          onSubmit={(event: SyntheticEvent<HTMLFormElement>): void => {
            event.preventDefault();
            const form = event.currentTarget;
            void (async (): Promise<void> => {
              const formData: Record<string, FormDataEntryValue | undefined> = Object.fromEntries(new FormData(form));

              if (formData['password'] === undefined || formData['password'] === '') {
                setResponseMessage('Please enter a password.');
              }
              if (formData['password-again'] === undefined || formData['password-again'] === '') {
                setResponseMessage('Please enter your password again.');
              }
              if (formData['password'] !== formData['password-again']) {
                setResponseMessage('Passwords do not match.');
              }
              const passwordResetResponse = await axios
                .put<PasswordChangeResponseBody>(
                  `${authConfig.authServer}${userPasswordChangeEndpoint}`,
                  {
                    ...data,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${readJwtString()}`,
                    },
                  },
                )
                .catch((exception: AxiosError<PasswordChangeResponseBody>) => exception.response);
              if (passwordResetResponse?.data.detail !== undefined) {
                setResponseMessage(passwordResetResponse.data.detail);
              }
              if (passwordResetResponse?.status === 200) {
                window.location.reload();
              }
            })();
          }}
        >
          <PasswordField id='old-password' name='old-password' label='Your Old Password' />
          <PasswordField id='new-password' name='new-password' label='Your New Password' />
          <PasswordField id='new-password-again' name='new-password-again' label='Your New Password (Again)' />
        </form>
      )}
      {
        // TODO MFA management / backup codes.
        // TODO Quota management for user mode.
      }
    </div>
  );
};
