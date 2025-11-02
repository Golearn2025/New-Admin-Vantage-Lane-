/**
 * SearchFilter Component
 * 100% Reutilizabil - Quick search input
 */

'use client';

import React from 'react';
import { Search } from 'lucide-react';
import styles from './TableFilters.module.css';

interface SearchFilterProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchFilter({
  value = '',
  onChange,
  placeholder = 'Search...',
}: SearchFilterProps) {
  return (
    <div className={styles.filterItem}>
      <label className={styles.filterLabel}>
        <Search size={16} strokeWidth={2} />
        <span>Search</span>
      </label>
      <input
        type="text"
        className={styles.filterInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
