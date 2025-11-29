/**
 * BookingTypeSelector Component
 * Tab selector for trip types: oneway, return, hourly, fleet
 */

import { useMemo } from 'react';
import { ArrowRight, RefreshCw, Clock, Car } from 'lucide-react';
import type { TripType } from '../types';
import styles from './BookingTypeSelector.module.css';

export interface BookingTypeSelectorProps {
  value: TripType;
  onChange: (type: TripType) => void;
}

const TRIP_TYPES: { value: TripType; label: string; icon: React.ReactNode }[] = [
  { value: 'oneway', label: 'One Way', icon: <ArrowRight size={18} strokeWidth={2} /> },
  { value: 'return', label: 'Return', icon: <RefreshCw size={18} strokeWidth={2} /> },
  { value: 'hourly', label: 'Hourly', icon: <Clock size={18} strokeWidth={2} /> },
  { value: 'fleet', label: 'Fleet', icon: <Car size={18} strokeWidth={2} /> },
];

export function BookingTypeSelector({ value, onChange }: BookingTypeSelectorProps) {
  // Memoize trip type tabs to prevent re-creation on every render
  const tripTypeTabs = useMemo(() => 
    TRIP_TYPES.map(type => (
      <button
        key={type.value}
        type="button"
        className={`${styles.tab} ${value === type.value ? styles.active : ''}`}
        onClick={() => onChange(type.value)}
      >
        <span className={styles.icon}>{type.icon}</span>
        <span className={styles.label}>{type.label}</span>
      </button>
    )), 
    [value, onChange]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Trip Type</h3>
      <div className={styles.tabs}>
        {tripTypeTabs}
      </div>
    </div>
  );
}
