import type { VehicleTypeRates } from '@entities/pricing';
import type { Column } from '@vantage-lane/ui-core';
import { Button, Input } from '@vantage-lane/ui-core';
import { Car, Edit, Save, X } from 'lucide-react';
import React from 'react';
import styles from '../PricesManagementPage.module.css';

export type VehicleRow = {
  id: string;
  name: string;
  baseFare: number;
  perMileFirst6: number;
  perMileAfter6: number;
  perMinute: number;
  minimumFare: number;
  hourlyInTown: number;
  hourlyOutTown: number;
  editing?: boolean;
  original?: VehicleTypeRates;
};

export function createVehicleColumns(params: {
  vehicleTypes: [string, VehicleTypeRates][];
  editingType: string | null;
  editedRates: Partial<VehicleTypeRates>;
  setEditedRates: React.Dispatch<React.SetStateAction<Partial<VehicleTypeRates>>>;
  isSaving: boolean;
  onStartEdit: (type: string, rates: VehicleTypeRates) => void;
  onSave: (type: string) => Promise<void>;
  onCancel: () => void;
}): Column<VehicleRow>[] {
  const { vehicleTypes, editingType, editedRates, setEditedRates, isSaving, onStartEdit, onSave, onCancel } = params;

  return [
    {
      id: 'name',
      header: 'Vehicle Type',
      accessor: (row) => row.name,
      cell: (row) => (
        <div className={styles.flexRow}>
          <Car className="h-4 w-4" />
          {row.name}
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
      id: 'minimum',
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
      id: 'hourlyInTown',
      header: 'Hourly (Town)',
      accessor: (row) => row.hourlyInTown,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.hourly_in_town ?? row.hourlyInTown}
            onChange={(e) => setEditedRates({ ...editedRates, hourly_in_town: Number(e.target.value) })}
            min={0}
            step={5}
          />
        ) : (
          `£${row.hourlyInTown}`
        ),
    },
    {
      id: 'hourlyOutTown',
      header: 'Hourly (Out)',
      accessor: (row) => row.hourlyOutTown,
      cell: (row) =>
        editingType === row.id ? (
          <Input
            type="number"
            value={editedRates.hourly_out_town ?? row.hourlyOutTown}
            onChange={(e) => setEditedRates({ ...editedRates, hourly_out_town: Number(e.target.value) })}
            min={0}
            step={5}
          />
        ) : (
          `£${row.hourlyOutTown}`
        ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: () => '',
      cell: (row) =>
        editingType === row.id ? (
          <div className={styles.buttonGroup}>
            <Button variant="primary" size="sm" onClick={() => onSave(row.id)} disabled={isSaving}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Edit button clicked
              const vehicleType = vehicleTypes.find(([type]) => type === row.id);
              if (vehicleType) {
                // Vehicle type found - proceed with edit
                onStartEdit(row.id, vehicleType[1]);
              } else {
                // Vehicle type not found - skip edit
              }
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        ),
    },
  ];
}
