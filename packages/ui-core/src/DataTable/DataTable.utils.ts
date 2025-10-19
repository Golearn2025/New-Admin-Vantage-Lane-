/**
 * DataTable Utility Functions
 * Pure helper functions for data processing
 */

import type { Column } from './types/index';

/**
 * Get row ID from data
 */
export function getRowId<TData>(row: TData, index: number): string {
  // Try common ID fields
  if (row && typeof row === 'object') {
    if ('id' in row && typeof row.id === 'string') return row.id;
    if ('id' in row && typeof row.id === 'number') return String(row.id);
    if ('key' in row && typeof row.key === 'string') return row.key;
    if ('_id' in row && typeof row._id === 'string') return row._id;
  }
  // Fallback to index
  return `row-${index}`;
}

/**
 * Check if column is sortable
 */
export function isColumnSortable<TData>(column: Column<TData>): boolean {
  return column.sortable !== false;
}

/**
 * Get visible columns
 */
export function getVisibleColumns<TData>(
  columns: Column<TData>[]
): Column<TData>[] {
  // For now, all columns are visible (hidden property not yet in Column type)
  return columns;
}

/**
 * Calculate column width
 */
export function getColumnWidth<TData>(column: Column<TData>): string {
  if (column.width) {
    if (typeof column.width === 'number') {
      return `${column.width}px`;
    }
    return column.width;
  }
  // Default width based on column type
  if (column.id === 'select') return '48px';
  if (column.id === 'actions') return '100px';
  return 'auto';
}

/**
 * Format cell value
 */
export function formatCellValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

/**
 * Check if table has selection
 */
export function hasSelectionColumn<TData>(columns: Column<TData>[]): boolean {
  return columns.some((col) => col.id === 'select');
}

/**
 * Get table state summary
 */
export function getTableStateSummary(
  totalItems: number,
  currentPage: number,
  pageSize: number
): {
  start: number;
  end: number;
  total: number;
} {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);
  
  return { start, end, total: totalItems };
}
