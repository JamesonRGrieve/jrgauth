'use client';

import { useAssertion } from './lib/assert';
import { validateURI } from './lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { type AxiosError } from 'axios';
import { setCookie } from 'cookies-next';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { LuUser } from 'react-icons/lu';
import { z } from 'zod';

import { Alert } from './components/ui/alert';
import { Button } from '@jgrieve/dynamic-form/components/ui/button';
import { Input } from '@jgrieve/dynamic-form/components/ui/input';
import { Label } from '@jgrieve/dynamic-form/components/ui/label';
import { Separator } from '@jgrieve/dynamic-form/components/ui/separator';
import AuthCard from './AuthCard';
import { useAuthentication } from './useAuthentication';
import OAuth from './oauth2/OAuth';

const schema = z.object({
  email: z.email({ message: 'Please enter a valid E-Mail address.' }),
  redirectTo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export type IdentifyProps = {
  identifyEndpoint?: string;
  redirectToOnExists?: string;
  redirectToOnNotExists?: string;
  oAuthOverrides?: Record<string, unknown>;
};

export default function Identify({
  identifyEndpoint = '/v1/user/exists',
  redirectToOnExists = '/login',
  redirectToOnNotExists = '/register', // TODO Default this to /register if in basic mode, and /login in magical mode
  oAuthOverrides = {},
}): ReactNode {
  const router = useRouter();
  const authConfig = useAuthentication();
  const pathname = usePathname();

  useAssertion(validateURI(authConfig.authServer + identifyEndpoint), 'Invalid identify endpoint.', [
    authConfig.authServer,
    identifyEndpoint,
  ]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const _response = await axios.post(`${authConfig.authServer}/v1/user`, {
        user: {
          email: formData.email.toLowerCase().trim(),
        },
      });
      void setCookie('email', formData.email, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
      router.push(`${pathname}${redirectToOnNotExists}`);
    } catch (exception) {
      const axiosError = exception as AxiosError;
      if (axiosError.response?.status === 409) {
        // User exists
        void setCookie('email', formData.email, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
        router.push(`${pathname}${redirectToOnExists}`);
      } else if (axiosError.response?.status === 422) {
        // User doesn't exist
        void setCookie('email', formData.email, { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN });
        router.push(`${pathname}${redirectToOnNotExists}`);
      } else {
        setError('email', { type: 'server', message: axiosError.message });
      }
    }
  };

  const showEmail = authConfig.authModes.basic || authConfig.authModes.magical;
  const showOAuth = authConfig.authModes.oauth2;

  const description =
    showEmail && !showOAuth ? 'Please enter your email address to continue.' : 'Please choose an authentication method.';

  return (
    <AuthCard title='Welcome' description={description}>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
        className='flex flex-col gap-4'
      >
        {showEmail && (
          <>
            <Label htmlFor='E-Mail Address'>E-Mail Address</Label>
            <Input id='email' autoComplete='username' placeholder='your@example.com' autoFocus {...register('email')} />
            {errors.email?.message && <Alert variant='destructive'>{errors.email?.message}</Alert>}

            <Button variant='default' disabled={isSubmitting} className='w-full space-x-1'>
              <LuUser className='w-5 h-5' />
              <span>Continue with Email</span>
            </Button>
          </>
        )}

        {showEmail && showOAuth ? (
          <div className='flex items-center gap-2 my-2'>
            <Separator className='flex-1' />
            <span>or</span>
            <Separator className='flex-1' />
          </div>
        ) : null}

        {showOAuth && <OAuth overrides={oAuthOverrides} />}
      </form>
    </AuthCard>
  );
}
