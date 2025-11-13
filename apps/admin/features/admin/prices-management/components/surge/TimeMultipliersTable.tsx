import React from 'react';
import { Clock } from 'lucide-react';
import { EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import styles from '../PricesManagementPage.module.css';

export type TimeRow = {
  id: string;
  label: string;
  value: number;
  start?: string | null;
  end?: string | null;
  active: boolean;
};

interface Props {
  rows: TimeRow[];
  onToggle: (id: string) => void;
}

export function TimeMultipliersTable({ rows, onToggle }: Props) {
  const columns: Column<TimeRow>[] = [
    { id: 'label', header: 'Period', accessor: (row) => row.label },
    {
      id: 'value',
      header: 'Multiplier',
      accessor: (row) => row.value,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{row.value}x</span>
      ),
    },
    {
      id: 'time',
      header: 'Time Range',
      accessor: () => '',
      cell: (row) => (
        <div className={styles.flexRow}>
          <Clock className="h-4 w-4" />
          {row.start && row.end ? `${row.start} - ${row.end}` : 'All day'}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.active,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.active ? styles.statusActive : styles.statusInactive}`}>
          {row.active ? '✓ Active' : '○ Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) => (
        <div className={styles.tableCellActions}>
          <label className={styles.toggleSwitch}>
            <input type="checkbox" checked={row.active} onChange={() => onToggle(row.id)} />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      ),
    },
  ];

  return <EnterpriseDataTable<TimeRow> columns={columns} data={rows} stickyHeader />;
}
