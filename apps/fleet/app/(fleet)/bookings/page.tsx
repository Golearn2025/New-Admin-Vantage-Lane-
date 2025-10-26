/**
 * Bookings Page - Fleet Portal
 * View and manage bookings (scoped to operator)
 */

import styles from './page.module.css';

export default function FleetBookingsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bookings</h1>
      <div className={styles.placeholder}>
        <p>📅</p>
        <p>Bookings table coming soon...</p>
        <p className={styles.note}>
          You'll see bookings for your drivers only, with prices after platform fee.
        </p>
      </div>
    </div>
  );
}
