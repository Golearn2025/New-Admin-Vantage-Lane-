import React from 'react';
import { PartyPopper, Trash2 } from 'lucide-react';
import { EnterpriseDataTable, Input, Button } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import styles from '../PricesManagementPage.module.css';

export type EventRow = { id: string; label: string; value: number; active: boolean };

interface Props {
  rows: EventRow[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, field: string, val: any) => void;
  onDelete: (id: string) => void;
}

export function EventMultipliersTable({ rows, isEditing, onToggle, onUpdate, onDelete }: Props) {
  const columns: Column<EventRow>[] = [
    {
      id: 'label', header: 'Event', accessor: (row) => row.label,
      cell: (row) => isEditing
        ? <Input type="text" value={row.label} onChange={(e: any) => onUpdate(row.id, 'label', e.target.value)} />
        : (<div className={styles.flexRow}><PartyPopper className="h-4 w-4" /><strong>{row.label}</strong></div>),
    },
    {
      id: 'value', header: 'Multiplier', accessor: (row) => row.value,
      cell: (row) => isEditing
        ? <Input type="number" value={row.value} onChange={(e: any) => onUpdate(row.id, 'value', parseFloat(e.target.value))} min={1} max={3} step={0.05} />
        : <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{row.value}x</span>,
    },
    {
      id: 'status', header: 'Status', accessor: (row) => row.active,
      cell: (row) => (
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={row.active} onChange={() => onToggle(row.id)} />
          <span className={styles.toggleSlider}></span>
        </label>
      ),
    },
    {
      id: 'actions', header: '', accessor: () => '',
      cell: (row) => isEditing ? (
        <Button variant="secondary" onClick={() => onDelete(row.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null,
    },
  ];

  return <EnterpriseDataTable<EventRow> columns={columns} data={rows} stickyHeader />;
}
