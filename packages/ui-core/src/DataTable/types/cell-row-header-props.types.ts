/**
 * Sub-Component Props Types
 * 
 * Props pentru TableCell, TableRow, TableHeader components.
 * <150 linii - respectă regulile proiectului!
 */

import { Column } from './column.types';
import { SortState } from './sort.types';

/**
 * TableCell props
 */
export interface TableCellProps<TData = unknown> {
  /**
   * Row data
   */
  row: TData;
  
  /**
   * Column definition
   */
  column: Column<TData>;
  
  /**
   * Cell value (from accessor)
   */
  value: unknown;
  
  /**
   * Is this cell in a selected row?
   */
  isSelected?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * TableRow props
 */
export interface TableRowProps<TData = unknown> {
  /**
   * Row data
   */
  row: TData;
  
  /**
   * Row ID
   */
  rowId: string;
  
  /**
   * Column definitions
   */
  columns: Column<TData>[];
  
  /**
   * Is row selected?
   */
  isSelected?: boolean;
  
  /**
   * Is row expanded?
   */
  isExpanded?: boolean;
  
  /**
   * Is row hoverable?
   */
  hoverable?: boolean;
  
  /**
   * Row click handler
   */
  onClick?: (row: TData, event: React.MouseEvent) => void;
  
  /**
   * Row hover handler
   */
  onHover?: (row: TData | null) => void;
  
  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * TableHeader props
 */
export interface TableHeaderProps<TData = unknown> {
  /**
   * Column definitions
   */
  columns: Column<TData>[];
  
  /**
   * Is table selectable?
   */
  selectable?: boolean;
  
  /**
   * Is table expandable?
   */
  expandable?: boolean;
  
  /**
   * Is "select all" checked?
   */
  isAllSelected?: boolean;
  
  /**
   * Is "select all" indeterminate?
   */
  isIndeterminate?: boolean;
  
  /**
   * Select all handler
   */
  onSelectAll?: () => void;
  
  /**
   * Current sort state
   */
  sort?: SortState;
  
  /**
   * Sort change handler
   */
  onSortChange?: (columnId: string) => void;
  
  /**
   * Additional CSS class
   */
  className?: string;
}
