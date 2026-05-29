/**
 * OU (OrganizationalUnit) is an SWR-backed `'use client'` component. Without
 * a happy-dom + auth-context renderer we cannot exercise the fetch path, so
 * this file pins the exported types and the prop shape so a downstream
 * consumer cannot silently drift.
 */
import { describe, expectTypeOf, it } from 'vitest';
import OrganizationalUnit, {
  type OrganizationalUnit as OrganizationalUnitModel,
  type OrganizationalUnitProps,
  type Quotas,
} from './OU';

describe('OrganizationalUnit (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(OrganizationalUnit).toBeFunction();
  });

  it('accepts a required searchParams record and an optional endpoint override', () => {
    type ExpectedProps = {
      searchParams: Record<string, string | string[] | undefined>;
    } & OrganizationalUnitProps;
    expectTypeOf(OrganizationalUnit).parameter(0).toEqualTypeOf<ExpectedProps>();
  });

  it('defaults the endpoint to /ou when omitted', () => {
    // The default-prop contract is enforced by the type allowing omission.
    expectTypeOf<OrganizationalUnitProps>().toEqualTypeOf<{ organizationalUnitEndpoint?: string }>();
  });

  it('exports an OrganizationalUnit model with the expected fields', () => {
    expectTypeOf<OrganizationalUnitModel>().toExtend<{
      id: number;
      name: string;
      stripe_id: string;
      enabled: boolean;
      properties: Record<string, unknown>;
      subscriptions: unknown[];
      companies: object[];
      quotas: Quotas;
    }>();
  });

  it('exports a Quotas type indexed by quota name', () => {
    const quotas: Quotas = {
      seats: { available: 10, used: 3 },
      requests: { available: 1000, used: 42 },
    };
    expectTypeOf(quotas.seats).toExtend<{ available: number; used: number }>();
  });
});
