// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Surface test for PricingTable. The default export reads
 * useProducts() + renders the per-product PricingCard grid; PricingCard
 * is also exported so downstream apps can lay it out inline.
 *
 * Uses `import type` to avoid loading the runtime module — PricingTable
 * imports `@jgrieve/forms/*` directly.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type PricingTable from './PricingTable';
import type { PricingCard } from './PricingTable';

describe('PricingTable (surface)', () => {
  it('default export is a parameterless React component', () => {
    expectTypeOf<typeof PricingTable>().toBeFunction();
    expectTypeOf<typeof PricingTable>().parameters.toEqualTypeOf<[]>();
  });

  it('exports PricingCard as a named React component', () => {
    expectTypeOf<typeof PricingCard>().toBeFunction();
  });
});
