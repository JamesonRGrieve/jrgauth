import { describe, expect, it, vi } from 'vitest';
import { chainMutations } from './lib';

describe('chainMutations', () => {
  it('awaits the parent mutate before invoking the original mutate', async () => {
    const order: string[] = [];
    const parent = {
      mutate: vi.fn(async () => {
        order.push('parent');
      }),
    };
    const original = vi.fn(async () => {
      order.push('original');
      return 'value';
    });

    const chained = chainMutations(parent, original);
    const result = await chained();

    expect(order).toEqual(['parent', 'original']);
    expect(result).toBe('value');
    expect(parent.mutate).toHaveBeenCalledTimes(1);
    expect(original).toHaveBeenCalledTimes(1);
  });

  it('propagates rejections from the parent mutate and skips original', async () => {
    const parent = {
      mutate: vi.fn(async () => {
        throw new Error('parent boom');
      }),
    };
    const original = vi.fn(async () => 'never');

    await expect(chainMutations(parent, original)()).rejects.toThrow(/parent boom/);
    expect(original).not.toHaveBeenCalled();
  });

  it('returns whatever the original mutate resolves to', async () => {
    const parent = { mutate: vi.fn(async () => undefined) };
    const original = vi.fn(async () => ({ id: 1 }));

    await expect(chainMutations(parent, original)()).resolves.toEqual({ id: 1 });
  });
});
