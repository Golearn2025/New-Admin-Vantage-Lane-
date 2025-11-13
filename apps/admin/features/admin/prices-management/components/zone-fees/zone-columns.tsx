import React from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { OctagonAlert, Route, Save, X, Edit } from 'lucide-react';
import type { ZoneFee } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

export type ZoneRow = {
  id: string;
  name: string;
  code: string;
  fee: number;
  type: 'congestion' | 'toll';
};

export function createZoneColumns(params: {
  editingZone: string | null;
  editedFee: Partial<ZoneFee>;
  setEditedFee: React.Dispatch<React.SetStateAction<Partial<ZoneFee>>>;
  handleSave: (code: string) => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  onStartEdit: (code: string, fee: ZoneFee) => void;
}): Column<ZoneRow>[] {
  const { editingZone, editedFee, setEditedFee, handleSave, handleCancel, isSaving, onStartEdit } = params;

  const getZoneIcon = (type: string) => {
    return type === 'congestion' ? <OctagonAlert className="h-4 w-4" /> : <Route className="h-4 w-4" />;
  };

  return [
    {
      id: 'name',
      header: 'Zone/Road',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.flexRow}>
          {getZoneIcon(row.type)}
          {row.name}
        </div>
      ),
    },
    {
      id: 'code',
      header: 'Code',
      accessor: (row) => row.code,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.type === 'congestion' ? styles.statusBadgeWarning : styles.statusBadgeSuccess}`}>
          {row.code}
        </span>
      ),
    },
    {
      id: 'fee',
      header: 'Fee',
      accessor: (row) => row.fee,
      cell: (row) =>
        editingZone === row.id ? (
          <Input
            type="number"
            value={editedFee.fee ?? row.fee}
            onChange={(e) => setEditedFee({ ...editedFee, fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.fee.toFixed(2)}`
        ),
    },
    {
      id: 'type',
      header: 'Type',
      accessor: (row) => row.type,
      cell: (row) => (
        <span className={`${styles.statusBadge} ${row.type === 'congestion' ? styles.statusBadgeInfo : styles.statusBadgeSuccess}`}>
          {row.type === 'congestion' ? 'Congestion' : 'Toll'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingZone === row.id ? (
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="sm" onClick={() => handleSave(row.id)} disabled={isSaving}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onStartEdit(row.id, {
                name: row.name,
                fee: row.fee,
                type: row.type,
              } as ZoneFee)
            }
          >
            <Edit className="h-4 w-4" />
          </Button>
        ),
    },
  ];
}
