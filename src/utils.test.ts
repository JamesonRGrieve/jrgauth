import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AuthMode, generateCookieString, getAuthMode } from './utils';

describe('AuthMode constants', () => {
  it('has the three expected modes with stable numeric ids', () => {
    expect(AuthMode.None).toBe(0);
    expect(AuthMode.GTAuth).toBe(1);
    expect(AuthMode.MagicalAuth).toBe(2);
  });
});

describe('getAuthMode', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_AUTH_URI;
    delete process.env.NEXT_PUBLIC_API_URI;
    delete process.env.APP_URI;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns None when neither auth env var is set', () => {
    expect(getAuthMode()).toBe(AuthMode.None);
  });

  it('returns GTAuth when AUTH_URI lives under a different host than APP_URI', () => {
    process.env.NEXT_PUBLIC_AUTH_URI = 'https://auth.example.com/v1';
    process.env.NEXT_PUBLIC_API_URI = 'https://api.example.com';
    process.env.APP_URI = 'https://app.example.com';
    expect(getAuthMode()).toBe(AuthMode.GTAuth);
  });

  it('returns MagicalAuth when AUTH_URI is APP_URI/user', () => {
    process.env.APP_URI = 'https://app.example.com';
    process.env.NEXT_PUBLIC_AUTH_URI = 'https://app.example.com/user';
    process.env.NEXT_PUBLIC_API_URI = 'https://api.example.com';
    expect(getAuthMode()).toBe(AuthMode.MagicalAuth);
  });

  it('throws when AUTH_URI shares APP_URI host but does not end with /user', () => {
    process.env.APP_URI = 'https://app.example.com';
    process.env.NEXT_PUBLIC_AUTH_URI = 'https://app.example.com/oops';
    process.env.NEXT_PUBLIC_API_URI = 'https://api.example.com';
    expect(() => getAuthMode()).toThrow(/Magical Auth/);
  });
});

describe('generateCookieString', () => {
  const originalEnv = { ...process.env };
  beforeEach(() => {
    process.env.NEXT_PUBLIC_COOKIE_DOMAIN = 'example.com';
  });
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('formats cookie attributes deterministically', () => {
    expect(generateCookieString('jwt', 'abc.def', '3600')).toBe(
      'jwt=abc.def; Domain=example.com; Path=/; Max-Age=3600; SameSite=strict;',
    );
  });
});
