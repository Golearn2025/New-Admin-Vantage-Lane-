/**
 * Login Page - Fleet Portal
 * Authentication for fleet managers/operators
 */

import styles from './page.module.css';

export default function FleetLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Fleet Management</h1>
          <p className={styles.subtitle}>Manage your drivers and bookings</p>
        </div>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="operator@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Sign In to Fleet Portal
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Need help?{' '}
            <a href="mailto:support@vantage-lane.com" className={styles.link}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
