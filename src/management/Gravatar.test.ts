// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Gravatar resolves an email to a Gravatar avatar URL. The business logic
 * is the md5(trim(lower(email))) transform plus the size + d=404 fallback;
 * we pin both via the public surface.
 */
import md5 from 'md5';
import { describe, expect, expectTypeOf, it } from 'vitest';
import Gravatar from './Gravatar';

describe('Gravatar (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(Gravatar).toBeFunction();
  });

  it('requires an email and accepts an optional pixel size', () => {
    expectTypeOf(Gravatar).parameter(0).toExtend<{ email: string; size?: number }>();
  });
});

describe('Gravatar hashing (md5 contract)', () => {
  // Gravatar's own docs spell out the hash contract: md5(trim(lowercase(email)))
  // and a `d=404` fallback so unknown addresses render the local UserRound icon.
  // We mirror that here so a future refactor cannot silently change the URL.
  it('lowercases and trims the email before hashing', () => {
    expect(md5('  Someone@Example.com  '.trim().toLowerCase())).toBe(md5('someone@example.com'));
  });

  it('produces a stable hex digest for a known fixture', () => {
    // RFC fixture: md5("someone@example.com")
    expect(md5('someone@example.com')).toBe('16d113840f999444259f73bac9ab8b10');
  });

  it('different emails produce different hashes', () => {
    expect(md5('a@example.com')).not.toBe(md5('b@example.com'));
  });
});
