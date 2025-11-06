import React from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Save, Edit, X, Car } from 'lucide-react';
import type { VehicleTypeRates } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

export type VehicleRow = {
  id: string;
  name: string;
  baseFare: number;
  perMileFirst6: number;
  perMileAfter6: number;
  perMinute: number;
  minimumFare: number;
};

export function createVehicleColumns(params: {
  editingType: string | null;
  editedRates: Partial<VehicleTypeRates>;
  setEditedRates: React.Dispatch<React.SetStateAction<Partial<VehicleTypeRates>>>;
  setEditingType: React.Dispatch<React.SetStateAction<string | null>>;
  handleSave: (type: string) => Promise<void>;
  handleCancel: () => void;
  vehicleTypes: [string, VehicleTypeRates][];
  isSaving: boolean;
  onStartEdit: (type: string, rates: VehicleTypeRates) => void;
}): Column<VehicleRow>[] {
  const { editingType, editedRates, setEditedRates, handleSave, handleCancel, vehicleTypes, isSaving, onStartEdit } = params;

  return [
    {
      id: 'name',
      header: 'Vehicle Type',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.vehicleCell}>
          <Car className="h-4 w-4" />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      id: 'baseFare',
      header: 'Base Fare',
      accessor: (row) => row.baseFare,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.base_fare ?? row.baseFare}
            onChange={(e) => setEditedRates({ ...editedRates, base_fare: Number(e.target.value) })}
            min={0}
            step={1}
          />
        ) : (
          `£${row.baseFare}`
        ),
    },
    {
      id: 'perMileFirst6',
      header: 'Per Mile (1-6)',
      accessor: (row) => row.perMileFirst6,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.per_mile_first_6 ?? row.perMileFirst6}
            onChange={(e) => setEditedRates({ ...editedRates, per_mile_first_6: Number(e.target.value) })}
            min={0}
            step={0.1}
          />
        ) : (
          `£${row.perMileFirst6}`
        ),
    },
    {
      id: 'perMileAfter6',
      header: 'Per Mile (6+)',
      accessor: (row) => row.perMileAfter6,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.per_mile_after_6 ?? row.perMileAfter6}
            onChange={(e) => setEditedRates({ ...editedRates, per_mile_after_6: Number(e.target.value) })}
            min={0}
            step={0.1}
          />
        ) : (
          `£${row.perMileAfter6}`
        ),
    },
    {
      id: 'perMinute',
      header: 'Per Minute',
      accessor: (row) => row.perMinute,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.per_minute ?? row.perMinute}
            onChange={(e) => setEditedRates({ ...editedRates, per_minute: Number(e.target.value) })}
            min={0}
            step={0.01}
          />
        ) : (
          `£${row.perMinute}`
        ),
    },
    {
      id: 'minimumFare',
      header: 'Minimum',
      accessor: (row) => row.minimumFare,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.minimum_fare ?? row.minimumFare}
            onChange={(e) => setEditedRates({ ...editedRates, minimum_fare: Number(e.target.value) })}
            min={0}
            step={1}
          />
        ) : (
          `£${row.minimumFare}`
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingType === row.id ? (
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="sm" onClick={() => handleSave(row.id)} disabled={isSaving}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" /> Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const vehicleType = vehicleTypes.find(([type]) => type === row.id);
              if (vehicleType) onStartEdit(row.id, vehicleType[1]);
            }}
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
        ),
    },
  ];
}
