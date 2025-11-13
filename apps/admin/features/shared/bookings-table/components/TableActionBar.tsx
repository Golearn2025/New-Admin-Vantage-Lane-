'use client';

import { Button } from '@vantage-lane/ui-core';
import { RefreshCw, Download, Filter } from 'lucide-react';
import styles from './BookingsTable.module.css';

interface TableActionBarProps {
  loading: boolean;
  showStatusFilter: boolean;
  selectedStatus: string;
  onRefresh: () => void;
  onStatusChange: (status: string) => void;
}

export function TableActionBar({
  loading,
  showStatusFilter,
  selectedStatus,
  onRefresh,
  onStatusChange,
}: TableActionBarProps) {
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="en_route">En Route</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}
    </div>
  );
}
