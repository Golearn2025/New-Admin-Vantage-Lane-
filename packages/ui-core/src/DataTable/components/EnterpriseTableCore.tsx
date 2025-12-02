/**
 * EnterpriseTableCore Component
 * Core table rendering logic - extracted for modularity
 * RULES COMPLIANCE: < 200 lines, < 50 lines per function
 */

'use client';

import React from 'react';
import styles from '../DataTable.module.css';
import type { UseColumnResizeReturn, UseSelectionReturn, UseSortingReturn } from '../hooks';
import type { Column } from '../types/index';
import { EnterpriseTableBody } from './EnterpriseTableBody';
import { EnterpriseTableHeader } from './EnterpriseTableHeader';

export interface EnterpriseTableCoreProps<T = object> {
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
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Striped rows */
  striped?: boolean;
  /** Bordered table */
  bordered?: boolean;
  /** ARIA label */
  ariaLabel?: string;
  /** Expanded row IDs */
  expandedIds?: Set<string>;
  /** Render expanded row content */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /** Get row ID for expanded rows */
  getRowId?: (row: T) => string;
  /** Get custom className for row */
  getRowClassName?: (row: T) => string;
}

export function EnterpriseTableCore<T = object>({
  data,
  columns,
  selection,
  sorting,
  resize,
  onRowClick,
  striped = false,
  bordered = false,
  ariaLabel = 'Data table',
  expandedIds,
  renderExpandedRow,
  getRowId,
  getRowClassName,
}: EnterpriseTableCoreProps<T>): React.ReactElement {
  // Handle column sort - memoized to prevent recreation
  const handleSort = React.useCallback(
    (columnId: string) => {
      if (sorting) {
        sorting.toggleSort(columnId);
      }
    },
    [sorting]
  );

  // Handle column resize start - memoized to prevent recreation
  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent, columnId: string) => {
      if (!resize) return;

      e.preventDefault();
      e.stopPropagation();

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
    },
    [resize]
  );

  // Handle row click - memoized to prevent recreation
  const handleRowClick = React.useCallback(
    (row: T) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  // Build CSS classes
  const tableClasses = [styles.table, striped && styles.striped, bordered && styles.bordered]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.tableWrapper}>
      <table className={tableClasses} aria-label={ariaLabel}>
        {/* COLGROUP - Apply widths here for consistent column sizing */}
        <colgroup>
          {selection && <col className={styles.checkboxColumnWidth} />}
          {columns.map((column) => {
            const width =
              resize?.columnWidths[column.id] ??
              (column.width ? parseFloat(column.width as string) : 150);
            return <col key={column.id} style={{ width: `${width}px` }} />;
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
          getRowClassName={getRowClassName}
        />
      </table>
    </div>
  );
}
