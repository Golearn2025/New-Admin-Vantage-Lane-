/**
 * Vehicles Page - Fleet Portal
 * Manage fleet vehicles
 */

import styles from '../bookings/page.module.css';

export default function FleetVehiclesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Vehicles</h1>
      <div className={styles.placeholder}>
        <p>🚗</p>
        <p>Vehicles management coming soon...</p>
        <p className={styles.note}>
          View and manage your fleet vehicles here.
        </p>
      </div>
    </div>
  );
}
