/**
 * Skeleton is a presentational shim around a single div that composes
 * the caller's className with the base animate-pulse / rounded /
 * bg-muted utilities via `cn`. Without happy-dom / jsdom we can verify
 * the className merge contract by invoking the component as a plain
 * function (it's a React function component, not a forwardRef).
 *
 * When a DOM env lands (tracked in todo.json), expand this to use
 * @testing-library/react.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('is a React component accepting standard HTML div attributes', () => {
    expectTypeOf(Skeleton).toBeFunction();
  });

  it('renders a div as the root element', () => {
    const el = Skeleton({});
    expect(el.type).toBe('div');
  });

  it('produces the base class when no className is passed', () => {
    const el = Skeleton({});
    expect(el.props.className).toBe('animate-pulse rounded-md bg-muted');
  });

  it('merges the base utilities with a caller-provided className', () => {
    const el = Skeleton({ className: 'h-4 w-32' });
    const cls = el.props.className;
    expect(cls).toContain('animate-pulse');
    expect(cls).toContain('rounded-md');
    expect(cls).toContain('h-4');
    expect(cls).toContain('w-32');
  });

  it('forwards arbitrary HTML props to the div', () => {
    const el = Skeleton({ id: 'avatar-skeleton', 'aria-busy': true });
    expect(el.props.id).toBe('avatar-skeleton');
    expect(el.props['aria-busy']).toBe(true);
  });

  it('lets caller utilities win for conflicting Tailwind keys via twMerge', () => {
    const el = Skeleton({ className: 'bg-red-500' });
    const cls = el.props.className;
    expect(cls).not.toMatch(/\bbg-muted\b/);
    expect(cls).toContain('bg-red-500');
  });
});
