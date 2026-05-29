'use client';

import { getCookie } from 'cookies-next';
import React, { Suspense } from 'react';
import PricingTable from './Stripe/PricingTable';
import { useAuthentication } from './useAuthentication';

export type SubscribeProps = { redirectTo?: string };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function Subscribe({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): React.JSX.Element {
  const authConfig = useAuthentication();

  return (
    <>
      {authConfig.subscribe.heading !== undefined && authConfig.subscribe.heading !== '' && (
        <h2 className='text-3xl'>{authConfig.subscribe.heading}</h2>
      )}
      {process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID !== undefined &&
      process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID !== '' ? (
        <Suspense fallback={<p>Loading pricing...</p>}>
          <h1>Subscribe</h1>
          <div id='stripe-box'>
            <script async src='https://js.stripe.com/v3/pricing-table.js' />
            <stripe-pricing-table
              pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
              publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
              customer-session-client-secret={searchParams.customer_session as string | undefined}
              customer-email={
                searchParams.customer_session !== undefined
                  ? undefined
                  : ((searchParams.email as string | undefined) ?? getCookie('email'))
              }
            />
          </div>
        </Suspense>
      ) : (
        <PricingTable />
      )}
    </>
  );
}
