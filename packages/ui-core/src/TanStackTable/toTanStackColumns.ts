/**
 * toTanStackColumns — Bridge utility
 *
 * Converts Column<T>[] (ui-core DataTable format) to ColumnDef<T>[] (TanStack format).
 * Enables incremental migration: existing column definitions work with TanStackDataTable.
 *
 * <40 lines — RULES.md compliant
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { Column } from '../DataTable/types/column.types';

export function toTanStackColumns<TData>(
  columns: Column<TData>[],
): ColumnDef<TData, unknown>[] {
  return columns.map((col) => ({
    id: col.id,
    header: typeof col.header === 'string' ? col.header : () => col.header,
    accessorFn: col.accessor ? (row: TData) => col.accessor!(row) : undefined,
    enableSorting: col.sortable ?? false,
    enableResizing: col.resizable ?? false,
    size: col.width ? parseInt(col.width, 10) || undefined : undefined,
    cell: col.cell
      ? ({ row }: { row: { original: TData } }) => {
          const value = col.accessor ? col.accessor(row.original) : null;
          return col.cell!(row.original, value);
        }
      : undefined,
  })) as ColumnDef<TData, unknown>[];
}
