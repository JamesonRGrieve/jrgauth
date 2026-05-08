import { describe, expect, it } from 'vitest';
import { getGravatarUrl } from './gravatar';

describe('getGravatarUrl', () => {
  it('returns an empty string when email is missing', () => {
    expect(getGravatarUrl('')).toBe('');
  });

  it('lowercases and trims the email before hashing', () => {
    const a = getGravatarUrl('  User@Example.com ');
    const b = getGravatarUrl('user@example.com');
    expect(a).toBe(b);
  });

  it('uses the default size of 40 when none is provided', () => {
    expect(getGravatarUrl('user@example.com')).toContain('?s=40&d=404');
  });

  it('honors a custom size', () => {
    expect(getGravatarUrl('user@example.com', 256)).toContain('?s=256&d=404');
  });

  it('points at gravatar.com with a 32-char md5 hash', () => {
    const url = getGravatarUrl('user@example.com');
    expect(url).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[a-f0-9]{32}\?s=\d+&d=404$/);
  });
});
