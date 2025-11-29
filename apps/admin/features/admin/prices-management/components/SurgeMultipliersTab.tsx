/**
 * Surge Multipliers Tab Component
 * 
 * Displays time-based and event-based surge multipliers
 */

'use client';

import React, { useMemo } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Save } from 'lucide-react';
import { TimeMultipliersTable, type TimeRow } from './surge/TimeMultipliersTable';
import { EventMultipliersTable, type EventRow } from './surge/EventMultipliersTable';
import { NightSurgeExample } from './surge/NightSurgeExample';
import type { PricingConfig } from '@entities/pricing';
import { usePricesManagement } from '../hooks/usePricesManagement';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function SurgeMultipliersTab({ config }: Props) {
  const { updateTimeMultipliers, isSaving } = usePricesManagement();
  const [multipliers, setMultipliers] = React.useState(config.time_multipliers);
  const timeMultipliers = Object.entries(multipliers);
  const eventMultipliers = Object.entries(config.event_multipliers);

  const handleToggle = (key: string) => {
    const current = multipliers[key];
    if (!current) return;
    
    setMultipliers({
      ...multipliers,
      [key]: {
        ...current,
        active: !current.active,
      },
    });
  };

  // Memoize data transformation for tables to prevent re-creation on every render
  const timeRows: TimeRow[] = useMemo(() => 
    timeMultipliers.map(([key, m]) => ({
      id: key,
      label: m.label,
      value: m.value,
      start: m.start_time ?? null,
      end: m.end_time ?? null,
      active: m.active,
    })), 
    [timeMultipliers]
  );

  const eventRows: EventRow[] = useMemo(() => 
    eventMultipliers.map(([key, m]) => ({
      id: key,
      label: m.label,
      value: m.value,
      active: m.active,
    })), 
    [eventMultipliers]
  );

  const handleSaveMultipliers = async () => {
    try {
      await updateTimeMultipliers?.(multipliers);
    } catch (e) {
      // errors are handled in hook via alert
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Surge Multipliers</h2>
      <p className={styles.sectionDescription}>
        Time-based and event-based pricing multipliers
      </p>
      <div className={styles.actionsContainer}>
        <Button variant="primary" onClick={handleSaveMultipliers} disabled={isSaving}>
          <Save className="h-4 w-4" /> Save Multipliers
        </Button>
      </div>

      {/* Time Multipliers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Time-Based Multipliers</h3>
        <TimeMultipliersTable rows={timeRows} onToggle={handleToggle} />
      </div>

      {/* Event Multipliers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Event-Based Multipliers</h3>
        <EventMultipliersTable rows={eventRows} />
      </div>

      {/* Example */}
      <NightSurgeExample config={config} />
    </div>
  );
}
