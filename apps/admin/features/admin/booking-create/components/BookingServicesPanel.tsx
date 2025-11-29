/**
 * BookingServicesPanel Component
 * Horizontal service badges with FREE/PAID indicators
 */

import { useMemo } from 'react';
import type { BookingService } from '../types';
import styles from './BookingServicesPanel.module.css';

export interface BookingServicesPanelProps {
  services: BookingService[];
  onToggleService: (serviceCode: string) => void;
}

export function BookingServicesPanel({
  services,
  onToggleService,
}: BookingServicesPanelProps) {
  // Memoize filtered services 
  const freeServices = useMemo(() => services.filter(s => s.isFree), [services]);
  const paidServices = useMemo(() => services.filter(s => !s.isFree), [services]);

  // Memoize service buttons to prevent re-creation on every render
  const freeServiceButtons = useMemo(() => 
    freeServices.map(service => (
      <button
        key={service.code}
        type="button"
        className={`${styles.badge} ${styles.badgeFree} ${service.selected ? styles.selected : ''}`}
        onClick={() => onToggleService(service.code)}
      >
        <span className={styles.check}>{service.selected ? '✓' : ''}</span>
        <span className={styles.label}>{service.label}</span>
        <span className={styles.freeTag}>FREE</span>
      </button>
    )), 
    [freeServices, onToggleService]
  );

  const paidServiceButtons = useMemo(() => 
    paidServices.map(service => (
      <button
        key={service.code}
        type="button"
        className={`${styles.badge} ${styles.badgePaid} ${service.selected ? styles.selected : ''}`}
        onClick={() => onToggleService(service.code)}
      >
        <span className={styles.check}>{service.selected ? '✓' : ''}</span>
        <span className={styles.label}>{service.label}</span>
        <span className={styles.price}>+£{service.price}</span>
      </button>
    )), 
    [paidServices, onToggleService]
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Services</h3>
      
      {/* Free Services */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Free Services</h4>
        <div className={styles.badges}>
          {freeServiceButtons}
        </div>
      </div>

      {/* Paid Services */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Premium Services</h4>
        <div className={styles.badges}>
          {paidServiceButtons}
        </div>
      </div>
    </div>
  );
}
