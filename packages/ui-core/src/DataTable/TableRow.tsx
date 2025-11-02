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

/**
 * Simple hash function for generating consistent colors from strings
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

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

  // Detect group type and parent ID from row data
  const rowData = row as { trip_type?: string; id?: string };
  const groupType = rowData.trip_type;
  
  // Extract parent ID from segment ID (e.g., "uuid-01" → "uuid")
  const parentId = rowData.id?.includes('-') 
    ? rowData.id.substring(0, rowData.id.lastIndexOf('-'))
    : rowData.id;
  
  // Generate unique color from parent ID hash
  const groupColor = parentId ? `hsl(${hashCode(parentId) % 360}, 70%, 50%)` : undefined;
  
  return (
    <tr
      className={classes}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-row-id={rowId}
      data-selected={isSelected}
      data-expanded={isExpanded}
      data-group-type={groupType === 'return' || groupType === 'fleet' ? groupType : undefined}
      data-group-id={parentId}
      style={groupColor ? { '--group-color': groupColor } as React.CSSProperties : undefined}
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
