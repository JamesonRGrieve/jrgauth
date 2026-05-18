/**
 * Surface test for the Register component. Register drives a multi-step
 * react-hook-form flow with reCAPTCHA, additional fields, and a final
 * axios POST. The full flow needs a Next router + happy-dom harness.
 *
 * Uses `import type` to avoid loading the runtime module — Register
 * transitively imports `@jgrieve/dynamic-form/*`, which does not resolve
 * when the auth repo is opened standalone.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type Register from './Register';
import type { RegisterProps } from './Register';

describe('Register (surface)', () => {
  it('default export is a React component function', () => {
    expectTypeOf<typeof Register>().toBeFunction();
  });

  it('RegisterProps exposes optional additionalFields and userRegisterEndpoint', () => {
    expectTypeOf<RegisterProps>().toEqualTypeOf<{
      additionalFields?: string[];
      userRegisterEndpoint?: string;
    }>();
  });

  it('additionalFields, when supplied, is an array of strings', () => {
    type Resolved = Required<RegisterProps>;
    expectTypeOf<Resolved['additionalFields']>().toEqualTypeOf<string[]>();
  });
});
