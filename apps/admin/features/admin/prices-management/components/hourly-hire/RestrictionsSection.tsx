import React, { useMemo } from 'react';
import { DataTable, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { HourlySettings } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  settings: HourlySettings;
  editedSettings: HourlySettings;
  setEditedSettings: React.Dispatch<React.SetStateAction<HourlySettings>>;
  isEditing: boolean;
}

type RestrictionRow = {
  id: 'min_hours' | 'max_hours' | 'distance_limit';
  setting: string;
  value: number | string;
  unit: string;
};

export function RestrictionsSection({ settings, editedSettings, setEditedSettings, isEditing }: Props) {
  const restrictionsData: RestrictionRow[] = useMemo(
    () => [
      { id: 'min_hours', setting: 'Min Hours', value: settings.minimum_hours, unit: 'h' },
      { id: 'max_hours', setting: 'Max Hours', value: settings.maximum_hours, unit: 'h' },
      { id: 'distance_limit', setting: 'Distance Limit', value: settings.distance_limit_per_hour, unit: 'mi/h' },
    ],
    [settings]
  );

  const restrictionsColumns: Column<RestrictionRow>[] = useMemo(
    () => [
      { id: 'setting', header: 'Setting', accessor: (row) => row.setting, cell: (row) => <strong>{row.setting}</strong> },
      {
        id: 'value',
        header: 'Value',
        accessor: (row) => row.value,
        cell: (row) => {
          if (!isEditing) return `${row.value}${row.unit}`;
          if (row.id === 'min_hours') {
            return (
              <Input
                type="number"
                value={settings.minimum_hours}
                onChange={(e) => setEditedSettings({ ...editedSettings, minimum_hours: Number(e.target.value) })}
                min={1}
                max={12}
              />
            );
          }
          if (row.id === 'max_hours') {
            return (
              <Input
                type="number"
                value={settings.maximum_hours}
                onChange={(e) => setEditedSettings({ ...editedSettings, maximum_hours: Number(e.target.value) })}
                min={1}
                max={24}
              />
            );
          }
          return (
            <Input
              type="number"
              value={settings.distance_limit_per_hour}
              onChange={(e) => setEditedSettings({ ...editedSettings, distance_limit_per_hour: Number(e.target.value) })}
              min={5}
              max={50}
              step={5}
            />
          );
        },
      },
    ],
    [isEditing, settings, editedSettings, setEditedSettings]
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Restrictions</h3>
      <DataTable
        data={restrictionsData}
        columns={restrictionsColumns}
        stickyHeader
        bordered
        ariaLabel="Hourly hire restrictions"
      />
    </div>
  );
}
