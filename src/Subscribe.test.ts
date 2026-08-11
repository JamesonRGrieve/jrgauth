// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface test for the Subscribe component. Subscribe conditionally
 * renders either Stripe's pricing-table web component (when
 * NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID is set) or the local PricingTable.
 *
 * Uses `import type` to avoid loading the runtime module — Subscribe
 * transitively imports `@jgrieve/forms/*` via PricingTable.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type Subscribe from './Subscribe';
import type { SubscribeProps } from './Subscribe';

describe('Subscribe (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof Subscribe>().toBeFunction();
  });

  it('SubscribeProps exposes the optional redirectTo override', () => {
    expectTypeOf<SubscribeProps>().toEqualTypeOf<{ redirectTo?: string }>();
  });
});
