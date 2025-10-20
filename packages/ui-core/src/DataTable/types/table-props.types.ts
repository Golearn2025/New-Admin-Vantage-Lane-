/**
 * DataTable Props Types
 * 
 * Main DataTable component props.
 * <150 linii - respectă regulile proiectului!
 */

import { ReactNode } from 'react';
import { Column } from './column.types';
import { SortState } from './sort.types';
import { PaginationState } from './pagination.types';

/**
 * DataTable props
 */
export interface DataTableProps<TData = unknown> {
  /**
   * Table data
   */
  data: TData[];
  
  /**
   * Column definitions
   */
  columns: Column<TData>[];
  
  /**
   * Function to get unique ID for each row
   * @default Uses index
   */
  getRowId?: (row: TData, index: number) => string;
  
  /**
   * Enable row selection?
   * @default false
   */
  selectable?: boolean;
  
  /**
   * Selection change handler
   */
  onSelectionChange?: (selectedRows: TData[]) => void;
  
  /**
   * Enable row expansion?
   * @default false
   */
  expandable?: boolean;
  
  /**
   * Controlled expanded row IDs (optional)
   * If not provided, expansion state is managed internally
   */
  expandedIds?: Set<string>;
  
  /**
   * Render expanded row content
   */
  renderExpandedRow?: (row: TData) => ReactNode;
  
  /**
   * Sort state (controlled)
   */
  sort?: SortState;
  
  /**
   * Sort change handler
   */
  onSortChange?: (sort: SortState) => void;
  
  /**
   * Pagination state (controlled)
   */
  pagination?: PaginationState;
  
  /**
   * Pagination change handler
   */
  onPaginationChange?: (pagination: PaginationState) => void;
  
  /**
   * Is table loading?
   * @default false
   */
  loading?: boolean;
  
  /**
   * Number of skeleton rows to show when loading
   * @default 5
   */
  skeletonRows?: number;
  
  /**
   * Empty state message or component
   */
  emptyState?: ReactNode;
  
  /**
   * Row click handler
   */
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  
  /**
   * Row hover handler
   */
  onRowHover?: (row: TData | null) => void;
  
  /**
   * Striped rows?
   * @default false
   */
  striped?: boolean;
  
  /**
   * Bordered table?
   * @default true
   */
  bordered?: boolean;
  
  /**
   * Compact row height?
   * @default false
   */
  compact?: boolean;
  
  /**
   * Sticky header?
   * @default false
   */
  stickyHeader?: boolean;
  
  /**
   * Max height for scrollable table
   */
  maxHeight?: string;
  
  /**
   * Additional CSS class for table
   */
  className?: string;
  
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}
