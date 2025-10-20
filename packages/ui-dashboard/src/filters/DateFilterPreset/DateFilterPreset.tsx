/**
 * DateFilterPreset Component - 100% REUSABLE
 *
 * Quick select buttons for common date ranges
 * Used in dashboards, reports, analytics, etc.
 *
 * ZERO dependencies on app-specific logic
 */

'use client';

import { useState } from 'react';
import type { DatePreset, DateRange } from '../../utils/dateUtils';
import { getDateRangeForPreset } from '../../utils/dateUtils';
import styles from './DateFilterPreset.module.css';

export interface DateFilterPresetProps {
  /** Current selected preset */
  value?: DatePreset;

  /** Callback when preset changes */
  onChange: (preset: DatePreset, dateRange: DateRange) => void;

  /** Available presets to show */
  presets?: DatePreset[];

  /** Show "Custom" button */
  showCustom?: boolean;

  /** Variant style */
  variant?: 'default' | 'compact' | 'pills';

  /** Custom labels for presets */
  labels?: Partial<Record<DatePreset, string>>;
}

const DEFAULT_PRESETS: DatePreset[] = [
  'today',
  'yesterday',
  'last_7_days',
  'last_30_days',
  'this_month',
  'last_month',
  'this_year',
  'all_time',
];

const DEFAULT_LABELS: Record<DatePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This Week',
  last_week: 'Last Week',
  this_month: 'This Month',
  last_month: 'Last Month',
  this_quarter: 'This Quarter',
  last_quarter: 'Last Quarter',
  this_year: 'This Year',
  last_year: 'Last Year',
  last_7_days: 'Last 7 Days',
  last_30_days: 'Last 30 Days',
  last_90_days: 'Last 90 Days',
  last_365_days: 'Last 365 Days',
  all_time: 'All Time',
  custom: 'Custom Range',
};

export function DateFilterPreset({
  value = 'this_month',
  onChange,
  presets = DEFAULT_PRESETS,
  showCustom = true,
  variant = 'default',
  labels,
}: DateFilterPresetProps) {
  const [selected, setSelected] = useState<DatePreset>(value);

  const handlePresetClick = (preset: DatePreset) => {
    setSelected(preset);
    const dateRange = getDateRangeForPreset(preset);
    onChange(preset, dateRange);
  };

  const getLabel = (preset: DatePreset): string => {
    return labels?.[preset] || DEFAULT_LABELS[preset];
  };

  const allPresets = showCustom ? [...presets, 'custom' as DatePreset] : presets;

  return (
    <div className={`${styles.container} ${styles[`variant-${variant}`]}`}>
      {allPresets.map((preset) => (
        <button
          key={preset}
          type="button"
          className={`${styles.button} ${selected === preset ? styles.active : ''}`}
          onClick={() => handlePresetClick(preset)}
          aria-pressed={selected === preset}
        >
          {getLabel(preset)}
        </button>
      ))}
    </div>
  );
}
