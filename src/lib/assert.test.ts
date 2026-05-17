import { describe, expect, it } from 'vitest';
import assert from './assert';

describe('assert', () => {
  it('returns nothing when the predicate is true', () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(true, 'should not throw')).not.toThrow();
  });

  it('throws an Error when the predicate is false', () => {
    expect(() => assert(false, 'boom')).toThrowError(/Assertion Failure: boom/);
  });

  it('uses the default message when none provided', () => {
    expect(() => assert(false)).toThrowError(/Assertion Failure: No message provided\./);
  });
});
