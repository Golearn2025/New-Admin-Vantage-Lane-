import React from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Plane, Save, X, Edit } from 'lucide-react';
import type { AirportFee } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

export type AirportRow = {
  id: string;
  name: string;
  code: string;
  pickupFee: number;
  dropoffFee: number;
  freeWaitMinutes: number;
};

export function createAirportColumns(params: {
  editingAirport: string | null;
  editedFee: Partial<AirportFee>;
  setEditedFee: React.Dispatch<React.SetStateAction<Partial<AirportFee>>>;
  handleSave: (code: string) => Promise<void>;
  handleCancel: () => void;
  isSaving: boolean;
  onStartEdit: (code: string, fee: AirportFee) => void;
}): Column<AirportRow>[] {
  const { editingAirport, editedFee, setEditedFee, handleSave, handleCancel, isSaving, onStartEdit } = params;

  return [
    {
      id: 'name',
      header: 'Airport',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.flexRow}>
          <Plane className="h-4 w-4" />
          {row.name}
        </div>
      ),
    },
    { id: 'code', header: 'Code', accessor: (row) => row.code, cell: (row) => (
      <span className={`${styles.statusBadge} ${styles.statusBadgePrimary}`}>{row.code}</span>
    ) },
    {
      id: 'pickupFee',
      header: 'Pickup Fee',
      accessor: (row) => row.pickupFee,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.pickup_fee ?? row.pickupFee}
            onChange={(e) => setEditedFee({ ...editedFee, pickup_fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.pickupFee}`
        ),
    },
    {
      id: 'dropoffFee',
      header: 'Dropoff Fee',
      accessor: (row) => row.dropoffFee,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.dropoff_fee ?? row.dropoffFee}
            onChange={(e) => setEditedFee({ ...editedFee, dropoff_fee: Number(e.target.value) })}
            min={0}
            step={0.5}
          />
        ) : (
          `£${row.dropoffFee}`
        ),
    },
    {
      id: 'freeWaitMinutes',
      header: 'Free Wait (min)',
      accessor: (row) => row.freeWaitMinutes,
      cell: (row) =>
        editingAirport === row.id ? (
          <Input
            type="number"
            value={editedFee.free_wait_minutes ?? row.freeWaitMinutes}
            onChange={(e) => setEditedFee({ ...editedFee, free_wait_minutes: Number(e.target.value) })}
            min={0}
            step={5}
          />
        ) : (
          `${row.freeWaitMinutes} min`
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingAirport === row.id ? (
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
                pickup_fee: row.pickupFee,
                dropoff_fee: row.dropoffFee,
                free_wait_minutes: row.freeWaitMinutes,
              })
            }
          >
            <Edit className="h-4 w-4" />
          </Button>
        ),
    },
  ];
}
