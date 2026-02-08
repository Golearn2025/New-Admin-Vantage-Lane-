/**
 * Surge Multipliers Tab Component
 * 
 * Displays time-based and event-based surge multipliers
 * Full edit, add, delete functionality
 */

'use client';

import type { PricingConfig } from '@entities/pricing';
import { Button } from '@vantage-lane/ui-core';
import { Edit, Plus, Save, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import styles from './PricesManagementPage.module.css';
import { EventMultipliersTable, type EventRow } from './surge/EventMultipliersTable';
import { NightSurgeExample } from './surge/NightSurgeExample';
import { TimeMultipliersTable, type TimeRow } from './surge/TimeMultipliersTable';

interface Props {
  config: PricingConfig;
}

export function SurgeMultipliersTab({ config }: Props) {
  const { updateTimeMultipliers, updateEventMultipliers, isSaving } = usePricesManagement();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEvents, setIsEditingEvents] = useState(false);
  const [multipliers, setMultipliers] = useState(config.time_multipliers);
  const [eventMults, setEventMults] = useState(config.event_multipliers);

  const timeMultipliers = Object.entries(multipliers);
  const eventMultipliers = Object.entries(eventMults);

  const handleToggle = (key: string) => {
    const current = multipliers[key];
    if (!current) return;
    setMultipliers({
      ...multipliers,
      [key]: { ...current, active: !current.active },
    });
  };

  const handleUpdate = (key: string, field: string, value: any) => {
    const current = multipliers[key];
    if (!current) return;
    setMultipliers({
      ...multipliers,
      [key]: { ...current, [field]: value },
    });
  };

  const handleDelete = (key: string) => {
    const next = { ...multipliers };
    delete next[key];
    setMultipliers(next);
  };

  const handleAdd = () => {
    const newKey = `custom_${Date.now()}`;
    setMultipliers({
      ...multipliers,
      [newKey]: {
        label: 'New Period',
        value: 1.0,
        active: false,
      },
    });
  };

  const handleSave = async () => {
    try {
      await updateTimeMultipliers?.(multipliers);
      setIsEditing(false);
    } catch {
      // errors handled in hook
    }
  };

  const handleCancel = () => {
    setMultipliers(config.time_multipliers);
    setIsEditing(false);
  };

  const handleEventToggle = (key: string) => {
    const current = eventMults[key];
    if (!current) return;
    setEventMults({ ...eventMults, [key]: { ...current, active: !current.active } });
  };
  const handleEventUpdate = (key: string, field: string, value: any) => {
    const current = eventMults[key];
    if (!current) return;
    setEventMults({ ...eventMults, [key]: { ...current, [field]: value } });
  };
  const handleEventDelete = (key: string) => {
    const next = { ...eventMults };
    delete next[key];
    setEventMults(next);
  };
  const handleEventAdd = () => {
    const newKey = `event_${Date.now()}`;
    setEventMults({ ...eventMults, [newKey]: { label: 'New Event', value: 1.0, active: false } });
  };
  const handleEventSave = async () => {
    try {
      await updateEventMultipliers?.(eventMults);
      setIsEditingEvents(false);
    } catch { /* errors handled in hook */ }
  };
  const handleEventCancel = () => {
    setEventMults(config.event_multipliers);
    setIsEditingEvents(false);
  };

  const timeRows: TimeRow[] = useMemo(() =>
    timeMultipliers.map(([key, m]) => ({
      id: key,
      label: m.label,
      value: m.value,
      start: m.start_time ?? null,
      end: m.end_time ?? null,
      days: m.days,
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

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Surge Multipliers</h2>
      <p className={styles.sectionDescription}>
        Time-based and event-based pricing multipliers
      </p>

      {/* Time Multipliers */}
      <div className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className={styles.sectionTitle}>Time-Based Multipliers</h3>
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <>
                <Button variant="primary" onClick={handleAdd}><Plus className="h-4 w-4" /> Add Period</Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4" /> Save</Button>
                <Button variant="secondary" onClick={handleCancel}><X className="h-4 w-4" /> Cancel</Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /> Edit</Button>
            )}
          </div>
        </div>
        <TimeMultipliersTable
          rows={timeRows}
          isEditing={isEditing}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>

      {/* Event Multipliers */}
      <div className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className={styles.sectionTitle}>Event-Based Multipliers</h3>
          <div className={styles.buttonGroup}>
            {isEditingEvents ? (
              <>
                <Button variant="primary" onClick={handleEventAdd}><Plus className="h-4 w-4" /> Add Event</Button>
                <Button variant="primary" onClick={handleEventSave} disabled={isSaving}><Save className="h-4 w-4" /> Save</Button>
                <Button variant="secondary" onClick={handleEventCancel}><X className="h-4 w-4" /> Cancel</Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditingEvents(true)}><Edit className="h-4 w-4" /> Edit</Button>
            )}
          </div>
        </div>
        <EventMultipliersTable
          rows={eventRows}
          isEditing={isEditingEvents}
          onToggle={handleEventToggle}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
        />
      </div>

      {/* Example */}
      <NightSurgeExample config={config} />
    </div>
  );
}
