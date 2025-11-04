/**
 * EnterpriseDataTable Component
 * 
 * Complete enterprise table with all features integrated:
 * - Selection (multi-select with checkboxes)
 * - Sorting (column-based with visual indicators)
 * - Resizing (column width adjustment)
 * - Performance optimized with React.memo
 * - Zero inline functions
 * - Zero TypeScript 'any'
 * 
 * Ver 2.5 - PAS 4: Performance Optimization & Architecture Refactor
 */

'use client';

import React from 'react';
import { EnterpriseTableHeader } from './components/EnterpriseTableHeader';
import { EnterpriseTableBody } from './components/EnterpriseTableBody';
import type { 
  UseSelectionReturn,
  UseSortingReturn,
  UseColumnResizeReturn,
} from './hooks';
import type { Column } from './types/index';
import styles from './DataTable.module.css';

export interface EnterpriseDataTableProps<T = object> {
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
  maxHeight?: string | undefined;
  /** ARIA label */
  ariaLabel?: string;
  /** Expanded row IDs */
  expandedIds?: Set<string>;
  /** Render expanded row content */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /** Get row ID for expanded rows */
  getRowId?: (row: T) => string;
}

export function EnterpriseDataTable<T = object>({
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
  expandedIds,
  renderExpandedRow,
  getRowId,
}: EnterpriseDataTableProps<T>): React.ReactElement {
  
  // Handle column sort - memoized to prevent recreation
  const handleSort = React.useCallback((columnId: string) => {
    if (sorting) {
      sorting.toggleSort(columnId);
    }
  }, [sorting]);

  // Handle column resize start - memoized to prevent recreation
  const handleResizeStart = React.useCallback((e: React.MouseEvent, columnId: string) => {
    if (!resize) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Use state width instead of DOM offsetWidth to prevent jump
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
  }, [resize]);

  // Handle row click - memoized to prevent recreation
  const handleRowClick = React.useCallback((row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  }, [onRowClick]);

  // Build CSS classes
  const tableClasses = [
    styles.table,
    striped && styles.striped,
    bordered && styles.bordered,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    stickyHeader && styles.stickyHeader,
  ].filter(Boolean).join(' ');

  // Loading state
  if (loading) {
    return (
      <div className={containerClasses}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className={containerClasses}>
        <div className={styles.empty}>{emptyState}</div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={styles.tableWrapper}>
        <table className={tableClasses} aria-label={ariaLabel}>
          {/* COLGROUP - Apply widths here for consistent column sizing */}
          <colgroup>
            {selection && (
              <col className={styles.checkboxColumnWidth} />
            )}
            {columns.map((column) => {
              const width = resize?.columnWidths[column.id] 
                ?? (column.width ? parseFloat(column.width as string) : 150);
              return (
                <col
                  key={column.id}
                  style={{ width: `${width}px` }}
                />
              );
            })}
          </colgroup>

          <EnterpriseTableHeader
            columns={columns}
            selection={selection}
            sorting={sorting}
            resize={resize}
            onSort={handleSort}
            onResizeStart={handleResizeStart}
          />

          <EnterpriseTableBody
            data={data}
            columns={columns}
            selection={selection}
            onRowClick={onRowClick ? handleRowClick : undefined}
            expandedIds={expandedIds}
            renderExpandedRow={renderExpandedRow}
            getRowId={getRowId}
          />
        </table>
      </div>
    </div>
  );
}
