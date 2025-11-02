/**
 * VehicleChip Component - REUTILIZABIL
 * 
 * Displays vehicle category with icon and color coding.
 * Maps vehicle categories to lucide-react icons.
 * 
 * Architecture: features/bookings-table/columns/VehicleChip.tsx
 * Compliant: <50 lines, 100% design tokens, TypeScript strict, REUTILIZABIL
 */

'use client';

import React from 'react';
import { Car, Sparkles, Truck, Bus } from 'lucide-react';
import styles from './VehicleChip.module.css';

type VehicleCategory = 'EXEC' | 'LUX' | 'SUV' | 'VAN' | 'FLEET';

interface VehicleChipProps {
  category: VehicleCategory;
  size?: 'sm' | 'md';
}

const VEHICLE_CONFIG: Record<VehicleCategory, { icon: React.ReactNode; label: string }> = {
  EXEC: { icon: <Car size={14} strokeWidth={2} />, label: 'Executive' },
  LUX: { icon: <Sparkles size={14} strokeWidth={2} />, label: 'Luxury' },
  SUV: { icon: <Truck size={14} strokeWidth={2} />, label: 'SUV' },
  VAN: { icon: <Bus size={14} strokeWidth={2} />, label: 'Van' },
  FLEET: { icon: <Car size={14} strokeWidth={2} />, label: 'Fleet' },
};

export function VehicleChip({ category, size = 'sm' }: VehicleChipProps) {
  const config = VEHICLE_CONFIG[category] || VEHICLE_CONFIG.EXEC;
  
  return (
    <div className={`${styles.chip} ${styles[size]}`}>
      <span className={styles.icon}>{config.icon}</span>
      <span className={styles.label}>{config.label}</span>
    </div>
  );
}
