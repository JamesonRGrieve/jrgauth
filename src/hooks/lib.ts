import { getCookie } from 'cookies-next';
import { GraphQLClient } from 'graphql-request';

// Import all types from the centralized schema file

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a configured GraphQL client instance
 * @returns Configured GraphQLClient instance
 */
export const createGraphQLClient = (): GraphQLClient =>
  new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URI}/graphql`, {
    headers: { authorization: `Bearer ${getCookie('jwt')}` || '' },
  });

/**
 * Helper to chain mutations between hooks
 * @param parentHook - Parent hook containing mutate function
 * @param currentHook - Current hook's mutate function
 */
export const chainMutations = <T>(
  parentHook: { mutate: () => Promise<unknown> },
  originalMutate: () => Promise<T>,
): (() => Promise<T>) => {
  return async (): Promise<T> => {
    await parentHook.mutate();
    return originalMutate();
  };
};
