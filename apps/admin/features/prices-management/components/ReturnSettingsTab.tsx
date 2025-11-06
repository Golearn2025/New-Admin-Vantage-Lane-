/**
 * Return Settings Tab Component
 * 
 * Configure return trip discount and policies
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, DataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Save, Edit } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, ReturnSettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function ReturnSettingsTab({ config }: Props) {
  const { updateReturnSettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaultSettings: ReturnSettings = { discount_rate: 0.10, minimum_hours_between: 2 };

  const [editedSettings, setEditedSettings] = useState<ReturnSettings>(
    config.return_settings || defaultSettings
  );

  const handleSave = async () => {
    try {
      await updateReturnSettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedSettings(config.return_settings || defaultSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : (config.return_settings || editedSettings);

  // Transform data for DataTable
  type SettingRow = {
    id: string;
    setting: string;
    value: number | string;
    description: string;
  };

  const tableData: SettingRow[] = useMemo(() => [
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
  ], [settings]);

  const columns: Column<SettingRow>[] = useMemo(() => [
    {
      id: 'setting',
      header: 'Setting',
      accessor: (row) => row.setting,
      cell: (row) => <strong>{row.setting}</strong>,
    },
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
          ) : `${settings.minimum_hours_between} hours`;
        }
        return null;
      },
    },
    {
      id: 'description',
      header: 'Description',
      accessor: (row) => row.description,
    },
  ], [isEditing, settings, editedSettings]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Return Trip Settings</h2>
      <p className={styles.sectionDescription}>
        Configure return trip discount and minimum time between trips
      </p>

      {/* Return Discount */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Return Trip Settings</h3>
        <DataTable
          data={tableData}
          columns={columns}
          stickyHeader
          bordered
          ariaLabel="Return trip settings"
        />
      </div>

      {/* Actions */}
      <div className={styles.actionsContainer}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" /> Save Changes
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Return Trip Mayfair ↔ Heathrow</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Outbound (Mayfair → LHR):</span>
          <span className={styles.exampleValue}>£130.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Return (LHR → Mayfair):</span>
          <span className={styles.exampleValue}>£130.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Subtotal:</span>
          <span className={styles.exampleValue}>£260.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Return Discount ({(settings.discount_rate * 100).toFixed(0)}%):</span>
          <span className={styles.exampleValue}>
            -£{(260 * settings.discount_rate).toFixed(2)}
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Final Price:</span>
          <span className={styles.exampleValue}>
            £{(260 * (1 - settings.discount_rate)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
