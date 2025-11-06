/**
 * Surge Multipliers Tab Component
 * 
 * Displays time-based and event-based surge multipliers
 */

'use client';

import React from 'react';
import { Clock, PartyPopper } from 'lucide-react';
import { EnterpriseDataTable } from '@vantage-lane/ui-core';
import type { Column } from '@vantage-lane/ui-core';
import type { PricingConfig } from '@entities/pricing';
import styles from './PricesManagementPage.module.css';

interface Props {
  config: PricingConfig;
}

export function SurgeMultipliersTab({ config }: Props) {
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

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Surge Multipliers</h2>
      <p className={styles.sectionDescription}>
        Time-based and event-based pricing multipliers
      </p>

      {/* Time Multipliers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Time-Based Multipliers</h3>
        {(() => {
          type TimeRow = {
            id: string;
            label: string;
            value: number;
            start?: string | null;
            end?: string | null;
            active: boolean;
          };
          const data: TimeRow[] = timeMultipliers.map(([key, m]) => ({
            id: key,
            label: m.label,
            value: m.value,
            start: m.start_time ?? null,
            end: m.end_time ?? null,
            active: m.active,
          }));

          const columns: Column<TimeRow>[] = [
            { id: 'label', header: 'Period', accessor: (row) => row.label },
            {
              id: 'value',
              header: 'Multiplier',
              accessor: (row) => row.value,
              cell: (row) => (
                <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{row.value}x</span>
              ),
            },
            {
              id: 'time',
              header: 'Time Range',
              accessor: () => '',
              cell: (row) => (
                <div className={styles.flexRow}>
                  <Clock className="h-4 w-4" />
                  {row.start && row.end ? `${row.start} - ${row.end}` : 'All day'}
                </div>
              ),
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (row) => row.active,
              cell: (row) => (
                <span className={`${styles.statusBadge} ${row.active ? styles.statusActive : styles.statusInactive}`}>
                  {row.active ? '✓ Active' : '○ Inactive'}
                </span>
              ),
            },
            {
              id: 'actions',
              header: 'Actions',
              accessor: () => '',
              cell: (row) => (
                <div className={styles.tableCellActions}>
                  <label className={styles.toggleSwitch}>
                    <input type="checkbox" checked={row.active} onChange={() => handleToggle(row.id)} />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              ),
            },
          ];

          return <EnterpriseDataTable<TimeRow> columns={columns} data={data} stickyHeader />;
        })()}
      </div>

      {/* Event Multipliers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Event-Based Multipliers</h3>
        {(() => {
          type EventRow = { id: string; label: string; value: number; active: boolean };
          const data: EventRow[] = eventMultipliers.map(([key, m]) => ({
            id: key,
            label: m.label,
            value: m.value,
            active: m.active,
          }));

          const columns: Column<EventRow>[] = [
            {
              id: 'label',
              header: 'Event',
              accessor: (row) => row.label,
              cell: (row) => (
                <div className={styles.flexRow}>
                  <PartyPopper className="h-4 w-4" />
                  {row.label}
                </div>
              ),
            },
            {
              id: 'value',
              header: 'Multiplier',
              accessor: (row) => row.value,
              cell: (row) => (
                <span className={`${styles.statusBadge} ${styles.statusBadgeSecondary}`}>{row.value}x</span>
              ),
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (row) => row.active,
              cell: (row) => (
                <span className={`${styles.statusBadge} ${row.active ? styles.statusActive : styles.statusInactive}`}>
                  {row.active ? '✓ Active' : '○ Inactive'}
                </span>
              ),
            },
            {
              id: 'actions',
              header: 'Actions',
              accessor: () => '',
              cell: (row) => (
                <div className={styles.tableCellActions}>
                  <label className={styles.toggleSwitch}>
                    <input type="checkbox" checked={row.active} disabled />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              ),
            },
          ];

          return <EnterpriseDataTable<EventRow> columns={columns} data={data} stickyHeader />;
        })()}
      </div>

      {/* Example */}
      <div className={styles.exampleBox}>
        <h3 className={styles.exampleTitle}>Example: Night Surge (22:00-06:00)</h3>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Base Trip Cost:</span>
          <span className={styles.exampleValue}>£100.00</span>
        </div>
        <div className={styles.exampleRow}>
          <span className={styles.exampleLabel}>Night Multiplier:</span>
          <span className={styles.exampleValue}>
            {config.time_multipliers.night?.value || 1}x (+
            {(((config.time_multipliers.night?.value || 1) - 1) * 100).toFixed(0)}%)
          </span>
        </div>
        <div className={`${styles.exampleRow} ${styles.exampleTotal}`}>
          <span className={styles.exampleLabel}>Total:</span>
          <span className={styles.exampleValue}>
            £{(100 * (config.time_multipliers.night?.value || 1)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
