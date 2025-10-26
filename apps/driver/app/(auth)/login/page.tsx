/**
 * Login Page - Driver Portal
 */

import styles from './page.module.css';

export default function DriverLoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Driver Portal</h1>
          <p className={styles.subtitle}>Access your bookings and earnings</p>
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
              placeholder="driver@example.com"
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
            Sign In
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
