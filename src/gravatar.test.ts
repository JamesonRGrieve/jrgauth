import md5 from 'md5';
import { describe, expect, it } from 'vitest';
import { getGravatarUrl } from './gravatar';

describe('getGravatarUrl', () => {
  it('returns the empty string for falsy email', () => {
    expect(getGravatarUrl('')).toBe('');
  });

  it('hashes the trimmed, lowercased email with md5', () => {
    const email = '  Foo@Example.COM  ';
    const expectedHash = md5('foo@example.com');
    expect(getGravatarUrl(email)).toBe(`https://www.gravatar.com/avatar/${expectedHash}?s=40&d=404`);
  });

  it('embeds the requested size in the query string', () => {
    const url = getGravatarUrl('a@b.co', 128);
    expect(url).toMatch(/\?s=128&d=404$/);
  });

  it('produces identical URLs for emails differing only in case/whitespace', () => {
    expect(getGravatarUrl('user@x.com')).toBe(getGravatarUrl(' USER@X.com '));
  });
});
