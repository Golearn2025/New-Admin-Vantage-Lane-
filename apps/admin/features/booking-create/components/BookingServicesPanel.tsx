/**
 * BookingServicesPanel Component
 * Horizontal service badges with FREE/PAID indicators
 */

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
  const freeServices = services.filter(s => s.isFree);
  const paidServices = services.filter(s => !s.isFree);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Services</h3>
      
      {/* Free Services */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Free Services</h4>
        <div className={styles.badges}>
          {freeServices.map(service => (
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
          ))}
        </div>
      </div>

      {/* Paid Services */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Premium Services</h4>
        <div className={styles.badges}>
          {paidServices.map(service => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
