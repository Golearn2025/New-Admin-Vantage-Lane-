/**
 * TanStackDataTable — Generic Reusable Table Component
 *
 * Built on @tanstack/react-table. Replaces EnterpriseDataTable across the project.
 * Features: sorting, selection, column resize, expand rows, sticky header.
 *
 * Orchestrator only — delegates to TanStackTableHeader + TanStackTableBody.
 * <120 lines — RULES.md compliant
 */

'use client';

import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState
} from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import type { TanStackTableProps } from './tanstack.types';
import styles from './TanStackTable.module.css';
import { TanStackTableBody } from './TanStackTableBody';
import { TanStackTableHeader } from './TanStackTableHeader';

/** Builds the auto-injected first column (checkbox + row number + optional expand) */
function buildRowMetaColumn<TData>(
  enableSelection: boolean,
  showRowNumbers: boolean,
  rowNumberOffset: number,
  renderExpandButton?: ((row: TData) => React.ReactNode) | undefined,
): ColumnDef<TData, unknown> {
  const hasExpand = !!renderExpandButton;
  return {
    id: '_rowMeta',
    header: ({ table }) => (
      <div className={styles.rowMetaHeader}>
        {enableSelection && (
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all rows"
          />
        )}
        {showRowNumbers && <span className={styles.rowNumHeader}>#</span>}
      </div>
    ),
    cell: ({ row }) => (
      <div className={styles.rowMetaCell}>
        {enableSelection && (
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select row ${row.index + 1}`}
          />
        )}
        {showRowNumbers && (
          <span className={styles.rowNum}>{rowNumberOffset + row.index + 1}.</span>
        )}
        {hasExpand && renderExpandButton(row.original)}
      </div>
    ),
    size: hasExpand ? 100 : enableSelection && showRowNumbers ? 70 : enableSelection ? 40 : 50,
    enableResizing: false,
    enableSorting: false,
  };
}

export function TanStackDataTable<TData>({
  data,
  columns,
  getRowId,
  loading = false,
  emptyState = 'No data available.',
  striped = false,
  enableSelection = false,
  enableResize = true,
  columnResizeMode = 'onEnd',
  stickyHeader = false,
  maxHeight,
  ariaLabel = 'Data table',
  expandedIds,
  renderExpandedRow,
  getRowClassName,
  manualPagination = false,
  totalCount = 0,
  sorting: controlledSorting,
  onSortingChange,
  rowSelection: controlledRowSelection,
  onRowSelectionChange,
  showRowNumbers = true,
  rowNumberOffset = 0,
  renderExpandButton,
}: TanStackTableProps<TData>): React.ReactElement {
  // Internal sorting state (used when not controlled)
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] = useState<Record<string, boolean>>({});

  // Auto-inject first column with checkbox + row number + optional expand
  const allColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!enableSelection && !showRowNumbers) return columns;
    const metaCol = buildRowMetaColumn<TData>(enableSelection, showRowNumbers, rowNumberOffset, renderExpandButton);
    return [metaCol, ...columns];
  }, [columns, enableSelection, showRowNumbers, rowNumberOffset, renderExpandButton]);

  const sorting = controlledSorting ?? internalSorting;
  const rowSelection = controlledRowSelection ?? internalRowSelection;

  const handleSortingChange = onSortingChange
    ? (updater: SortingState | ((old: SortingState) => SortingState)) => {
        const next = typeof updater === 'function' ? updater(sorting) : updater;
        onSortingChange(next);
      }
    : setInternalSorting;

  const handleRowSelectionChange = onRowSelectionChange
    ? (updater: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => {
        const next = typeof updater === 'function' ? updater(rowSelection) : updater;
        onRowSelectionChange(next);
      }
    : setInternalRowSelection;

  const pageCount = manualPagination
    ? Math.max(1, Math.ceil(totalCount / (data.length || 1)))
    : -1;

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    enableRowSelection: enableSelection,
    onSortingChange: handleSortingChange as never,
    onRowSelectionChange: handleRowSelectionChange as never,
    getCoreRowModel: getCoreRowModel<TData>(),
    getSortedRowModel: getSortedRowModel<TData>(),
    columnResizeMode,
    manualPagination,
    ...(manualPagination ? { pageCount } : {}),
    getRowId,
  } as Parameters<typeof useReactTable<TData>>[0]);

  const rows = table.getRowModel().rows;
  const colSpan = table.getVisibleLeafColumns().length;

  // Scroll style — override CSS max-height if prop provided
  const scrollStyle: React.CSSProperties = maxHeight ? { maxHeight } : {};

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <div className={styles.tableScroll} style={scrollStyle}>
          <table className={styles.table} aria-label={ariaLabel}>
            <TanStackTableHeader
              headerGroups={table.getHeaderGroups()}
              stickyHeader={stickyHeader}
            />

            {loading ? (
              <tbody className={styles.tbody}>
                <tr>
                  <td colSpan={colSpan} className={styles.stateCell}>
                    <span className={styles.loadingSpinner}>⏳</span>
                    {' '}Loading...
                  </td>
                </tr>
              </tbody>
            ) : rows.length === 0 ? (
              <tbody className={styles.tbody}>
                <tr>
                  <td colSpan={colSpan} className={styles.stateCell}>
                    {emptyState}
                  </td>
                </tr>
              </tbody>
            ) : (
              <TanStackTableBody
                rows={rows}
                expandedIds={expandedIds ?? new Set()}
                renderExpandedRow={renderExpandedRow ?? undefined}
                getRowId={getRowId}
                getRowClassName={getRowClassName ?? undefined}
                colSpan={colSpan}
                striped={striped}
              />
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
