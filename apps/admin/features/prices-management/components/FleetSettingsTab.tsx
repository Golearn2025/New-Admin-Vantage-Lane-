/**
 * Fleet Settings Tab Component
 * 
 * Configure fleet booking discounts
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

interface FleetSettings {
  discounts: {
    tier1: { min_vehicles: number; discount_rate: number };
    tier2: { min_vehicles: number; discount_rate: number };
  };
  premium_services_multiply: boolean;
}

export function FleetSettingsTab({ config }: Props) {
  const { updateFleetSettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<FleetSettings>(
    (config as any).fleet_settings || {
      discounts: {
        tier1: { min_vehicles: 3, discount_rate: 0.05 },
        tier2: { min_vehicles: 5, discount_rate: 0.10 }
      },
      premium_services_multiply: true
    }
  );

  const handleSave = async () => {
    try {
      await updateFleetSettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCancel = () => {
    setEditedSettings((config as any).fleet_settings || editedSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : ((config as any).fleet_settings || editedSettings);

  const updateTier = (tier: 'tier1' | 'tier2', field: 'min_vehicles' | 'discount_rate', value: number) => {
    setEditedSettings({
      ...editedSettings,
      discounts: {
        ...editedSettings.discounts,
        [tier]: { ...editedSettings.discounts[tier], [field]: value }
      }
    });
  };

  const renderTierRow = (tier: 'tier1' | 'tier2', label: string) => (
    <tr className={styles.tableRow}>
      <td className={`${styles.tableCell} ${styles.tableCellBold}`}>{label}</td>
      <td className={styles.tableCell}>
        {isEditing ? (
          <Input type="number" value={settings.discounts[tier].min_vehicles}
            onChange={(e) => updateTier(tier, 'min_vehicles', Number(e.target.value))}
            min={2} max={20} />
        ) : `${settings.discounts[tier].min_vehicles}+`}
      </td>
      <td className={styles.tableCell}>
        {isEditing ? (
          <Input type="number" value={settings.discounts[tier].discount_rate * 100}
            onChange={(e) => updateTier(tier, 'discount_rate', Number(e.target.value) / 100)}
            min={0} max={30} step={1} />
        ) : (
          <span className={styles.statusBadge}>
            {(settings.discounts[tier].discount_rate * 100).toFixed(0)}%
          </span>
        )}
      </td>
    </tr>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Fleet Booking Settings</h2>

      {/* Volume Discounts */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📊 Volume Discounts</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Tier</th>
              <th className={styles.tableHeaderCell}>Min Vehicles</th>
              <th className={styles.tableHeaderCell}>Discount</th>
            </tr>
          </thead>
          <tbody>
            {renderTierRow('tier1', 'Tier 1')}
            {renderTierRow('tier2', 'Tier 2')}
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
