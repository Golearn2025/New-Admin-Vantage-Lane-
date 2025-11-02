/**
 * StatusFilter Component
 * 100% Reutilizabil - Generic status dropdown
 */

'use client';

import React from 'react';
import { Filter } from 'lucide-react';
import type { FilterOption } from './types';
import styles from './TableFilters.module.css';

interface StatusFilterProps {
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export function StatusFilter({
  options,
  value = '',
  onChange,
  label = 'Status',
}: StatusFilterProps) {
  return (
    <div className={styles.filterItem}>
      <label className={styles.filterLabel}>
        <Filter size={16} strokeWidth={2} />
        <span>{label}</span>
      </label>
      <select
        className={styles.filterSelect}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
