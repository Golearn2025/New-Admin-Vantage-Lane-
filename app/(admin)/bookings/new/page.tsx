/**
 * New Booking Page
 *
 * Form to create new bookings from admin panel
 * Coming soon!
 * Refactored: All inline styles moved to CSS module
 */

import styles from './page.module.css';

export default function NewBookingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create New Booking</h1>
      <p className={styles.description}>Admin booking creation form</p>

      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>📝</div>
        <h2 className={styles.emptyStateTitle}>Coming Soon</h2>
        <p className={styles.emptyStateText}>Booking creation form will be available here</p>
      </div>
    </div>
  );
}
