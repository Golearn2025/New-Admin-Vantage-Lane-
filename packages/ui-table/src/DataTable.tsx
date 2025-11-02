/**
 * DataTable Component
 * Reusable table with fixed layout, ellipsis+tooltip, resizing
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { DataTableProps, DataTableColumn } from './DataTable.types';
import styles from './DataTable.module.css';

export function DataTable<T = any>({
  data,
  columns,
  onRowClick,
  stickyHeader = false,
  pagination,
  sorting,
  onSortChange,
  loading = false,
  emptyState = 'No data available',
  striped = false,
  bordered = false,
  maxHeight,
  ariaLabel = 'Data table',
  className,
}: DataTableProps<T>) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const widths: Record<string, number> = {};
      columns.forEach((col) => {
        if (col.width) widths[col.key] = col.width;
      });
      return widths;
    }
  );

  const resizingColumn = useRef<string | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      e.preventDefault();
      resizingColumn.current = columnKey;
      startX.current = e.clientX;
      startWidth.current = columnWidths[columnKey] || 150;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingColumn.current) return;
        const diff = moveEvent.clientX - startX.current;
        const newWidth = Math.max(80, startWidth.current + diff);
        setColumnWidths((prev) => ({
          ...prev,
          [resizingColumn.current!]: newWidth,
        }));
      };

      const handleMouseUp = () => {
        resizingColumn.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [columnWidths]
  );

  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;
    
    const newDirection =
      sorting?.columnKey === columnKey && sorting.direction === 'asc'
        ? 'desc'
        : 'asc';
    
    onSortChange({ columnKey, direction: newDirection });
  };

  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (column.accessor) return column.accessor(row);
    return (row as any)[column.key];
  };

  const renderCell = (row: T, column: DataTableColumn<T>) => {
    if (column.cell) return column.cell(row);
    const value = getCellValue(row, column);
    return value?.toString() || '—';
  };

  const containerClasses = [
    styles.container,
    className,
    stickyHeader && styles.stickyHeader,
  ]
    .filter(Boolean)
    .join(' ');

  const tableClasses = [
    styles.table,
    striped && styles.striped,
    bordered && styles.bordered,
  ]
    .filter(Boolean)
    .join(' ');

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
          <thead>
            <tr>
              {columns.map((column) => {
                const width = columnWidths[column.key] || column.width;
                const isSorted = sorting?.columnKey === column.key;
                
                return (
                  <th
                    key={column.key}
                    style={{ width: width ? `${width}px` : undefined }}
                    className={column.className}
                  >
                    <div className={styles.headerCell}>
                      <button
                        className={styles.headerButton}
                        onClick={() =>
                          column.sortable && handleSort(column.key)
                        }
                        disabled={!column.sortable}
                        type="button"
                      >
                        <span className={styles.headerText}>
                          {column.header}
                        </span>
                        {column.sortable && (
                          <span className={styles.sortIcon}>
                            {isSorted
                              ? sorting?.direction === 'asc'
                                ? '↑'
                                : '↓'
                              : '⇅'}
                          </span>
                        )}
                      </button>
                      {column.resizable && (
                        <div
                          className={styles.resizeHandle}
                          onMouseDown={(e) => handleResizeStart(e, column.key)}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? styles.clickableRow : undefined}
              >
                {columns.map((column) => {
                  const cellValue = getCellValue(row, column);
                  const cellContent = renderCell(row, column);
                  
                  return (
                    <td
                      key={column.key}
                      title={cellValue?.toString()}
                      className={column.className}
                    >
                      <div className={styles.cellContent}>{cellContent}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className={styles.pagination}>
          <button
            onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.pageIndex + 1} of{' '}
            {Math.ceil(pagination.totalCount / pagination.pageSize)}
          </span>
          <button
            onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
            disabled={
              (pagination.pageIndex + 1) * pagination.pageSize >=
              pagination.totalCount
            }
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
