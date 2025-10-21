/**
 * TableHeader Component
 *
 * Table header with sortable columns and optional selection.
 * Generic component - works with any data type.
 * <150 linii - respectă regulile proiectului!
 */

import React from 'react';
import styles from './DataTable.module.css';
import { TableHeaderProps } from './types/index';

export function TableHeader<TData = unknown>({
  columns,
  selectable = false,
  expandable = false,
  isAllSelected = false,
  isIndeterminate = false,
  onSelectAll,
  sortState,
  onSort,
  className,
}: TableHeaderProps<TData>): JSX.Element {
  // Handle column header click (for sorting)
  const handleHeaderClick = (columnId: string, isSortable: boolean) => {
    if (isSortable && onSort) {
      onSort(columnId);
    }
  };

  // Get sort icon for column
  const getSortIcon = (columnId: string) => {
    if (!sortState || sortState.columnId !== columnId) {
      return '⇅'; // Unsorted
    }
    return sortState.direction === 'asc' ? '↑' : '↓';
  };

  // Build CSS classes
  const classes = [styles.header, className].filter(Boolean).join(' ');

  return (
    <thead className={classes}>
      <tr>
        {/* Selection column */}
        {selectable && (
          <th className={`${styles.headerCell} ${styles.headerCellCheckbox}`}>
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isIndeterminate;
                }
              }}
              onChange={onSelectAll}
              aria-label="Select all rows"
              className={styles.checkbox}
            />
          </th>
        )}

        {/* Expand column */}
        {expandable && (
          <th className={`${styles.headerCell} ${styles.headerCellExpand}`}>
            <span aria-label="Expandable rows"></span>
          </th>
        )}

        {/* Data columns */}
        {columns.map((column) => {
          const isSortable = column.sortable ?? false;
          const isSorted = sortState?.columnId === column.id;

          const cellClasses = [
            styles.headerCell,
            column.headerClassName,
            isSortable && styles.headerCellSortable,
            isSorted && styles.headerCellSorted,
            column.align && styles[`align-${column.align}`],
          ]
            .filter(Boolean)
            .join(' ');

          const cellStyles: React.CSSProperties = {
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
          };

          return (
            <th
              key={column.id}
              className={cellClasses}
              style={cellStyles}
              onClick={() => handleHeaderClick(column.id, isSortable)}
              data-column-id={column.id}
              data-sortable={isSortable}
              data-sorted={isSorted}
            >
              <div className={styles.headerContent}>
                <span>{column.header}</span>
                {isSortable && <span className={styles.sortIcon}>{getSortIcon(column.id)}</span>}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

TableHeader.displayName = 'TableHeader';
