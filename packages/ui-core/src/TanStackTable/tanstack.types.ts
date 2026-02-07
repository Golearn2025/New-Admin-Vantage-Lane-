/**
 * TanStack Table - Type Definitions
 *
 * Generic types for the reusable TanStack-based DataTable.
 * <50 lines — RULES.md compliant
 */

import type { ColumnDef, ColumnResizeMode, SortingState } from '@tanstack/react-table';
import type { ReactNode } from 'react';

/** Props for the main TanStackDataTable component */
export interface TanStackTableProps<TData> {
  /** Table data rows */
  data: TData[];
  /** TanStack column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Unique row ID accessor */
  getRowId: (row: TData) => string;
  /** Loading state */
  loading?: boolean | undefined;
  /** Empty state message */
  emptyState?: string | ReactNode | undefined;
  /** Striped rows */
  striped?: boolean | undefined;
  /** Enable row selection (checkboxes) */
  enableSelection?: boolean | undefined;
  /** Enable column resizing */
  enableResize?: boolean | undefined;
  /** Column resize mode */
  columnResizeMode?: ColumnResizeMode | undefined;
  /** Sticky header */
  stickyHeader?: boolean | undefined;
  /** Max height for scroll container */
  maxHeight?: string | undefined;
  /** ARIA label */
  ariaLabel?: string | undefined;
  /** Expanded row IDs */
  expandedIds?: Set<string> | undefined;
  /** Render expanded row content */
  renderExpandedRow?: ((row: TData) => ReactNode) | undefined;
  /** Get custom className for a row */
  getRowClassName?: ((row: TData) => string) | undefined;
  /** Manual (server-side) pagination */
  manualPagination?: boolean | undefined;
  /** Total row count for manual pagination */
  totalCount?: number | undefined;
  /** Controlled sorting state */
  sorting?: SortingState | undefined;
  /** Sorting change handler */
  onSortingChange?: ((sorting: SortingState) => void) | undefined;
  /** Row selection state (record of rowId → boolean) */
  rowSelection?: Record<string, boolean> | undefined;
  /** Row selection change handler */
  onRowSelectionChange?: ((selection: Record<string, boolean>) => void) | undefined;
  /** Show row numbers (1., 2., 3...) in first column */
  showRowNumbers?: boolean | undefined;
  /** Page offset for correct row numbering across pages (default 0) */
  rowNumberOffset?: number | undefined;
  /** Optional: render an expand button inside the first column (below checkbox + row number) */
  renderExpandButton?: ((row: TData) => ReactNode) | undefined;
  /** Optional: callback when a row is clicked */
  onRowClick?: ((row: TData) => void) | undefined;
}
