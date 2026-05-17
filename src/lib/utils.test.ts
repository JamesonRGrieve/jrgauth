import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('skips falsey values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('supports the clsx conditional object form', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('deduplicates conflicting tailwind utilities via twMerge (last one wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm text-lg')).toBe('text-lg');
  });

  it('returns an empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
