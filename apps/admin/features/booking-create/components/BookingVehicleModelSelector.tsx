/**
 * BookingVehicleModelSelector Component
 * Select specific vehicle model within category
 */

import type { VehicleCategory } from '../types';
import { VEHICLE_MODELS } from '../constants/vehicleModels';
import styles from './BookingVehicleModelSelector.module.css';

export interface BookingVehicleModelSelectorProps {
  category: VehicleCategory;
  selectedModel: string;
  onChange: (model: string) => void;
}

export function BookingVehicleModelSelector({
  category,
  selectedModel,
  onChange,
}: BookingVehicleModelSelectorProps) {
  const models = VEHICLE_MODELS[category] || [];

  if (models.length === 0) return null;

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Select Specific Model</h4>
      <div className={styles.options}>
        {models.map(model => (
          <button
            key={model.value}
            type="button"
            className={`${styles.option} ${selectedModel === model.value ? styles.active : ''}`}
            onClick={() => onChange(model.value)}
          >
            <div className={styles.radio}>
              {selectedModel === model.value && <div className={styles.dot} />}
            </div>
            <span className={styles.label}>{model.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
