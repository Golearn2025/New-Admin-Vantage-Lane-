/**
 * TableFilters Component
 * 100% Reutilizabil - Composable filter system
 */

'use client';

import React from 'react';
import { X } from 'lucide-react';
import { StatusFilter } from './StatusFilter';
import { SearchFilter } from './SearchFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { AmountRangeFilter } from './AmountRangeFilter';
import type { TableFiltersProps } from './types';
import styles from './TableFilters.module.css';

export function TableFilters({
  statusOptions,
  statusValue,
  onStatusChange,
  showDateRange,
  dateRange,
  onDateRangeChange,
  showAmountRange,
  amountRange,
  onAmountRangeChange,
  showSearch,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onClearAll,
}: TableFiltersProps) {
  const hasActiveFilters =
    statusValue ||
    searchValue ||
    dateRange?.from ||
    dateRange?.to ||
    amountRange?.min ||
    amountRange?.max;

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {/* Status Filter */}
        {statusOptions && statusOptions.length > 0 && onStatusChange && (
          <StatusFilter
            options={statusOptions}
            value={statusValue ?? ''}
            onChange={onStatusChange}
          />
        )}

        {/* Date Range Filter */}
        {showDateRange && dateRange && onDateRangeChange && (
          <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
        )}

        {/* Amount Range Filter */}
        {showAmountRange && amountRange && onAmountRangeChange && (
          <AmountRangeFilter
            value={amountRange}
            onChange={onAmountRangeChange}
          />
        )}

        {/* Search Filter */}
        {showSearch && onSearchChange && (
          <SearchFilter
            value={searchValue ?? ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder ?? 'Search...'}
          />
        )}
      </div>

      {/* Clear All Button */}
      {hasActiveFilters && onClearAll && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearAll}
        >
          <X size={16} strokeWidth={2} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}
