/**
 * DataTable - Public API
 * Enterprise-grade modular table system
 */

// Types
export type {
  Column,
  SortDirection,
  SortState,
  PaginationState,
  SelectionState,
  ExpandableState,
  DataTableProps,
  TableCellProps,
  TableRowProps,
  TableHeaderProps,
} from './types/index';

// Components
export { DataTable } from './DataTable';
export { EnterpriseDataTable } from './EnterpriseDataTable';
export type { EnterpriseDataTableProps } from './EnterpriseDataTable';
export { TableCell } from './TableCell';
export { TableRow } from './TableRow';
export { TableHeader } from './TableHeader';
export { TableBody } from './TableBody';
export { EmptyState } from './EmptyState';
export { LoadingSkeleton } from './LoadingSkeleton';
export { BulkActionsToolbar } from './BulkActionsToolbar';
export type { BulkAction, BulkActionsToolbarProps } from './BulkActionsToolbar';

// Hooks (Modular - Enterprise Pattern)
export {
  usePagination,
  useSorting,
  useFilters,
  useColumnResize,
  useSelection,
  useExpandable,
} from './hooks';

export type {
  UsePaginationOptions,
  UsePaginationReturn,
  UseSortingOptions,
  UseSortingReturn,
  Filter,
  FilterValue,
  UseFiltersReturn,
  ColumnWidth,
  UseColumnResizeOptions,
  UseColumnResizeReturn,
  UseSelectionOptions,
  UseSelectionReturn,
  UseExpandableOptions,
  UseExpandableReturn,
} from './hooks';

// Utilities
export { applySorting } from './utils/applySorting';
