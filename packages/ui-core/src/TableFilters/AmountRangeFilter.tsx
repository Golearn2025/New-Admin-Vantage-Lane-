/**
 * AmountRangeFilter Component
 * 100% Reutilizabil - Min/Max amount filter
 */

'use client';

import React from 'react';
import { PoundSterling } from 'lucide-react';
import type { AmountRange } from './types';
import styles from './TableFilters.module.css';

interface AmountRangeFilterProps {
  value: AmountRange;
  onChange: (range: AmountRange) => void;
  label?: string;
  currency?: string;
}

export function AmountRangeFilter({
  value,
  onChange,
  label = 'Amount Range',
  currency = '£',
}: AmountRangeFilterProps) {
  const handleMinChange = (val: string) => {
    onChange({
      ...value,
      min: val ? parseFloat(val) : null,
    });
  };

  const handleMaxChange = (val: string) => {
    onChange({
      ...value,
      max: val ? parseFloat(val) : null,
    });
  };

  return (
    <div className={styles.filterItem}>
      <label className={styles.filterLabel}>
        <PoundSterling size={16} strokeWidth={2} />
        <span>{label}</span>
      </label>
      <div className={styles.amountRangeInputs}>
        <input
          type="number"
          className={styles.filterInput}
          placeholder={`Min ${currency}`}
          value={value.min ?? ''}
          onChange={(e) => handleMinChange(e.target.value)}
          min="0"
          step="0.01"
        />
        <span className={styles.amountRangeSeparator}>to</span>
        <input
          type="number"
          className={styles.filterInput}
          placeholder={`Max ${currency}`}
          value={value.max ?? ''}
          onChange={(e) => handleMaxChange(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
}
