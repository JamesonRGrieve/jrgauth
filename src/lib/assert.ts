import { useEffect } from 'react';

export default function assert(test: boolean, message?: string): void {
  if (!test) {
    throw new Error(`Assertion Failure: ${message ?? 'No message provided.'}`);
  }
}

export function useAssertion(
  assertion: boolean,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dependencies: readonly any[],
): void {
  useEffect(() => {
    assert(assertion, message);
  }, [assertion, message]);
}
