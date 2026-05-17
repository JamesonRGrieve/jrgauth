/**
 * The Badge component itself is a thin presentational wrapper, but its
 * `badgeVariants` cva builder is pure and fully testable without a DOM —
 * which makes it the right place to lock the variant contract down so a
 * later refactor cannot silently drop a variant key or default.
 */
import { describe, expect, it } from 'vitest';
import { badgeVariants } from './badge';

describe('badgeVariants', () => {
  it('returns the default variant classes when called with no args', () => {
    const cls = badgeVariants();
    expect(cls).toContain('inline-flex');
    expect(cls).toContain('rounded-md');
    expect(cls).toContain('bg-primary');
    expect(cls).toContain('text-primary-foreground');
  });

  it('emits the secondary variant when asked', () => {
    const cls = badgeVariants({ variant: 'secondary' });
    expect(cls).toContain('bg-secondary');
    expect(cls).toContain('text-secondary-foreground');
    expect(cls).not.toMatch(/\bbg-primary\b/);
  });

  it('emits destructive utilities for the destructive variant', () => {
    const cls = badgeVariants({ variant: 'destructive' });
    expect(cls).toContain('bg-destructive');
    expect(cls).toContain('text-destructive-foreground');
  });

  it('renders the outline variant with foreground text and no background fill', () => {
    const cls = badgeVariants({ variant: 'outline' });
    expect(cls).toContain('text-foreground');
    expect(cls).not.toMatch(/\bbg-(primary|secondary|destructive)\b/);
  });

  it('keeps the focus / shape base utilities on every variant', () => {
    for (const variant of ['default', 'secondary', 'destructive', 'outline'] as const) {
      const cls = badgeVariants({ variant });
      expect(cls).toContain('inline-flex');
      expect(cls).toContain('focus:ring-2');
      expect(cls).toContain('rounded-md');
    }
  });

  it('falls back to the default variant when an undefined variant is passed', () => {
    expect(badgeVariants({ variant: undefined })).toBe(badgeVariants());
  });
});
