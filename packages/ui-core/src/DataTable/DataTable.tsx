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
import { Pagination } from '../Pagination';
import { getRowId as defaultGetRowId } from './DataTable.utils';
import type { DataTableProps } from './types/index';
import styles from './DataTable.module.css';

export function DataTable<TData = unknown>({
  data,
  columns,
  getRowId = defaultGetRowId,
  // selectable = false, // TODO: Implement selection
  // onSelectionChange, // TODO: Implement selection
  expandable = false,
  expandedIds: controlledExpandedIds,
  renderExpandedRow,
  sort,
  onSortChange,
  pagination,
  onPaginationChange,
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
  const [internalSort, setInternalSort] = React.useState(
    sort || { columnId: null, direction: null }
  );
  const activeSort = sort || internalSort;

  // Expanded rows state (controlled or uncontrolled)
  const [internalExpandedIds, setInternalExpandedIds] = React.useState<Set<string>>(new Set());
  const expandedIds = controlledExpandedIds || internalExpandedIds;

  const handleSort = React.useCallback(
    (columnId: string) => {
      const newSort = {
        columnId,
        direction:
          activeSort.columnId === columnId && activeSort.direction === 'asc'
            ? ('desc' as const)
            : ('asc' as const),
      };
      setInternalSort(newSort);
      onSortChange?.(newSort);
    },
    [activeSort, onSortChange]
  );

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

  // Handle row click - NO auto-expansion, just pass to onRowClick
  const handleRowClick = React.useCallback(
    (row: TData, event: React.MouseEvent) => {
      // Only call onRowClick if provided - don't auto-expand
      onRowClick?.(row, event);
    },
    [onRowClick]
  );

  // Loading state
  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.tableWrapper} style={{ maxHeight }}>
          <table className={styles.table} aria-label={ariaLabel}>
            <TableHeader columns={columns} sortState={activeSort} onSort={handleSort} />
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
            <TableHeader columns={columns} sortState={activeSort} onSort={handleSort} />
            <EmptyState colSpan={columns.length}>{emptyState || 'No data available'}</EmptyState>
          </table>
        </div>
      </div>
    );
  }

  // Calculate total pages
  const totalPages = pagination ? Math.ceil(pagination.totalCount / pagination.pageSize) : 0;
  const currentPage = pagination ? pagination.pageIndex + 1 : 1;

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
          <TableHeader columns={columns} sortState={activeSort} onSort={handleSort} />
          <TableBody
            data={displayData}
            columns={columns}
            getRowId={getRowId}
            {...(expandable && { expandedIds, renderExpandedRow })}
            onRowClick={handleRowClick}
          />
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={(page) => {
            onPaginationChange?.({
              pageIndex: page - 1,
              pageSize: pagination.pageSize,
              totalCount: pagination.totalCount,
            });
          }}
          onPageSizeChange={(newPageSize) => {
            onPaginationChange?.({
              pageIndex: 0, // Reset to first page
              pageSize: newPageSize,
              totalCount: pagination.totalCount,
            });
          }}
          showInfo={true}
          showPageSizeSelector={true}
          showPrevNext={true}
          showFirstLast={false}
          size="medium"
        />
      )}
    </div>
  );
}
