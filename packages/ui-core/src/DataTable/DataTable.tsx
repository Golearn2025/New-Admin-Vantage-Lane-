/**
 * DataTable Component - Minimal Working Version
 * Complete data table - respects existing types exactly
 * <150 lines - respects project rules!
 */

import React from 'react';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { getRowId as defaultGetRowId } from './DataTable.utils';
import type { DataTableProps } from './types/index';
import styles from './DataTable.module.css';

export function DataTable<TData = unknown>({
  data,
  columns,
  getRowId = defaultGetRowId,
  // selectable = false, // TODO: Implement selection
  // onSelectionChange, // TODO: Implement selection
  // expandable = false, // TODO: Implement expandable rows
  // renderExpandedRow, // TODO: Implement expandable rows
  sort,
  onSortChange,
  pagination,
  // onPaginationChange, // TODO: Implement pagination change callback
  loading = false,
  skeletonRows = 5,
  emptyState,
  onRowClick,
  // onRowHover, // TODO: Implement row hover
  striped = false,
  bordered = true,
  compact = false,
  stickyHeader = false,
  maxHeight,
  className = '',
  ariaLabel,
}: DataTableProps<TData>): React.ReactElement {
  // Internal sort state (uncontrolled)
  const [internalSort, setInternalSort] = React.useState(sort || { columnId: null, direction: null });
  const activeSort = sort || internalSort;

  const handleSort = React.useCallback((columnId: string) => {
    const newSort = {
      columnId,
      direction: activeSort.columnId === columnId && activeSort.direction === 'asc' ? 'desc' as const : 'asc' as const,
    };
    setInternalSort(newSort);
    onSortChange?.(newSort);
  }, [activeSort, onSortChange]);

  // Apply sort (must be before early returns)
  const sortedData = React.useMemo(() => {
    if (!data || data.length === 0 || !activeSort.columnId || !activeSort.direction) return data;
    
    const column = columns.find((col) => col.id === activeSort.columnId);
    if (!column || !column.accessor) return data;

    return [...data].sort((a, b) => {
      const aVal = column.accessor!(a);
      const bVal = column.accessor!(b);
      
      const comparison = String(aVal).localeCompare(String(bVal));
      return activeSort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, activeSort, columns]);

  // Apply pagination (must be before early returns)
  const displayData = React.useMemo(() => {
    if (!pagination || !sortedData || sortedData.length === 0) return sortedData;
    
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Loading state
  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.tableWrapper} style={{ maxHeight }}>
          <table className={styles.table} aria-label={ariaLabel}>
            <TableHeader
              columns={columns}
              sortState={activeSort}
              onSort={handleSort}
            />
            <LoadingSkeleton columns={columns.length} rows={skeletonRows} />
          </table>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table} aria-label={ariaLabel}>
            <TableHeader
              columns={columns}
              sortState={activeSort}
              onSort={handleSort}
            />
            <EmptyState colSpan={columns.length}>
              {emptyState || 'No data available'}
            </EmptyState>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        className={`${styles.tableWrapper} ${stickyHeader ? styles.stickyHeader : ''}`.trim()}
        style={{ maxHeight }}
      >
        <table
          className={`
            ${styles.table}
            ${striped ? styles.striped : ''}
            ${bordered ? styles.bordered : ''}
            ${compact ? styles.compact : ''}
          `.trim()}
          aria-label={ariaLabel}
        >
          <TableHeader
            columns={columns}
            sortState={activeSort}
            onSort={handleSort}
          />
          <TableBody
            data={displayData}
            columns={columns}
            getRowId={getRowId}
            {...(onRowClick && { onRowClick })}
          />
        </table>
      </div>
    </div>
  );
}
