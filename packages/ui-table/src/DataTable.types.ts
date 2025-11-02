/**
 * DataTable Types
 * Reusable table component types
 */

import type { ReactNode } from 'react';

export interface DataTableColumn<T = any> {
  /** Unique column identifier */
  key: string;
  
  /** Column header text */
  header: string;
  
  /** Column width in pixels (optional) */
  width?: number;
  
  /** Allow column resizing with mouse */
  resizable?: boolean;
  
  /** Enable sorting for this column */
  sortable?: boolean;
  
  /** Custom cell renderer */
  cell?: (row: T) => ReactNode;
  
  /** Accessor function to get cell value */
  accessor?: (row: T) => any;
  
  /** CSS class for column */
  className?: string;
}

export interface DataTablePagination {
  /** Current page index (0-based) */
  pageIndex: number;
  
  /** Number of rows per page */
  pageSize: number;
  
  /** Total number of rows */
  totalCount: number;
  
  /** Page change handler */
  onPageChange: (pageIndex: number) => void;
}

export interface DataTableSort {
  /** Column key being sorted */
  columnKey: string | null;
  
  /** Sort direction */
  direction: 'asc' | 'desc' | null;
}

export interface DataTableProps<T = any> {
  /** Table data rows */
  data: T[];
  
  /** Column definitions */
  columns: DataTableColumn<T>[];
  
  /** Row click handler */
  onRowClick?: (row: T) => void;
  
  /** Sticky header */
  stickyHeader?: boolean;
  
  /** Pagination config (optional) */
  pagination?: DataTablePagination;
  
  /** Sorting config (optional) */
  sorting?: DataTableSort;
  
  /** Sort change handler */
  onSortChange?: (sort: DataTableSort) => void;
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state message */
  emptyState?: string;
  
  /** Striped rows */
  striped?: boolean;
  
  /** Bordered table */
  bordered?: boolean;
  
  /** Max height for scrollable table */
  maxHeight?: string;
  
  /** ARIA label */
  ariaLabel?: string;
  
  /** Custom className */
  className?: string;
}
