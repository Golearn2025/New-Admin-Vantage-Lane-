/**
 * Surge Multipliers Tab Component
 * 
 * Displays time-based and event-based surge multipliers
 */

'use client';

import React from 'react';
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
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Period</th>
              <th className={styles.tableHeaderCell}>Multiplier</th>
              <th className={styles.tableHeaderCell}>Time Range</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeMultipliers.map(([key, multiplier]) => (
              <tr key={key} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                  {multiplier.label}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge} style={{
                    background: 'var(--gradient-secondary)',
                    color: 'white'
                  }}>
                    {multiplier.value}x
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {multiplier.start_time && multiplier.end_time
                    ? `🕐 ${multiplier.start_time} - ${multiplier.end_time}`
                    : '🕐 All day'}
                </td>
                <td className={styles.tableCell}>
                  <span
                    className={`${styles.statusBadge} ${
                      multiplier.active ? styles.statusActive : styles.statusInactive
                    }`}
                  >
                    {multiplier.active ? '✓ Active' : '○ Inactive'}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellActions}>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={multiplier.active}
                        onChange={() => handleToggle(key)}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Multipliers */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Event-Based Multipliers</h3>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Event</th>
              <th className={styles.tableHeaderCell}>Multiplier</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eventMultipliers.map(([key, multiplier]) => (
              <tr key={key} className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellBold}`}>
                  🎉 {multiplier.label}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge} style={{
                    background: 'var(--gradient-secondary)',
                    color: 'white'
                  }}>
                    {multiplier.value}x
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span
                    className={`${styles.statusBadge} ${
                      multiplier.active ? styles.statusActive : styles.statusInactive
                    }`}
                  >
                    {multiplier.active ? '✓ Active' : '○ Inactive'}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellActions}>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={multiplier.active}
                        onChange={() => {}}
                        disabled
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
