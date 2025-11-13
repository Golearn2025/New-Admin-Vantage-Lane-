import React, { useMemo } from 'react';
import { DataTable, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Car, Sparkles, Bus, Truck } from 'lucide-react';
import type { HourlySettings } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  settings: HourlySettings;
  editedSettings: HourlySettings;
  setEditedSettings: React.Dispatch<React.SetStateAction<HourlySettings>>;
  isEditing: boolean;
}

type RateRow = {
  id: keyof HourlySettings['rates'];
  vehicle: string;
  icon: React.ReactNode;
  rate: number;
};

export function HourlyRatesSection({ settings, editedSettings, setEditedSettings, isEditing }: Props) {
  const ratesData: RateRow[] = useMemo(
    () => [
      { id: 'executive', vehicle: 'Executive', icon: <Car className="h-4 w-4" />, rate: settings.rates.executive },
      { id: 'luxury', vehicle: 'Luxury', icon: <Sparkles className="h-4 w-4" />, rate: settings.rates.luxury },
      { id: 'van', vehicle: 'Van', icon: <Bus className="h-4 w-4" />, rate: settings.rates.van },
      { id: 'suv', vehicle: 'SUV', icon: <Truck className="h-4 w-4" />, rate: settings.rates.suv },
    ],
    [settings]
  );

  const ratesColumns: Column<RateRow>[] = useMemo(
    () => [
      {
        id: 'vehicle',
        header: 'Vehicle',
        accessor: (row) => row.vehicle,
        cell: (row) => (
          <div className={styles.flexRow}>
            {row.icon}
            <strong>{row.vehicle}</strong>
          </div>
        ),
      },
      {
        id: 'rate',
        header: 'Rate',
        accessor: (row) => row.rate,
        cell: (row) =>
          isEditing ? (
            <Input
              type="number"
              value={row.rate}
              onChange={(e) =>
                setEditedSettings({
                  ...editedSettings,
                  rates: { ...editedSettings.rates, [row.id]: Number(e.target.value) },
                })
              }
              min={50}
              max={200}
              step={5}
            />
          ) : (
            `£${row.rate}/hour`
          ),
      },
    ],
    [isEditing, editedSettings, setEditedSettings]
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Hourly Rates</h3>
      <DataTable
        data={ratesData}
        columns={ratesColumns}
        stickyHeader
        bordered
        ariaLabel="Hourly rates by vehicle type"
      />
    </div>
  );
}
