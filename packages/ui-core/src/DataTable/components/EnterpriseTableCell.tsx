/**
 * EnterpriseTableCell Component
 * 
 * Optimized table cell for EnterpriseDataTable with:
 * - React.memo for performance
 * - Custom cell rendering
 * - Tooltip support
 * - Design tokens only
 * - Zero inline styles
 * - Zero 'any' types
 * 
 * Ver 2.5 - PAS 4: EnterpriseDataTable Performance Optimization
 */

import React from 'react';
import styles from '../DataTable.module.css';
import variantStyles from '../DataTable.variants.module.css';
import type { Column } from '../types/index';

interface EnterpriseTableCellProps<T> {
  /** Row data */
  row: T;
  /** Column definition */
  column: Column<T>;
  /** Pre-computed cell value */
  value?: unknown;
  /** Is row selected */
  isSelected?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * EnterpriseTableCell - Memoized table cell component
 * Prevents unnecessary re-renders when row data hasn't changed
 */
function EnterpriseTableCellComponent<T>({
  row,
  column,
  value,
  isSelected = false,
  className,
}: EnterpriseTableCellProps<T>): React.ReactElement {
  // Compute cell value if not provided
  const cellValue = value !== undefined 
    ? value 
    : column.accessor 
      ? column.accessor(row) 
      : (row as Record<string, unknown>)[column.id];

  // Render custom cell content or fallback to string
  const cellContent = column.cell 
    ? column.cell(row, cellValue) 
    : String(cellValue ?? '');

  // Tooltip shows raw value
  const tooltipText = String(cellValue ?? '');

  // Build CSS classes
  const classes = [
    styles.cell,
    column.align && variantStyles[`align-${column.align}`],
    column.className,
    isSelected && styles.cellSelected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <td 
      className={classes}
      data-column-id={column.id}
      title={tooltipText}
    >
      <div className={styles.cellContent}>
        {cellContent}
      </div>
    </td>
  );
}

/**
 * Memoized version - only re-renders if props change
 * Comparison: column.id and row reference
 */
export const EnterpriseTableCell = React.memo(
  EnterpriseTableCellComponent,
  (prevProps, nextProps) => {
    // Re-render only if:
    // - row reference changed
    // - column id changed
    // - isSelected changed
    return (
      prevProps.row === nextProps.row &&
      prevProps.column.id === nextProps.column.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
) as typeof EnterpriseTableCellComponent & { displayName: string };

EnterpriseTableCell.displayName = 'EnterpriseTableCell';
