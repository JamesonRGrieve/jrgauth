/**
 * Surface test for the Manage sub-router. Manage owns the active page
 * tab state and delegates to Profile / Team / ConnectedServices /
 * Account. Endpoint props let downstream apps redirect SWR keys.
 *
 * Uses `import type` to avoid loading the runtime module — Manage
 * imports `@jgrieve/dynamic-form/*`.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type Manage from './index';
import type { ManageProps } from './index';

describe('Manage (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof Manage>().toBeFunction();
  });

  it('ManageProps exposes all four endpoint overrides as optional strings', () => {
    expectTypeOf<ManageProps>().toEqualTypeOf<{
      userDataSWRKey?: string;
      userDataEndpoint?: string;
      userUpdateEndpoint?: string;
      userPasswordChangeEndpoint?: string;
    }>();
  });
});
