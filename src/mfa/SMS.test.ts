/**
 * VerifySMS is a stub component currently rendering only the heading +
 * an unavailability notice (the verification form is commented out).
 * Surface tests pin the named export and the callback prop contract so
 * the future re-implementation cannot silently break the API.
 */
import { describe, expectTypeOf, it } from 'vitest';
import VerifySMS, { type RegisterFormProps } from './SMS';

describe('VerifySMS (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(VerifySMS).toBeFunction();
  });

  it('requires a verifiedCallback that accepts a boolean', () => {
    expectTypeOf(VerifySMS).parameter(0).toMatchTypeOf<{ verifiedCallback: (verified: boolean) => void }>();
  });

  it('exports a RegisterFormProps placeholder type (currently `object`)', () => {
    // The placeholder type exists so the SMS flow can be merged into a
    // wider register-form union later. We assert it is non-`any`.
    expectTypeOf<RegisterFormProps>().not.toBeAny();
  });
});
