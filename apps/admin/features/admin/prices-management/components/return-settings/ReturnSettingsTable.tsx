import React, { useMemo } from 'react';
import { DataTable, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { ReturnSettings } from '@entities/pricing';
import styles from '../PricesManagementPage.module.css';

interface Props {
  settings: ReturnSettings;
  editedSettings: ReturnSettings;
  setEditedSettings: React.Dispatch<React.SetStateAction<ReturnSettings>>;
  isEditing: boolean;
}

type SettingRow = {
  id: 'discount_rate' | 'minimum_hours_between';
  setting: string;
  value: number | string;
  description: string;
};

export function ReturnSettingsTable({ settings, editedSettings, setEditedSettings, isEditing }: Props) {
  const tableData: SettingRow[] = useMemo(
    () => [
      {
        id: 'discount_rate',
        setting: 'Discount Rate',
        value: settings.discount_rate,
        description: 'Discount applied to return trips (outbound + return) × (1 - discount)',
      },
      {
        id: 'minimum_hours_between',
        setting: 'Minimum Hours Between',
        value: settings.minimum_hours_between,
        description: 'Minimum time required between outbound and return trips',
      },
    ],
    [settings]
  );

  const columns: Column<SettingRow>[] = useMemo(
    () => [
      { id: 'setting', header: 'Setting', accessor: (row) => row.setting, cell: (row) => <strong>{row.setting}</strong> },
      {
        id: 'value',
        header: 'Value',
        accessor: (row) => row.value,
        cell: (row) => {
          if (row.id === 'discount_rate') {
            return isEditing ? (
              <div className={styles.inputWithLabel}>
                <Input
                  type="number"
                  value={settings.discount_rate * 100}
                  onChange={(e) =>
                    setEditedSettings({
                      ...editedSettings,
                      discount_rate: Number(e.target.value) / 100,
                    })
                  }
                  min={0}
                  max={50}
                  step={1}
                  className={styles.inputNarrow}
                />
                <span>%</span>
              </div>
            ) : (
              <span className={`${styles.statusBadge} ${styles.statusBadgeSuccess}`}>
                {(settings.discount_rate * 100).toFixed(0)}%
              </span>
            );
          }
          if (row.id === 'minimum_hours_between') {
            return isEditing ? (
              <div className={styles.inputWithLabel}>
                <Input
                  type="number"
                  value={settings.minimum_hours_between}
                  onChange={(e) =>
                    setEditedSettings({
                      ...editedSettings,
                      minimum_hours_between: Number(e.target.value),
                    })
                  }
                  min={0}
                  max={48}
                  step={1}
                  className={styles.inputNarrow}
                />
                <span>hours</span>
              </div>
            ) : (
              `${settings.minimum_hours_between} hours`
            );
          }
          return null;
        },
      },
      { id: 'description', header: 'Description', accessor: (row) => row.description },
    ],
    [isEditing, settings, editedSettings, setEditedSettings]
  );

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Return Trip Settings</h3>
      <DataTable data={tableData} columns={columns} stickyHeader bordered ariaLabel="Return trip settings" />
    </div>
  );
}
