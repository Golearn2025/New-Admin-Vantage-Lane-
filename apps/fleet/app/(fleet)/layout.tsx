/**
 * Fleet Layout - Fleet Portal
 * Main layout with navigation sidebar
 */

import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentOperatorId } from '../../shared/lib/supabase/server';
import styles from './layout.module.css';

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'My Drivers', href: '/drivers', icon: '👥' },
  { label: 'Bookings', href: '/bookings', icon: '📅' },
  { label: 'Vehicles', href: '/vehicles', icon: '🚗' },
  { label: 'Earnings', href: '/earnings', icon: '💰' },
];

export default async function FleetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const operatorId = await getCurrentOperatorId();

  // Redirect to login if not authenticated or not an operator
  if (!user || !operatorId) {
    redirect('/login');
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.logo}>Fleet Management</h2>
        </div>

        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navItem}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.user}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user.email}</p>
              <p className={styles.userRole}>Fleet Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
