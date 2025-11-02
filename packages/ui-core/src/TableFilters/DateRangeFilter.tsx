/**
 * DateRangeFilter Component
 * 100% Reutilizabil - Date range picker
 */

'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import type { DateRange } from './types';
import styles from './TableFilters.module.css';

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
}

export function DateRangeFilter({
  value,
  onChange,
  label = 'Date Range',
}: DateRangeFilterProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleFromChange = (dateStr: string) => {
    onChange({
      ...value,
      from: dateStr ? new Date(dateStr) : null,
    });
  };

  const handleToChange = (dateStr: string) => {
    onChange({
      ...value,
      to: dateStr ? new Date(dateStr) : null,
    });
  };

  return (
    <div className={styles.filterItem}>
      <label className={styles.filterLabel}>
        <Calendar size={16} strokeWidth={2} />
        <span>{label}</span>
      </label>
      <div className={styles.dateRangeInputs}>
        <input
          type="date"
          className={styles.filterInput}
          value={formatDate(value.from)}
          onChange={(e) => handleFromChange(e.target.value)}
        />
        <span className={styles.dateRangeSeparator}>to</span>
        <input
          type="date"
          className={styles.filterInput}
          value={formatDate(value.to)}
          onChange={(e) => handleToChange(e.target.value)}
        />
      </div>
    </div>
  );
}
