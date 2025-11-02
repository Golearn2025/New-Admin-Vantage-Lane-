/**
 * Vehicles Page - Fleet Portal
 * Manage fleet vehicles
 */

import { Car } from 'lucide-react';
import styles from '../bookings/page.module.css';

export default function FleetVehiclesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Vehicles</h1>
      <div className={styles.placeholder}>
        <p><Car size={18} strokeWidth={2} /></p>
        <p>Vehicles management coming soon...</p>
        <p className={styles.note}>
          View and manage your fleet vehicles here.
        </p>
      </div>
    </div>
  );
}
