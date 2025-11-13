import React from 'react';
import { PartyPopper } from 'lucide-react';
import { EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import styles from '../PricesManagementPage.module.css';

export type EventRow = { id: string; label: string; value: number; active: boolean };

interface Props {
  rows: EventRow[];
}

export function EventMultipliersTable({ rows }: Props) {
  const columns: Column<EventRow>[] = [
    {
      id: 'label',
      header: 'Event',
      accessor: (row) => row.label,
      cell: (row) => (
        <div className={styles.flexRow}>
          <PartyPopper className="h-4 w-4" />
          {row.label}
        </div>
      ),
    },
    {
      id: 'value',
      header: 'Multiplier',
      accessor: (row) => row.value,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{row.value}x</span>
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
            <input type="checkbox" checked={row.active} disabled />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      ),
    },
  ];

  return <EnterpriseDataTable<EventRow> columns={columns} data={rows} stickyHeader />;
}
