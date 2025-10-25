/**
 * BookingTypeSelector Component
 * Tab selector for trip types: oneway, return, hourly, fleet
 */

import type { TripType } from '../types';
import styles from './BookingTypeSelector.module.css';

export interface BookingTypeSelectorProps {
  value: TripType;
  onChange: (type: TripType) => void;
}

const TRIP_TYPES: { value: TripType; label: string; icon: string }[] = [
  { value: 'oneway', label: 'One Way', icon: '➡️' },
  { value: 'return', label: 'Return', icon: '🔄' },
  { value: 'hourly', label: 'Hourly', icon: '⏰' },
  { value: 'fleet', label: 'Fleet', icon: '🚗' },
];

export function BookingTypeSelector({ value, onChange }: BookingTypeSelectorProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Trip Type</h3>
      <div className={styles.tabs}>
        {TRIP_TYPES.map(type => (
          <button
            key={type.value}
            type="button"
            className={`${styles.tab} ${value === type.value ? styles.active : ''}`}
            onClick={() => onChange(type.value)}
          >
            <span className={styles.icon}>{type.icon}</span>
            <span className={styles.label}>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
