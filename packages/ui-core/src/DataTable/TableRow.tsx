/**
 * TableRow Component
 * 
 * Individual table row with selection, hover, and expansion support.
 * Generic component - works with any data type.
 * <100 linii - respectă regulile proiectului!
 */

import React from 'react';
import styles from './DataTable.module.css';
import { TableRowProps } from './types/index';
import { TableCell } from './TableCell';

export function TableRow<TData = unknown>({
  row,
  rowId,
  columns,
  isSelected = false,
  isExpanded = false,
  hoverable = false,
  onClick,
  onHover,
  className,
}: TableRowProps<TData>): JSX.Element {
  // Handle row click
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(row, event);
    }
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    if (onHover) {
      onHover(row);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };
  
  // Build CSS classes
  const classes = [
    styles.row,
    isSelected && styles.rowSelected,
    isExpanded && styles.rowExpanded,
    hoverable && styles.rowHoverable,
    onClick && styles.rowClickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <tr
      className={classes}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-row-id={rowId}
      data-selected={isSelected}
      data-expanded={isExpanded}
    >
      {columns.map((column) => {
        // Get cell value using accessor or id
        const value = column.accessor 
          ? column.accessor(row)
          : (row as Record<string, unknown>)[column.id];
        
        return (
          <TableCell
            key={column.id}
            row={row}
            column={column}
            value={value}
            isSelected={isSelected}
          />
        );
      })}
    </tr>
  );
}

TableRow.displayName = 'TableRow';
