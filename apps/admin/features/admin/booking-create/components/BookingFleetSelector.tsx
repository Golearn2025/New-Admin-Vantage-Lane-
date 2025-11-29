/**
 * BookingFleetSelector Component
 * Select number of vehicles for fleet booking
 */

import React, { useMemo } from 'react';
import { Car, Sparkles, Bus, Truck } from 'lucide-react';
import styles from './BookingFleetSelector.module.css';

export interface BookingFleetSelectorProps {
  fleetExecutive: number;
  fleetSClass: number;
  fleetVClass: number;
  fleetSUV: number;
  onChange: (field: string, value: number) => void;
}

const FLEET_VEHICLES: { key: string; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'fleetExecutive', label: 'Executive', icon: <Car size={20} strokeWidth={2} />, desc: 'Mercedes E-Class, BMW 5 Series' },
  { key: 'fleetSClass', label: 'S-Class', icon: <Sparkles size={20} strokeWidth={2} />, desc: 'Mercedes S-Class, BMW 7 Series' },
  { key: 'fleetVClass', label: 'V-Class', icon: <Bus size={20} strokeWidth={2} />, desc: 'Mercedes V-Class, up to 7 passengers' },
  { key: 'fleetSUV', label: 'SUV', icon: <Truck size={20} strokeWidth={2} />, desc: 'Range Rover, BMW X5' },
];

export function BookingFleetSelector({
  fleetExecutive,
  fleetSClass,
  fleetVClass,
  fleetSUV,
  onChange,
}: BookingFleetSelectorProps) {
  const getValue = (key: string) => {
    switch (key) {
      case 'fleetExecutive': return fleetExecutive;
      case 'fleetSClass': return fleetSClass;
      case 'fleetVClass': return fleetVClass;
      case 'fleetSUV': return fleetSUV;
      default: return 0;
    }
  };

  // Memoize vehicle cards to prevent re-creation on every render
  const vehicleCards = useMemo(() => 
    FLEET_VEHICLES.map(vehicle => {
      const count = getValue(vehicle.key);
      const isActive = count > 0;
      
      return (
        <div key={vehicle.key} className={`${styles.card} ${isActive ? styles.active : ''}`}>
          <div className={styles.header}>
            <div className={styles.icon}>{vehicle.icon}</div>
            <div className={styles.info}>
              <div className={styles.label}>{vehicle.label}</div>
              <div className={styles.desc}>{vehicle.desc}</div>
            </div>
          </div>
          
          <div className={styles.counter}>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => decrement(vehicle.key)}
              disabled={count === 0}
            >
              −
            </button>
            <span className={styles.count}>{count}</span>
            <button
              type="button"
              className={styles.counterBtn}
              onClick={() => increment(vehicle.key)}
            >
              +
            </button>
          </div>
        </div>
      );
    }), 
    [fleetExecutive, fleetSClass, fleetVClass, fleetSUV]
  );

  const increment = (key: string) => {
    const current = getValue(key);
    onChange(key, current + 1);
  };

  const decrement = (key: string) => {
    const current = getValue(key);
    if (current > 0) {
      onChange(key, current - 1);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Fleet Vehicles</h3>
      <p className={styles.subtitle}>Select how many vehicles you need</p>
      
      <div className={styles.grid}>
        {vehicleCards}
      </div>
      
      <div className={styles.total}>
        <span className={styles.totalLabel}>Total Vehicles:</span>
        <span className={styles.totalValue}>
          {fleetExecutive + fleetSClass + fleetVClass + fleetSUV}
        </span>
      </div>
    </div>
  );
}
