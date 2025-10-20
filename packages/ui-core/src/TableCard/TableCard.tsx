/**
 * TABLE CARD - PREMIUM UPGRADED
 * 
 * Full-featured table with:
 * - Sorting
 * - Pagination
 * - Bulk selection
 * - Bulk actions
 * - Responsive design
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { Badge } from '../Badge';
import styles from './TableCard.module.css';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableRow {
  id: string | number;
  [key: string]: string | number | React.ReactNode;
}

export interface BulkAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'default' | 'danger';
  onClick: (selectedIds: (string | number)[]) => void;
}

export interface TableCardProps {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Table columns */
  columns: TableColumn[];
  /** Table rows */
  rows: TableRow[];
  /** Enable pagination */
  enablePagination?: boolean;
  /** Rows per page */
  rowsPerPage?: number;
  /** Enable bulk selection */
  enableBulkSelection?: boolean;
  /** Bulk actions */
  bulkActions?: BulkAction[];
  /** Show "View all" link */
  showViewAll?: boolean;
  /** View all click handler */
  onViewAllClick?: () => void;
  /** Row click handler */
  onRowClick?: (row: TableRow, index: number) => void;
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined';
  /** Custom className */
  className?: string;
}

export function TableCard({
  title,
  subtitle,
  columns,
  rows,
  enablePagination = false,
  rowsPerPage = 10,
  enableBulkSelection = false,
  bulkActions = [],
  showViewAll = false,
  onViewAllClick,
  onRowClick,
  variant = 'elevated',
  className = '',
}: TableCardProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Handle column sort
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Sort and paginate rows
  const processedRows = useMemo(() => {
    let processed = [...rows];

    // Sort
    if (sortColumn) {
      processed.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    // Paginate
    if (enablePagination) {
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      processed = processed.slice(start, end);
    }

    return processed;
  }, [rows, sortColumn, sortDirection, currentPage, rowsPerPage, enablePagination]);

  // Pagination calculations
  const totalPages = enablePagination ? Math.ceil(rows.length / rowsPerPage) : 1;
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(processedRows.map(row => row.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = processedRows.length > 0 && processedRows.every(row => selectedIds.has(row.id));
  const isSomeSelected = processedRows.some(row => selectedIds.has(row.id)) && !isAllSelected;

  // Handle bulk action
  const handleBulkAction = (action: BulkAction) => {
    action.onClick(Array.from(selectedIds));
    setSelectedIds(new Set()); // Clear selection after action
  };

  return (
    <Card variant={variant} className={`${styles.card} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {/* Bulk Actions */}
        {enableBulkSelection && selectedIds.size > 0 && bulkActions.length > 0 && (
          <div className={styles.bulkActions}>
            <Badge color="theme" variant="soft">
              {selectedIds.size} selected
            </Badge>
            <div className={styles.bulkActionsButtons}>
              {bulkActions.map(action => (
                <button
                  key={action.id}
                  className={`${styles.bulkActionButton} ${
                    action.variant === 'danger' ? styles.bulkActionButtonDanger : ''
                  }`}
                  onClick={() => handleBulkAction(action)}
                  type="button"
                >
                  {action.icon && <Icon name={action.icon as any} size="sm" />}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {/* Bulk selection column */}
              {enableBulkSelection && (
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isSomeSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className={styles.checkbox}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${styles.th} ${styles[`align-${column.align || 'left'}`]} ${
                    column.sortable ? styles.thSortable : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className={styles.thContent}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className={styles.sortIcon}>
                        {sortColumn === column.key ? (
                          <Icon
                            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                            size="xs"
                            color="theme"
                          />
                        ) : (
                          <div className={styles.sortPlaceholder} />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedRows.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`${styles.tr} ${onRowClick ? styles.trClickable : ''} ${
                  selectedIds.has(row.id) ? styles.trSelected : ''
                }`}
                onClick={(e) => {
                  // Don't trigger row click if clicking checkbox
                  if ((e.target as HTMLElement).tagName !== 'INPUT') {
                    onRowClick?.(row, rowIndex);
                  }
                }}
              >
                {/* Bulk selection cell */}
                {enableBulkSelection && (
                  <td className={`${styles.td} ${styles.tdCheckbox}`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                      className={styles.checkbox}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`${styles.td} ${styles[`align-${column.align || 'left'}`]}`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty state */}
        {processedRows.length === 0 && (
          <div className={styles.emptyState}>
            <Icon name="inbox" size="xl" color="muted" />
            <p>No data available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {/* Pagination */}
        {enablePagination && rows.length > rowsPerPage && (
          <div className={styles.pagination}>
            <span className={styles.paginationInfo}>
              Page {currentPage} of {totalPages} ({rows.length} total)
            </span>
            <div className={styles.paginationButtons}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!canGoPrevious}
                type="button"
                aria-label="Previous page"
              >
                <Icon name="chevron-left" size="sm" />
              </button>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!canGoNext}
                type="button"
                aria-label="Next page"
              >
                <Icon name="chevron-right" size="sm" />
              </button>
            </div>
          </div>
        )}

        {/* View all link */}
        {showViewAll && (
          <button
            className={styles.viewAllButton}
            onClick={onViewAllClick}
            type="button"
          >
            View all
            <Icon name="arrow-right" size="sm" color="theme" />
          </button>
        )}
      </div>
    </Card>
  );
}
