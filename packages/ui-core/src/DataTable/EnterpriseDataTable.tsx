/**
 * EnterpriseDataTable Component
 *
 * Backward-compatible wrapper over TanStackDataTable.
 * Converts Column<T>[] (ui-core format) to ColumnDef<T>[] (TanStack format).
 * All existing consumers work without changes — TanStack powers the rendering.
 *
 * Ver 3.0 - Unified on TanStack Table engine
 */

'use client';

import React, { useMemo } from 'react';
import { TanStackDataTable } from '../TanStackTable/TanStackDataTable';
import { toTanStackColumns } from '../TanStackTable/toTanStackColumns';
import type { UseColumnResizeReturn, UseSelectionReturn, UseSortingReturn } from './hooks';
import type { Column } from './types/index';

export interface EnterpriseDataTableProps<T = object> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Selection hook (optional — kept for backward compat) */
  selection?: UseSelectionReturn<T>;
  /** Sorting hook (optional — kept for backward compat) */
  sorting?: UseSortingReturn;
  /** Column resize hook (optional — kept for backward compat) */
  resize?: UseColumnResizeReturn;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyState?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Striped rows */
  striped?: boolean;
  /** Bordered table */
  bordered?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Max height */
  maxHeight?: string | undefined;
  /** ARIA label */
  ariaLabel?: string;
  /** Expanded row IDs */
  expandedIds?: Set<string>;
  /** Render expanded row content */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /** Get row ID for expanded rows */
  getRowId?: (row: T) => string;
  /** Get custom className for row */
  getRowClassName?: (row: T) => string;
}

export function EnterpriseDataTable<T = object>({
  data,
  columns,
  selection,
  sorting,
  resize,
  loading = false,
  emptyState = 'No data available',
  onRowClick,
  striped = false,
  bordered = false,
  stickyHeader = false,
  maxHeight,
  ariaLabel = 'Data table',
  expandedIds,
  renderExpandedRow,
  getRowId,
  getRowClassName,
}: EnterpriseDataTableProps<T>): React.ReactElement {
  // Convert Column<T>[] → ColumnDef<T>[] (bridge)
  const tanStackColumns = useMemo(() => toTanStackColumns(columns), [columns]);

  // Fallback getRowId: use 'id' field or index
  const resolvedGetRowId = useMemo(() => {
    if (getRowId) return getRowId;
    return (row: T) => {
      const r = row as Record<string, unknown>;
      return String(r.id ?? r.ID ?? '');
    };
  }, [getRowId]);

  return (
    <TanStackDataTable<T>
      data={data}
      columns={tanStackColumns}
      getRowId={resolvedGetRowId}
      loading={loading}
      emptyState={emptyState}
      striped={striped}
      enableSelection={!!selection}
      enableResize={!!resize}
      stickyHeader={stickyHeader}
      maxHeight={maxHeight}
      ariaLabel={ariaLabel}
      expandedIds={expandedIds}
      renderExpandedRow={renderExpandedRow}
      getRowClassName={getRowClassName}
    />
  );
}
