/**
 * Hourly Hire Tab Component
 * 
 * Configure hourly hire rates and restrictions
 * Architecture: Feature component (UI only, no business logic)
 * MAX 200 lines per RULES.md
 */

'use client';

import React, { useState } from 'react';
import { Button, Input } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

interface HourlyRates {
  executive: number;
  luxury: number;
  van: number;
  suv: number;
}

interface HourlySettings {
  rates: HourlyRates;
  minimum_hours: number;
  maximum_hours: number;
  distance_limit_per_hour: number;
  area_restriction: string;
}

export function HourlyHireTab({ config }: Props) {
  const { updateHourlySettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<HourlySettings>(
    (config as any).hourly_settings || {
      rates: { executive: 80, luxury: 90, van: 90, suv: 110 },
      minimum_hours: 3,
      maximum_hours: 12,
      distance_limit_per_hour: 15,
      area_restriction: 'm25'
    }
  );

  const handleSave = async () => {
    try {
      await updateHourlySettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedSettings((config as any).hourly_settings || editedSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : ((config as any).hourly_settings || editedSettings);

  const renderRateRow = (type: keyof HourlyRates, label: string, icon: string) => (
    <tr className={styles.tableRow}>
      <td className={`${styles.tableCell} ${styles.tableCellBold}`}>{icon} {label}</td>
      <td className={styles.tableCell}>
        {isEditing ? (
          <Input
            type="number"
            value={settings.rates[type]}
            onChange={(e) => setEditedSettings({
              ...editedSettings,
              rates: { ...editedSettings.rates, [type]: Number(e.target.value) }
            })}
            min={50}
            max={200}
            step={5}
          />
        ) : (
          `£${settings.rates[type]}/hour`
        )}
      </td>
    </tr>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Hourly Hire Settings</h2>

      {/* Rates */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>💰 Hourly Rates</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Vehicle</th>
              <th className={styles.tableHeaderCell}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {renderRateRow('executive', 'Executive', '🚗')}
            {renderRateRow('luxury', 'Luxury', '✨')}
            {renderRateRow('van', 'Van', '🚐')}
            {renderRateRow('suv', 'SUV', '🚙')}
          </tbody>
        </table>
      </div>

      {/* Restrictions */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⚠️ Restrictions</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Setting</th>
              <th className={styles.tableHeaderCell}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={styles.tableCell}>Min Hours</td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <Input type="number" value={settings.minimum_hours}
                    onChange={(e) => setEditedSettings({...editedSettings, minimum_hours: Number(e.target.value)})}
                    min={1} max={12} />
                ) : `${settings.minimum_hours}h`}
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableCell}>Max Hours</td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <Input type="number" value={settings.maximum_hours}
                    onChange={(e) => setEditedSettings({...editedSettings, maximum_hours: Number(e.target.value)})}
                    min={1} max={24} />
                ) : `${settings.maximum_hours}h`}
              </td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableCell}>Distance Limit</td>
              <td className={styles.tableCell}>
                {isEditing ? (
                  <Input type="number" value={settings.distance_limit_per_hour}
                    onChange={(e) => setEditedSettings({...editedSettings, distance_limit_per_hour: Number(e.target.value)})}
                    min={5} max={50} step={5} />
                ) : `${settings.distance_limit_per_hour} mi/h`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-6)' }}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>💾 Save</Button>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>✏️ Edit</Button>
        )}
      </div>
    </div>
  );
}
