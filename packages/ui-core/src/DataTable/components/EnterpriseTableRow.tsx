/**
 * EnterpriseTableRow Component
 * 
 * Optimized table row for EnterpriseDataTable with:
 * - React.memo for performance
 * - useCallback for event handlers
 * - Selection support
 * - Zero inline functions
 * - Zero 'any' types
 * - key={rowId} NOT index
 * 
 * Ver 2.5 - PAS 4: EnterpriseDataTable Performance Optimization
 */

import React from 'react';
import { EnterpriseTableCell } from './EnterpriseTableCell';
import styles from '../DataTable.module.css';
import type { Column } from '../types/index';
import type { UseSelectionReturn } from '../hooks';

interface EnterpriseTableRowProps<T> {
  /** Row data */
  row: T;
  /** Unique row identifier */
  rowId: string;
  /** Column definitions */
  columns: Column<T>[];
  /** Is row selected */
  isSelected: boolean;
  /** Row click handler */
  onRowClick?: ((row: T) => void) | undefined;
  /** Selection hook */
  selection?: UseSelectionReturn<T> | undefined;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * EnterpriseTableRow - Memoized table row component
 * Prevents unnecessary re-renders when row data hasn't changed
 */
function EnterpriseTableRowComponent<T>({
  row,
  rowId,
  columns,
  isSelected,
  onRowClick,
  selection,
  className,
}: EnterpriseTableRowProps<T>): React.ReactElement {
  // Handle row click - memoized to prevent recreation
  const handleRowClick = React.useCallback(() => {
    if (onRowClick) {
      onRowClick(row);
    }
  }, [onRowClick, row]);

  // Handle checkbox change - memoized to prevent recreation
  const handleCheckboxChange = React.useCallback(() => {
    if (selection) {
      selection.toggleRow(rowId);
    }
  }, [selection, rowId]);

  // Stop propagation for checkbox clicks
  const handleCheckboxClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Build CSS classes
  const rowClasses = [
    styles.row,
    isSelected && styles.rowSelected,
    onRowClick && styles.rowClickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <tr
      className={rowClasses}
      onClick={onRowClick ? handleRowClick : undefined}
      data-row-id={rowId}
      data-selected={isSelected}
    >
      {/* Selection checkbox column */}
      {selection && (
        <td className={styles.checkboxColumn}>
          <div className={styles.flexCenter}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              onClick={handleCheckboxClick}
              aria-label={`Select row ${rowId}`}
              className={styles.checkbox}
            />
          </div>
        </td>
      )}

      {/* Data cells */}
      {columns.map((column) => {
        // Compute value once
        const value = column.accessor 
          ? column.accessor(row) 
          : (row as Record<string, unknown>)[column.id];

        return (
          <EnterpriseTableCell
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

/**
 * Memoized version - only re-renders if props change
 * Comparison: rowId and isSelected state
 */
export const EnterpriseTableRow = React.memo(
  EnterpriseTableRowComponent,
  (prevProps, nextProps) => {
    // Re-render only if:
    // - rowId changed (shouldn't happen)
    // - isSelected changed
    // - columns length changed
    return (
      prevProps.rowId === nextProps.rowId &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.columns.length === nextProps.columns.length
    );
  }
) as typeof EnterpriseTableRowComponent & { displayName: string };

EnterpriseTableRow.displayName = 'EnterpriseTableRow';
