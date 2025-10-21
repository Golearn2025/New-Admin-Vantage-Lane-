/**
 * TableCell Component
 *
 * Individual table cell with alignment, custom rendering, and accessibility.
 * Generic component - works with any data type.
 */

import React from 'react';
import styles from './DataTable.module.css';
import { TableCellProps } from './types/index';

export function TableCell<TData = unknown>({
  row,
  column,
  value,
  isSelected = false,
  className,
}: TableCellProps<TData>): JSX.Element {
  // Render custom cell if provided
  const cellContent = column.cell ? column.cell(row, value) : String(value ?? '');

  // Build CSS classes
  const classes = [
    styles.cell,
    column.align && styles[`align-${column.align}`],
    column.className,
    isSelected && styles.cellSelected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build inline styles for width
  const cellStyles: React.CSSProperties = {
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  };

  return (
    <td className={classes} style={cellStyles} data-column-id={column.id}>
      {cellContent}
    </td>
  );
}

TableCell.displayName = 'TableCell';
