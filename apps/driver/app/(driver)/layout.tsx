/**
 * Driver Layout - Driver Portal
 * Main layout with navigation
 */

import { redirect } from 'next/navigation';
import { getCurrentDriver } from '../../shared/lib/supabase/server';
import styles from './layout.module.css';

const navigationItems = [
  { label: 'My Profile', href: '/profile', icon: '👤', active: true },
  { label: 'My Earnings', href: '/earnings', icon: '💰', active: true },
  { label: 'My Bookings', href: '/bookings', icon: '📅', badge: 'Soon' },
  { label: 'Documents', href: '/documents', icon: '📄', badge: 'Soon' },
  { label: 'Support', href: '/support', icon: '💬', badge: 'Soon' },
];

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const driver = await getCurrentDriver();

  if (!driver) {
    redirect('/login');
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.logo}>Driver Portal</h2>
        </div>

        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${!item.active ? styles.navItemDisabled : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </a>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.user}>
            <div className={styles.userInfo}>
              <p className={styles.userName}>
                {driver.first_name} {driver.last_name}
              </p>
              <p className={styles.userRole}>Driver</p>
            </div>
          </div>
        </div>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
