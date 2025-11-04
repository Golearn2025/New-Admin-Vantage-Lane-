/**
 * VehicleDetailsTab Component
 * 
 * Full vehicle details and specifications.
 * Displayed in assignment section vehicle tab.
 * 
 * Compliant: <200 lines, TypeScript strict, 100% design tokens
 */

'use client';

import { Hash, Users, Briefcase, Wrench } from 'lucide-react';
import type { VehicleDetails } from './AssignmentSection.types';
import styles from './AssignmentSection.module.css';

interface VehicleDetailsTabProps {
  vehicle: VehicleDetails;
}

export function VehicleDetailsTab({ vehicle }: VehicleDetailsTabProps) {
  return (
    <div className={styles.details}>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Make/Model:</span>
        <span className={styles.detailValue}>{vehicle.make} {vehicle.model}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Year:</span>
        <span className={styles.detailValue}>{vehicle.year}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Color:</span>
        <span className={styles.detailValue}>{vehicle.color}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>License Plate:</span>
        <span className={styles.detailValue}><Hash size={14} /> {vehicle.licensePlate}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Capacity:</span>
        <span className={styles.detailValue}><Users size={14} /> {vehicle.seats} seats</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Luggage:</span>
        <span className={styles.detailValue}><Briefcase size={14} /> {vehicle.luggageCapacity} bags</span>
      </div>
      {vehicle.lastServiceDate && (
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Last Service:</span>
          <span className={styles.detailValue}><Wrench size={14} /> {vehicle.lastServiceDate}</span>
        </div>
      )}
    </div>
  );
}
