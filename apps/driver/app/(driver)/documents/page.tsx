/**
 * Documents Page - Driver Portal
 * PLACEHOLDER - Coming soon
 */

import styles from '../placeholders.module.css';

export default function DriverDocumentsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Documents</h1>
      <div className={styles.placeholder}>
        <p className={styles.icon}>📄</p>
        <p className={styles.message}>Documents management coming soon...</p>
        <p className={styles.description}>
          Upload and manage your driver documents here.
        </p>
      </div>
    </div>
  );
}
