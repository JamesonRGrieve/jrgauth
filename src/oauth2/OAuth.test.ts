/**
 * Surface test for the OAuth component. OAuth renders one button per
 * configured provider in oAuth2Providers (filtered by client_id) and
 * delegates to react-simple-oauth2-login for the popup flow.
 *
 * Uses `import type` to avoid loading the runtime module — OAuth
 * imports `@jgrieve/dynamic-form/*` directly.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type OAuth from './OAuth';
import type { OAuthProps } from './OAuth';

describe('OAuth (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof OAuth>().toBeFunction();
  });

  it('OAuthProps.overrides, when present, is a partial provider override map', () => {
    type Resolved = Required<OAuthProps>;
    expectTypeOf<Resolved['overrides']>().not.toBeAny();
  });

  it('every OAuthProps field is optional (component is safe with `<OAuth />`)', () => {
    expectTypeOf<OAuthProps>().toExtend<Partial<OAuthProps>>();
  });
});
