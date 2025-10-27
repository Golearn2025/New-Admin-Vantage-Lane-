/**
 * BookingVehicleSelector Component
 * Select vehicle category: Executive, Luxury, SUV, Van
 */

import { BookingVehicleModelSelector } from './BookingVehicleModelSelector';
import type { VehicleCategory } from '../types';
import styles from './BookingVehicleSelector.module.css';

export interface BookingVehicleSelectorProps {
  value: VehicleCategory;
  vehicleModel?: string | undefined;
  onChange: (category: VehicleCategory) => void;
  onModelChange: (model: string) => void;
}

const VEHICLE_CATEGORIES = [
  { value: 'EXEC' as const, label: 'Executive', icon: '🚗', desc: 'Mercedes E-Class, BMW 5 Series' },
  { value: 'LUX' as const, label: 'Luxury', icon: '✨', desc: 'Mercedes S-Class, BMW 7 Series' },
  { value: 'SUV' as const, label: 'SUV', icon: '🚙', desc: 'Range Rover, BMW X5' },
  { value: 'VAN' as const, label: 'Van', icon: '🚐', desc: 'Mercedes V-Class, up to 7 passengers' },
];

export function BookingVehicleSelector({ value, vehicleModel, onChange, onModelChange }: BookingVehicleSelectorProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Vehicle Category</h3>
      <div className={styles.grid}>
        {VEHICLE_CATEGORIES.map(cat => (
          <button
            key={cat.value}
            type="button"
            className={`${styles.card} ${value === cat.value ? styles.active : ''}`}
            onClick={() => onChange(cat.value)}
          >
            <div className={styles.icon}>{cat.icon}</div>
            <div className={styles.label}>{cat.label}</div>
            <div className={styles.desc}>{cat.desc}</div>
            {value === cat.value && <div className={styles.check}>✓</div>}
          </button>
        ))}
      </div>
      
      {/* Model selector appears after category selection */}
      <BookingVehicleModelSelector
        category={value}
        selectedModel={vehicleModel || ''}
        onChange={onModelChange}
      />
    </div>
  );
}
