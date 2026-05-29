/**
 * AuthCard wraps shadcn Card primitives with a heading, description, and
 * optional back-button / response message. The component is heavy on JSX
 * but its public surface is tiny; we pin it here.
 *
 * AuthCard also re-exports `ResponseMessage` and attaches it as a static
 * property — that contract is what downstream apps rely on, so it gets
 * pinned too.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import AuthCard, { ResponseMessage } from './AuthCard';

describe('AuthCard (surface)', () => {
  it('is the default export and a callable component', () => {
    expectTypeOf(AuthCard).toBeFunction();
  });

  it('exposes ResponseMessage as a static property mirroring the named export', () => {
    expect(AuthCard.ResponseMessage).toBe(ResponseMessage);
  });

  it('requires a title and description, with optional back-button and response message', () => {
    expectTypeOf(AuthCard).parameter(0).toExtend<{
      title: string;
      description: string;
      showBackButton?: boolean;
      responseMessage?: string;
      children?: React.ReactNode;
    }>();
  });

  it('ResponseMessage forwards HTMLDivElement attributes', () => {
    expectTypeOf(ResponseMessage).parameter(0).toExtend<React.HTMLAttributes<HTMLDivElement>>();
  });
});
