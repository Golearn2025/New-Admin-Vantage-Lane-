/**
 * Column Types
 *
 * Type definitions pentru column configuration în DataTable.
 * <80 linii - respectă regulile proiectului!
 */

import { ReactNode } from 'react';
import { SortDirection } from './sort.types';

/**
 * Column definition for DataTable
 * Generic type TData represents the row data type
 */
export interface Column<TData = unknown> {
  /**
   * Unique identifier for the column
   */
  id: string;

  /**
   * Column header display text
   */
  header: string | ReactNode;

  /**
   * Accessor function to get cell value from row data
   * If not provided, uses id as key
   */
  accessor?: (row: TData) => unknown;

  /**
   * Custom cell renderer
   * If not provided, displays accessor value as string
   */
  cell?: (row: TData, value: unknown) => ReactNode;

  /**
   * Width of the column (CSS value)
   * @example '200px', '20%', 'auto'
   */
  width?: string;

  /**
   * Minimum width of the column
   */
  minWidth?: string;

  /**
   * Maximum width of the column
   */
  maxWidth?: string;

  /**
   * Is column sortable?
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom sort function
   * If not provided, uses default string/number comparison
   */
  sortFn?: (a: TData, b: TData, direction: SortDirection) => number;

  /**
   * Alignment of cell content
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Hide column on mobile?
   * @default false
   */
  hideOnMobile?: boolean;

  /**
   * CSS class for column cells
   */
  className?: string;

  /**
   * CSS class for header cell
   */
  headerClassName?: string;
}
