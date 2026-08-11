// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import assert from './assert';

describe('assert', () => {
  it('returns nothing when the predicate is true', () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(true, 'should not throw')).not.toThrow();
  });

  it('throws an Error when the predicate is false', () => {
    expect(() => assert(false, 'boom')).toThrow(/Assertion Failure: boom/);
  });

  it('uses the default message when none provided', () => {
    expect(() => assert(false)).toThrow(/Assertion Failure: No message provided\./);
  });
});
