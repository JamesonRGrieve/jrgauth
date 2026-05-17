/**
 * Surface tests for the Table primitive family. Every subcomponent is a
 * forwardRef wrapper around a single native HTML table tag (table,
 * thead, tbody, tr, th, td, tfoot, caption) — those native semantics
 * are the whole reason the family exists, so we pin the displayName /
 * ref-target tag pairing.
 *
 * Once @testing-library/react is available, expand to assert the
 * rendered tag for each subcomponent.
 */
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table subcomponent surface', () => {
  it('exports the eight primitive subcomponents', () => {
    expectTypeOf(Table).toBeObject();
    expectTypeOf(TableHeader).toBeObject();
    expectTypeOf(TableBody).toBeObject();
    expectTypeOf(TableFooter).toBeObject();
    expectTypeOf(TableRow).toBeObject();
    expectTypeOf(TableHead).toBeObject();
    expectTypeOf(TableCell).toBeObject();
    expectTypeOf(TableCaption).toBeObject();
  });

  it('preserves a stable displayName for every subcomponent (devtools / snapshot stability)', () => {
    expect(Table.displayName).toBe('Table');
    expect(TableHeader.displayName).toBe('TableHeader');
    expect(TableBody.displayName).toBe('TableBody');
    expect(TableFooter.displayName).toBe('TableFooter');
    expect(TableRow.displayName).toBe('TableRow');
    expect(TableHead.displayName).toBe('TableHead');
    expect(TableCell.displayName).toBe('TableCell');
    expect(TableCaption.displayName).toBe('TableCaption');
  });

  it('Table accepts the native HTML table attribute surface', () => {
    type Props = React.ComponentPropsWithoutRef<typeof Table>;
    expectTypeOf<Props['className']>().toEqualTypeOf<string | undefined>();
  });

  it('TableHead is a <th> shaped accessor (column header attributes)', () => {
    type HeadProps = React.ComponentPropsWithoutRef<typeof TableHead>;
    expectTypeOf<HeadProps['scope']>().not.toBeAny();
    expectTypeOf<HeadProps['colSpan']>().toEqualTypeOf<number | undefined>();
  });

  it('TableCell is a <td> shaped accessor (data cell attributes)', () => {
    type CellProps = React.ComponentPropsWithoutRef<typeof TableCell>;
    expectTypeOf<CellProps['colSpan']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<CellProps['rowSpan']>().toEqualTypeOf<number | undefined>();
  });
});
