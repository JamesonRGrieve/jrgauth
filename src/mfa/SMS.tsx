'use client';

import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import log from '../lib/log';

function cookieString(value: ReturnType<typeof getCookie>): string {
  return typeof value === 'string' ? value : '';
}

export type RegisterFormProps = object;
export default function VerifySMS({ verifiedCallback }: { verifiedCallback: (verified: boolean) => void }): JSX.Element {
  const [fields, _setFields] = useState({
    smsCode: '',
  });
  const [errors, setErrors] = useState({
    smsCode: '',
  });
  const [smsVerified, setSMSVerified] = useState(false);
  async function _attemptSMS(): Promise<void> {
    const smsResponse = (
      await axios.post<{ detail: string }>(
        `/api/email`,
        {
          email: getCookie('email'),
          mfa_token: fields.smsCode,
        },
        {},
      )
    ).data.detail;
    log(['SMS Response', smsResponse], { client: 2 });
    if (smsResponse.toLowerCase() === 'true') {
      verifiedCallback(true);
      setSMSVerified(true);
    } else {
      log([`Email verification of ${cookieString(getCookie('email'))} failed.`], { client: 2 });
      setErrors({
        ...errors,
        smsCode: 'SMS verification failed.',
      });
    }
  }

  return (
    <>
      <div>
        <h5 className='py-4 text-2xl text-center'>SMS Verification</h5>
        {!smsVerified && <p className='py-2'>This verification method is currently unavailable.</p>}
      </div>
      {/*
      <Box display='flex' flexDirection='column' alignItems='center'>
        {smsVerified ? (
             <CheckCircle sx={{fontSize: "5rem"}} />
        ) : (
          <>
            <TextFieldWithAlert
              id='email-code-input'
              label='EMail Code'
              autoComplete='email-code'
              value={fields.smsCode}
              onChange={(e: any) => setFields({ ...fields, smsCode: e.target.value })}
              submit={null}
              error={errors.smsCode}
            />
            <ButtonWithIcon label='Verify Email' icon={<VpnKey fontSize='large' />} action={attemptEmail} />
          </>
        )}
      </Box>
        */}
    </>
  );
}
