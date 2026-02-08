import type { Column } from '@vantage-lane/ui-core';
import { Button, EnterpriseDataTable, Input } from '@vantage-lane/ui-core';
import { Clock, Trash2 } from 'lucide-react';
import styles from '../PricesManagementPage.module.css';

export type TimeRow = {
  id: string;
  label: string;
  value: number;
  start?: string | null;
  end?: string | null;
  days?: number[] | undefined;
  active: boolean;
};

interface Props {
  rows: TimeRow[];
  isEditing: boolean;
  onToggle: (id: string) => void;
  onUpdate: (id: string, field: string, val: any) => void;
  onDelete: (id: string) => void;
}

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function DaysDisplay({ days }: { days?: number[] | undefined }) {
  if (!days || days.length === 0 || days.length === 7) return <span>All days</span>;
  return <span>{days.map(d => DAY_LABELS[d]).join(', ')}</span>;
}

export function TimeMultipliersTable({ rows, isEditing, onToggle, onUpdate, onDelete }: Props) {
  const columns: Column<TimeRow>[] = [
    {
      id: 'label', header: 'Period', accessor: (r) => r.label,
      cell: (r) => isEditing
        ? <Input type="text" value={r.label} onChange={(e: any) => onUpdate(r.id, 'label', e.target.value)} />
        : <strong>{r.label}</strong>,
    },
    {
      id: 'value', header: 'Multiplier', accessor: (r) => r.value,
      cell: (r) => isEditing
        ? <Input type="number" value={r.value} onChange={(e: any) => onUpdate(r.id, 'value', parseFloat(e.target.value))} min={1} max={3} step={0.05} />
        : <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{r.value}x</span>,
    },
    {
      id: 'time', header: 'Time Range', accessor: () => '',
      cell: (r) => isEditing ? (
        <div className={styles.flexRow}>
          <Input type="time" value={r.start || ''} onChange={(e: any) => onUpdate(r.id, 'start_time', e.target.value || null)} />
          <span>-</span>
          <Input type="time" value={r.end || ''} onChange={(e: any) => onUpdate(r.id, 'end_time', e.target.value || null)} />
        </div>
      ) : (
        <div className={styles.flexRow}>
          <Clock className="h-4 w-4" />
          {r.start && r.end ? `${r.start} - ${r.end}` : 'All day'}
        </div>
      ),
    },
    {
      id: 'days', header: 'Days', accessor: () => '',
      cell: (r) => <DaysDisplay days={r.days} />,
    },
    {
      id: 'status', header: 'Status', accessor: (r) => r.active,
      cell: (r) => (
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={r.active} onChange={() => onToggle(r.id)} />
          <span className={styles.toggleSlider}></span>
        </label>
      ),
    },
    {
      id: 'actions', header: '', accessor: () => '',
      cell: (r) => isEditing ? (
        <Button variant="secondary" onClick={() => onDelete(r.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null,
    },
  ];

  return <EnterpriseDataTable<TimeRow> columns={columns} data={rows} stickyHeader />;
}
