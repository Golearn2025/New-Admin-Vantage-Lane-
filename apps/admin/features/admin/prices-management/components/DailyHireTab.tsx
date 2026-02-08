'use client';
import React, { useState, useMemo } from 'react';
import { Button, DataTable, Input } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import { Save, Edit, Car, Sparkles, Bus, Truck } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import type { PricingConfig, DailySettings } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props { config: PricingConfig; }
type RateRow = { id: keyof DailySettings['rates']; vehicle: string; icon: React.ReactNode; rate: number };
type RestRow = { id: string; setting: string; value: number; unit: string };

const def: DailySettings = { rates: { executive: 640, luxury: 720, van: 720, suv: 880 }, minimum_days: 1, maximum_days: 7, hours_per_day: 8, distance_limit_per_day: 80, area_restriction: 'm25' };

export function DailyHireTab({ config }: Props) {
  const { updateDailySettings, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<DailySettings>(config.daily_settings || def);
  const s = isEditing ? edited : (config.daily_settings || edited);

  const handleSave = async () => { try { await updateDailySettings(edited); setIsEditing(false); } catch {} };
  const handleCancel = () => { setEdited(config.daily_settings || edited); setIsEditing(false); };

  const ratesData: RateRow[] = useMemo(() => [
    { id: 'executive' as const, vehicle: 'Executive', icon: <Car className="h-4 w-4" />, rate: s.rates.executive },
    { id: 'luxury' as const, vehicle: 'Luxury', icon: <Sparkles className="h-4 w-4" />, rate: s.rates.luxury },
    { id: 'van' as const, vehicle: 'Van', icon: <Bus className="h-4 w-4" />, rate: s.rates.van },
    { id: 'suv' as const, vehicle: 'SUV', icon: <Truck className="h-4 w-4" />, rate: s.rates.suv },
  ], [s]);

  const rateCols: Column<RateRow>[] = useMemo(() => [
    { id: 'vehicle', header: 'Vehicle', accessor: (r: RateRow) => r.vehicle, cell: (r: RateRow) => (<div className={styles.flexRow}>{r.icon}<strong>{r.vehicle}</strong></div>) },
    { id: 'rate', header: 'Daily Rate', accessor: (r: RateRow) => r.rate, cell: (r: RateRow) => isEditing ? (<Input type="number" value={r.rate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEdited({ ...edited, rates: { ...edited.rates, [r.id]: Number(e.target.value) } })} min={200} max={2000} step={10} />) : (<span>£{r.rate}/day</span>) },
  ], [isEditing, edited]);

  const restData: RestRow[] = useMemo(() => [
    { id: 'min', setting: 'Min Days', value: s.minimum_days, unit: ' days' },
    { id: 'max', setting: 'Max Days', value: s.maximum_days, unit: ' days' },
    { id: 'hours', setting: 'Hours/Day', value: s.hours_per_day, unit: 'h' },
    { id: 'dist', setting: 'Distance Limit', value: s.distance_limit_per_day, unit: ' mi/day' },
  ], [s]);

  const restCols: Column<RestRow>[] = useMemo(() => [
    { id: 'setting', header: 'Setting', accessor: (r: RestRow) => r.setting, cell: (r: RestRow) => <strong>{r.setting}</strong> },
    { id: 'value', header: 'Value', accessor: (r: RestRow) => r.value, cell: (r: RestRow) => {
      if (!isEditing) return `${r.value}${r.unit}`;
      const fieldMap: Record<string, keyof DailySettings> = { min: 'minimum_days', max: 'maximum_days', hours: 'hours_per_day', dist: 'distance_limit_per_day' };
      const key = fieldMap[r.id];
      if (!key) return `${r.value}${r.unit}`;
      return (<Input type="number" value={r.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEdited({ ...edited, [key]: Number(e.target.value) })} min={1} max={100} />);
    }},
  ], [isEditing, edited]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Daily Hire Settings</h2>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Daily Rates</h3>
        <DataTable data={ratesData} columns={rateCols} stickyHeader bordered ariaLabel="Daily rates by vehicle type" />
      </div>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Restrictions</h3>
        <DataTable data={restData} columns={restCols} stickyHeader bordered ariaLabel="Daily hire restrictions" />
      </div>
      <div className={styles.actionsContainer}>
        {isEditing ? (
          <>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" /> Save</Button>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /> Edit</Button>
        )}
      </div>
    </div>
  );
}
