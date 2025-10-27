/**
 * Earnings Page - Fleet Portal
 * View earnings and financial reports
 */

import styles from '../bookings/page.module.css';

export default function FleetEarningsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Earnings</h1>
      <div className={styles.placeholder}>
        <p>💰</p>
        <p>Earnings dashboard coming soon...</p>
        <p className={styles.note}>
          Track your revenue, commission, and driver payouts.
        </p>
      </div>
    </div>
  );
}
