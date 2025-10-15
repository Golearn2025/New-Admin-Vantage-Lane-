/**
 * AppShell Demo - All Variants & Responsive
 * 
 * Demonstrează AppShell component cu toate variantele:
 * - Admin vs Operator roles
 * - XS/MD/XL responsive behavior
 * - Interactive features (navigation, dropdown, search)
 */

'use client';

import { AppShell } from '@admin/shared/ui/composed/appshell';
import { usePathname } from 'next/navigation';
import styles from './appshell.module.css';

export default function AppShellDemo() {
  const pathname = usePathname();

  // Pentru demo, user role e admin
  const userRole = 'admin' as const;

  return (
    <div className={styles.demoContainer}>
      <h1 className={styles.title}>AppShell Component Demo</h1>
      <p className={styles.subtitle}>
        RBAC Navigation System cu responsive design și interactive features
      </p>

      {/* Admin Role Demo */}
      <section className={styles.demoSection}>
        <h2 className={styles.sectionTitle}>👑 Admin Role - Full Access</h2>
        <p className={styles.sectionDesc}>
          Complete menu cu toate funcționalitățile: Dashboard, Bookings, Users, Documents, Support, etc.
        </p>
        
        <div className={styles.demoFrame}>
          <AppShell
            role={userRole}
            currentPath={pathname}
          >
            <div className={styles.demoContent}>
              <h3>Admin Dashboard Content</h3>
              <p>✅ 14 menu items available</p>
              <p>✅ Sign Out în sidebar footer</p>
              <p>✅ User dropdown în topbar</p>
              <p>✅ Responsive mobile drawer</p>
              
              <div className={styles.featureList}>
                <h4>🎯 Key Features:</h4>
                <ul>
                  <li>🔒 Role-based access control</li>
                  <li>📱 Mobile responsive (drawer overlay)</li>
                  <li>🎨 Cristi&apos;s carbon fiber background</li>
                  <li>♿ A11y compliant (skip links, aria-*)</li>
                  <li>🎭 Glass blur effects pe toate surfaces</li>
                </ul>
              </div>
            </div>
          </AppShell>
        </div>
      </section>

      {/* Operator Role Demo */}
      <section className={styles.demoSection}>
        <h2 className={styles.sectionTitle}>👤 Operator Role - Limited Access</h2>
        <p className={styles.sectionDesc}>
          Menu limitat pentru operator: doar Bookings, Drivers, Documents, Support, Settings
        </p>
        
        <div className={styles.demoFrame}>
          <AppShell
            role="operator"
            currentPath="/bookings"
          >
            <div className={styles.demoContent}>
              <h3>Operator Dashboard Content</h3>
              <p>✅ 5 menu items available</p>
              <p>✅ Limited settings access</p>
              <p>✅ Same UI, different permissions</p>
              
              <div className={styles.rbacDemo}>
                <h4>🔐 RBAC Differences:</h4>
                <div className={styles.comparison}>
                  <div>
                    <strong>Admin has:</strong>
                    <ul>
                      <li>All Users management</li>
                      <li>Payments & Refunds</li>
                      <li>Monitoring & Health</li>
                      <li>Audit History</li>
                      <li>Full Settings</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Operator has:</strong>
                    <ul>
                      <li>Only Drivers</li>
                      <li>Basic operations</li>
                      <li>Limited settings</li>
                      <li>Support tickets</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </AppShell>
        </div>
      </section>

      {/* Responsive Demo */}
      <section className={styles.demoSection}>
        <h2 className={styles.sectionTitle}>📱 Responsive Design</h2>
        <p className={styles.sectionDesc}>
          Testează resize browser pentru a vedea mobile drawer behavior
        </p>
        
        <div className={styles.responsiveGrid}>
          <div className={styles.responsiveItem}>
            <h4>🖥️ Desktop (&gt;768px)</h4>
            <ul>
              <li>Persistent sidebar</li>
              <li>Full user info în topbar</li>
              <li>Search 400px width</li>
            </ul>
          </div>
          <div className={styles.responsiveItem}>
            <h2>AppShell Demo</h2>
            <p>Navigation system cu RBAC roles si mobile drawer.</p>
            <ul>
              <li>Hamburger menu → drawer</li>
              <li>User info hidden</li>
              <li>Search takes full width</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className={styles.demoSection}>
        <h2 className={styles.sectionTitle}>⚙️ Technical Implementation</h2>
        <div className={styles.techGrid}>
          <div className={styles.techItem}>
            <h4>🏗️ Architecture</h4>
            <ul>
              <li>Single source AppShell component</li>
              <li>Props-based configuration</li>
              <li>No business logic în UI</li>
              <li>Reutilizabil across pages</li>
            </ul>
          </div>
          <div className={styles.techItem}>
            <h4>🎨 Styling</h4>
            <ul>
              <li>CSS Modules pentru encapsulation</li>
              <li>Design tokens only</li>
              <li>Zero inline colors</li>
              <li>Consistent spacing/typography</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
