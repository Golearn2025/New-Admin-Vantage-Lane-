/**
 * Hourly Hire Tab Component
 * 
 * Configure hourly hire rates and restrictions
 * Architecture: Feature component (UI only, no business logic)
 * MAX 200 lines per RULES.md
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, DataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Save, Edit, Car, Sparkles, Bus, Truck } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, HourlySettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

type HourlyRates = HourlySettings['rates'];

export function HourlyHireTab({ config }: Props) {
  const { updateHourlySettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const defaultSettings: HourlySettings = {
    rates: { executive: 80, luxury: 90, van: 90, suv: 110 },
    minimum_hours: 3,
    maximum_hours: 12,
    distance_limit_per_hour: 15,
    area_restriction: 'm25'
  };

  const [editedSettings, setEditedSettings] = useState<HourlySettings>(
    config.hourly_settings || defaultSettings
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
    setEditedSettings(config.hourly_settings || editedSettings);
    setIsEditing(false);
  };

  const settings = isEditing ? editedSettings : (config.hourly_settings || editedSettings);

  // Transform rates data for DataTable
  type RateRow = {
    id: string;
    vehicle: string;
    icon: React.ReactNode;
    rate: number;
  };

  const ratesData: RateRow[] = useMemo(() => [
    { id: 'executive', vehicle: 'Executive', icon: <Car className="h-4 w-4" />, rate: settings.rates.executive },
    { id: 'luxury', vehicle: 'Luxury', icon: <Sparkles className="h-4 w-4" />, rate: settings.rates.luxury },
    { id: 'van', vehicle: 'Van', icon: <Bus className="h-4 w-4" />, rate: settings.rates.van },
    { id: 'suv', vehicle: 'SUV', icon: <Truck className="h-4 w-4" />, rate: settings.rates.suv },
  ], [settings]);

  const ratesColumns: Column<RateRow>[] = useMemo(() => [
    {
      id: 'vehicle',
      header: 'Vehicle',
      accessor: (row) => row.vehicle,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          {row.icon}
          <strong>{row.vehicle}</strong>
        </div>
      ),
    },
    {
      id: 'rate',
      header: 'Rate',
      accessor: (row) => row.rate,
      cell: (row) => isEditing ? (
        <Input
          type="number"
          value={row.rate}
          onChange={(e) => setEditedSettings({
            ...editedSettings,
            rates: { ...editedSettings.rates, [row.id]: Number(e.target.value) }
          })}
          min={50}
          max={200}
          step={5}
        />
      ) : `£${row.rate}/hour`,
    },
  ], [isEditing, editedSettings]);

  // Transform restrictions data for DataTable
  type RestrictionRow = {
    id: string;
    setting: string;
    value: number | string;
    unit: string;
  };

  const restrictionsData: RestrictionRow[] = useMemo(() => [
    { id: 'min_hours', setting: 'Min Hours', value: settings.minimum_hours, unit: 'h' },
    { id: 'max_hours', setting: 'Max Hours', value: settings.maximum_hours, unit: 'h' },
    { id: 'distance_limit', setting: 'Distance Limit', value: settings.distance_limit_per_hour, unit: 'mi/h' },
  ], [settings]);

  const restrictionsColumns: Column<RestrictionRow>[] = useMemo(() => [
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
        if (!isEditing) return `${row.value}${row.unit}`;
        
        if (row.id === 'min_hours') {
          return (
            <Input
              type="number"
              value={settings.minimum_hours}
              onChange={(e) => setEditedSettings({...editedSettings, minimum_hours: Number(e.target.value)})}
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
              onChange={(e) => setEditedSettings({...editedSettings, maximum_hours: Number(e.target.value)})}
              min={1}
              max={24}
            />
          );
        }
        if (row.id === 'distance_limit') {
          return (
            <Input
              type="number"
              value={settings.distance_limit_per_hour}
              onChange={(e) => setEditedSettings({...editedSettings, distance_limit_per_hour: Number(e.target.value)})}
              min={5}
              max={50}
              step={5}
            />
          );
        }
        return null;
      },
    },
  ], [isEditing, settings, editedSettings]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Hourly Hire Settings</h2>

      {/* Rates */}
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

      {/* Restrictions */}
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
