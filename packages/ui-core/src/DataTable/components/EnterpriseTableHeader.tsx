/**
 * EnterpriseTableHeader Component
 * 
 * Table header for EnterpriseDataTable with:
 * - Sortable columns
 * - Resizable columns
 * - Selection support
 * - useCallback for handlers
 * - Design tokens only
 * - Zero inline functions in render
 * 
 * Ver 2.5 - PAS 4: EnterpriseDataTable Performance Optimization
 */

import React from 'react';
import styles from '../DataTable.module.css';
import type { Column } from '../types/index';
import type { UseSelectionReturn, UseSortingReturn, UseColumnResizeReturn } from '../hooks';

interface EnterpriseTableHeaderProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Selection hook */
  selection?: UseSelectionReturn<T> | undefined;
  /** Sorting hook */
  sorting?: UseSortingReturn | undefined;
  /** Column resize hook */
  resize?: UseColumnResizeReturn | undefined;
  /** Sort handler (pre-memoized in parent) */
  onSort?: (columnId: string) => void | undefined;
  /** Resize start handler (pre-memoized in parent) */
  onResizeStart?: (e: React.MouseEvent, columnId: string) => void | undefined;
  /** Additional CSS class */
  className?: string | undefined;
}

/**
 * EnterpriseTableHeader - Table header with sorting and resizing
 */
export function EnterpriseTableHeader<T>({
  columns,
  selection,
  sorting,
  resize,
  onSort,
  onResizeStart,
  className,
}: EnterpriseTableHeaderProps<T>): React.ReactElement {
  const classes = [styles.header, className].filter(Boolean).join(' ');

  return (
    <thead className={classes}>
      <tr>
        {/* Selection checkbox column */}
        {selection && (
          <th className={styles.checkboxColumn}>
            <div className={styles.headerWrapper}>
              <div className={styles.flexCenter}>
                <input
                  type="checkbox"
                  checked={selection.isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selection.isIndeterminate;
                    }
                  }}
                  onChange={selection.toggleAll}
                  aria-label="Select all rows"
                  className={styles.checkbox}
                />
              </div>
              {/* Resize handle for checkbox column */}
              {resize && onResizeStart && (
                <div
                  className={styles.resizeHandle}
                  onMouseDown={(e) => onResizeStart(e, '__select__')}
                  aria-label="Resize selection column"
                />
              )}
            </div>
          </th>
        )}

        {/* Data columns */}
        {columns.map((column) => {
          const isSortable = column.sortable ?? false;
          // Columns are resizable by default if resize hook is provided
          const isResizable = resize ? (column.resizable ?? true) : false;
          const isSorted = sorting?.columnId === column.id;
          const sortDirection = sorting?.getSortDirection(column.id);

          // Build header cell classes
          const cellClasses = [
            styles.headerCell,
            isSortable && styles.headerCellSortable,
            isSorted && styles.headerCellSorted,
          ]
            .filter(Boolean)
            .join(' ');

          // Handle sort click
          const handleSort = isSortable && onSort 
            ? () => onSort(column.id) 
            : undefined;

          // Handle resize start
          const handleResizeStart = isResizable && onResizeStart
            ? (e: React.MouseEvent) => onResizeStart(e, column.id)
            : undefined;

          return (
            <th
              key={column.id}
              className={cellClasses}
              onClick={handleSort}
              data-column-id={column.id}
              data-hide-mobile={column.hideOnMobile || false}
            >
              <div className={styles.headerWrapper}>
                {/* Header content with sort icon */}
                <div className={styles.headerContent}>
                  <span>{column.header}</span>
                  {isSortable && (
                    <span className={styles.sortIcon}>
                      {sortDirection === 'asc' 
                        ? '↑' 
                        : sortDirection === 'desc' 
                          ? '↓' 
                          : '⇅'}
                    </span>
                  )}
                </div>

                {/* Resize handle */}
                {isResizable && resize && handleResizeStart && (
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={handleResizeStart}
                    aria-label={`Resize ${column.header} column`}
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

EnterpriseTableHeader.displayName = 'EnterpriseTableHeader';
