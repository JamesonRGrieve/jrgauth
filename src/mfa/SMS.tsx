'use client';

import type { ReactElement } from 'react';

export type RegisterFormProps = object;
export default function VerifySMS(_props: { verifiedCallback: (verified: boolean) => void }): ReactElement {
  return (
    <>
      <div>
        <h5 className='py-4 text-2xl text-center'>SMS Verification</h5>
        <p className='py-2'>This verification method is currently unavailable.</p>
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
