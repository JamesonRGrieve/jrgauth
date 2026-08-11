// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { validateURI } from './validation';

describe('validateURI', () => {
  it('accepts well-formed http URLs', () => {
    expect(validateURI('http://example.com')).toBe(true);
    expect(validateURI('https://example.com/path?q=1#frag')).toBe(true);
  });

  it('accepts non-http schemes that the URL constructor recognises', () => {
    expect(validateURI('mailto:user@example.com')).toBe(true);
    expect(validateURI('ftp://example.com/file')).toBe(true);
  });

  it('rejects plainly invalid input', () => {
    expect(validateURI('not a url')).toBe(false);
    expect(validateURI('')).toBe(false);
    expect(validateURI('http://')).toBe(false);
  });
});
