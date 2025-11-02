/**
 * EnterpriseDataTable Component
 * Complete enterprise table cu TOATE features integrate
 * Selection, Sorting, Resizing, Bulk Actions, Ellipsis, Tooltip
 */

'use client';

import React from 'react';
import type { 
  UseSelectionReturn,
  UseSortingReturn,
  UseColumnResizeReturn,
} from './hooks';
import type { Column } from './types/index';
import styles from './DataTable.module.css';

export interface EnterpriseDataTableProps<T = any> {
  /** Table data */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Selection hook (optional) */
  selection?: UseSelectionReturn<T>;
  /** Sorting hook (optional) */
  sorting?: UseSortingReturn;
  /** Column resize hook (optional) */
  resize?: UseColumnResizeReturn;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyState?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Striped rows */
  striped?: boolean;
  /** Bordered table */
  bordered?: boolean;
  /** Sticky header */
  stickyHeader?: boolean;
  /** Max height */
  maxHeight?: string;
  /** ARIA label */
  ariaLabel?: string;
}

export function EnterpriseDataTable<T = any>({
  data,
  columns,
  selection,
  sorting,
  resize,
  loading = false,
  emptyState = 'No data available',
  onRowClick,
  striped = false,
  bordered = false,
  stickyHeader = false,
  maxHeight,
  ariaLabel = 'Data table',
}: EnterpriseDataTableProps<T>): React.ReactElement {
  
  const handleSort = (columnId: string) => {
    if (sorting) {
      sorting.toggleSort(columnId);
    }
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    if (!resize) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ FIX: Use state width instead of DOM offsetWidth to prevent jump!
    const startWidth = resize.columnWidths[columnId] || 150;
    const startX = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.max(80, startWidth + diff);
      resize.setColumnWidth(columnId, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const tableClasses = [
    styles.table,
    striped && styles.striped,
    bordered && styles.bordered,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    stickyHeader && styles.stickyHeader,
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={containerClasses}>
        <div className={styles.empty}>{emptyState}</div>
      </div>
    );
  }

  return (
    <div className={containerClasses} style={{ maxHeight }}>
      <div className={styles.tableWrapper}>
        <table className={tableClasses} aria-label={ariaLabel}>
          {/* COLGROUP - Width aplicat AICI, nu pe th! */}
          <colgroup>
            {selection && (
              <col style={{ width: '48px', minWidth: '48px', maxWidth: '48px' }} />
            )}
            {columns.map((column) => {
              const width = resize?.columnWidths[column.id] 
                ? resize.columnWidths[column.id] 
                : (column.width ? parseInt(column.width) : 150);
              return (
                <col
                  key={column.id}
                  style={{ width: `${width}px` }}
                />
              );
            })}
          </colgroup>

          <thead className={styles.header}>
            <tr>
              {/* Selection checkbox column */}
              {selection && (
                <th 
                  className={`${styles.headerCell} ${styles.headerCellCheckbox}`}
                  style={{ width: '48px', minWidth: '48px', maxWidth: '48px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                </th>
              )}

              {/* Data columns */}
              {columns.map((column) => {
                const isSortable = column.sortable ?? false;
                const isResizable = column.resizable ?? false;
                const isSorted = sorting?.columnId === column.id;
                const sortDirection = sorting?.getSortDirection(column.id);

                const cellClasses = [
                  styles.headerCell,
                  isSortable && styles.headerCellSortable,
                  isSorted && styles.headerCellSorted,
                ].filter(Boolean).join(' ');

                return (
                  <th
                    key={column.id}
                    className={cellClasses}
                    onClick={() => isSortable && handleSort(column.id)}
                  >
                    <div className={styles.headerWrapper}>
                      <div className={styles.headerContent}>
                        <span>{column.header}</span>
                        {isSortable && (
                          <span className={styles.sortIcon}>
                            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '⇅'}
                          </span>
                        )}
                      </div>
                      
                      {isResizable && resize && (
                        <div
                          className={styles.resizeHandle}
                          onMouseDown={(e) => handleResizeStart(e, column.id)}
                          aria-label={`Resize ${column.header} column`}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={styles.body}>
            {data.map((row, rowIndex) => {
              // Use row.id if exists, otherwise use index
              const rowId = (row as any).id || String(rowIndex);
              const isSelected = selection?.isRowSelected(rowId) ?? false;

              return (
                <tr
                  key={rowIndex}
                  className={isSelected ? styles.rowSelected : undefined}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* Selection checkbox */}
                  {selection && (
                    <td 
                      className={styles.cell}
                      style={{ width: '48px', minWidth: '48px', maxWidth: '48px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selection.toggleRow(rowId)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${rowIndex + 1}`}
                          className={styles.checkbox}
                        />
                      </div>
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => {
                    const value = column.accessor ? column.accessor(row) : (row as any)[column.id];
                    const cellContent = column.cell ? column.cell(row, value) : String(value ?? '');
                    const tooltipText = String(value ?? '');

                    return (
                      <td
                        key={column.id}
                        className={styles.cell}
                        title={tooltipText}
                      >
                        <div className={styles.cellContent}>
                          {cellContent}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
