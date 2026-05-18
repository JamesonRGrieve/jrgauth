/**
 * Surface test for DataTablePagination. The component renders the
 * page-size + page-number controls bound to a TanStack Table instance.
 *
 * Uses `import type` to avoid loading the runtime module — the source
 * imports `@jgrieve/dynamic-form/*` for its button + select.
 */
import { describe, expectTypeOf, it } from 'vitest';
import type { DataTablePagination } from './data-table-pagination';

describe('DataTablePagination (surface)', () => {
  it('is the named export and a callable component', () => {
    expectTypeOf<typeof DataTablePagination>().toBeFunction();
  });

  it('is generic over the row shape', () => {
    type RowShape = { id: string };
    expectTypeOf<typeof DataTablePagination<RowShape>>().toBeFunction();
  });
});
