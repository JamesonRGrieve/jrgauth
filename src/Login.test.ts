/**
 * Surface test for the Login component. Login drives an axios POST to
 * `${authServer}${userLoginEndpoint}` using a Basic auth header, manages
 * MFA OTP redirects, and stores the resulting JWT cookie. The end-to-end
 * flow needs a Next router + happy-dom harness; until that lands we pin
 * the prop type surface that downstream apps depend on.
 *
 * Uses `import type` to avoid loading the runtime module — Login
 * transitively imports `@jgrieve/dynamic-form/*`, which does not resolve
 * when the auth repo is opened standalone.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type Login from './Login';
import type { LoginProps } from './Login';

describe('Login (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof Login>().toBeFunction();
  });

  it('LoginProps exposes the optional userLoginEndpoint override', () => {
    expectTypeOf<LoginProps>().toEqualTypeOf<{
      userLoginEndpoint?: string;
    }>();
  });

  it('userLoginEndpoint is optional (defaulted at runtime to /v1/user/authorize)', () => {
    type Resolved = Required<LoginProps>;
    expectTypeOf<Resolved['userLoginEndpoint']>().toEqualTypeOf<string>();
  });
});
