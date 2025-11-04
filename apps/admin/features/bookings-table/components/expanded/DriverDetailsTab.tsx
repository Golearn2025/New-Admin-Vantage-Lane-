/**
 * DriverDetailsTab Component
 * 
 * Full driver profile with all details.
 * Displayed in assignment section driver tab.
 * 
 * Compliant: <200 lines, TypeScript strict, 100% design tokens
 */

'use client';

import { Star } from 'lucide-react';
import type { DriverDetails } from './AssignmentSection.types';
import styles from './AssignmentSection.module.css';

interface DriverDetailsTabProps {
  driver: DriverDetails;
}

export function DriverDetailsTab({ driver }: DriverDetailsTabProps) {
  return (
    <div className={styles.details}>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Name:</span>
        <span className={styles.detailValue}>{driver.name}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Phone:</span>
        <span className={styles.detailValue}>{driver.phone}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Email:</span>
        <span className={styles.detailValue}>{driver.email}</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Rating:</span>
        <span className={styles.detailValue}><Star size={14} /> {driver.rating}/5.0</span>
      </div>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Total Trips:</span>
        <span className={styles.detailValue}>{driver.totalTrips}</span>
      </div>
      {driver.licenseNumber && (
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>License:</span>
          <span className={styles.detailValue}>{driver.licenseNumber}</span>
        </div>
      )}
    </div>
  );
}
