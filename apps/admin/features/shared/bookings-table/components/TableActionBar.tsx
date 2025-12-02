'use client';

import { Button } from '@vantage-lane/ui-core';
import { RefreshCw, Download, Filter } from 'lucide-react';
import React, { useMemo } from 'react';
import styles from './BookingsTable.module.css';

interface TableActionBarProps {
  loading: boolean;
  showStatusFilter: boolean;
  selectedStatus: string;
  onRefresh: () => void;
  onStatusChange: (status: string) => void;
  statusFilterOptions?: string[]; // Optional: limit dropdown options
}

export function TableActionBar({
  loading,
  showStatusFilter,
  selectedStatus,
  onRefresh,
  onStatusChange,
  statusFilterOptions,
}: TableActionBarProps) {
  const STATUS_OPTIONS = ['all', 'pending', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'];
  const defaultStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'en_route', label: 'En Route' },
    { value: 'arrived', label: 'Arrived' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // If statusFilterOptions provided, convert to proper format
  const availableOptions = statusFilterOptions 
    ? statusFilterOptions.map(status => ({ value: status, label: status }))
    : defaultStatusOptions;

  // Memoize option elements to prevent re-creation on every render
  const optionElements = useMemo(() => 
    availableOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), 
    [availableOptions]
  );

  return (
    <div className={styles.actionBar}>
      <div className={styles.actionBarLeft}>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw size={16} />}
          onClick={onRefresh}
          disabled={loading}
          loading={loading}
        >
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download size={16} />}
          onClick={() => console.log('Export')}
        >
          Export
        </Button>
      </div>

      {showStatusFilter && (
        <div className={styles.actionBarRight}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            rightIcon={<span className={styles.filterBadge}>{selectedStatus !== 'all' ? '1' : ''}</span>}
          >
            Filter
          </Button>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={styles.select}
          >
            {optionElements}
          </select>
        </div>
      )}
    </div>
  );
}
