/**
 * Fleet Settings Tab Component
 * 
 * Configure fleet booking discounts
 * Architecture: Feature component (UI only, no business logic)
 * MAX 200 lines per RULES.md
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, DataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Save, Edit } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, FleetSettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function FleetSettingsTab({ config }: Props) {
  const { updateFleetSettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaultSettings: FleetSettings = {
    discounts: {
      tier1: { min_vehicles: 3, discount_rate: 0.05 },
      tier2: { min_vehicles: 5, discount_rate: 0.10 }
    },
    premium_services_multiply: true
  };

  const [editedSettings, setEditedSettings] = useState<FleetSettings>(
    config.fleet_settings || defaultSettings
  );

  const handleSave = async () => {
    try {
      await updateFleetSettings(editedSettings);
      setIsEditing(false);
    } catch (error) {
      // Failed to save fleet settings
    }
  };

  const handleCancel = () => {
    setEditedSettings(config.fleet_settings || editedSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : (config.fleet_settings || editedSettings);

  const updateTier = (tier: 'tier1' | 'tier2', field: 'min_vehicles' | 'discount_rate', value: number) => {
    setEditedSettings({
      ...editedSettings,
      discounts: {
        ...editedSettings.discounts,
        [tier]: { ...editedSettings.discounts[tier], [field]: value }
      }
    });
  };

  // Transform data for DataTable
  type TierRow = {
    id: string;
    tier: string;
    tierKey: 'tier1' | 'tier2';
    minVehicles: number;
    discountRate: number;
  };

  const tableData: TierRow[] = useMemo(() => [
    {
      id: 'tier1',
      tier: 'Tier 1',
      tierKey: 'tier1' as const,
      minVehicles: settings.discounts.tier1.min_vehicles,
      discountRate: settings.discounts.tier1.discount_rate,
    },
    {
      id: 'tier2',
      tier: 'Tier 2',
      tierKey: 'tier2' as const,
      minVehicles: settings.discounts.tier2.min_vehicles,
      discountRate: settings.discounts.tier2.discount_rate,
    },
  ], [settings]);

  // Define columns
  const columns: Column<TierRow>[] = useMemo(() => [
    {
      id: 'tier',
      header: 'Tier',
      accessor: (row) => row.tier,
      cell: (row) => <strong>{row.tier}</strong>,
    },
    {
      id: 'minVehicles',
      header: 'Min Vehicles',
      accessor: (row) => row.minVehicles,
      cell: (row) => isEditing ? (
        <Input
          type="number"
          value={row.minVehicles}
          onChange={(e) => updateTier(row.tierKey, 'min_vehicles', Number(e.target.value))}
          min={2}
          max={20}
        />
      ) : `${row.minVehicles}+`,
    },
    {
      id: 'discount',
      header: 'Discount',
      accessor: (row) => row.discountRate,
      cell: (row) => isEditing ? (
        <Input
          type="number"
          value={row.discountRate * 100}
          onChange={(e) => updateTier(row.tierKey, 'discount_rate', Number(e.target.value) / 100)}
          min={0}
          max={30}
          step={1}
        />
      ) : (
        <span className={`${styles.statusBadge} ${styles.statusBadgePrimary}`}>
          {(row.discountRate * 100).toFixed(0)}%
        </span>
      ),
    },
  ], [isEditing, settings]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Fleet Booking Settings</h2>

      {/* Volume Discounts */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Volume Discounts</h3>
        <DataTable
          data={tableData}
          columns={columns}
          stickyHeader
          bordered
          ariaLabel="Fleet volume discounts"
        />
      </div>

      {/* Actions */}
      <div className={styles.actionsContainer}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>
    </div>
  );
}
