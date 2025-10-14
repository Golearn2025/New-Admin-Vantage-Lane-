/**
 * AppShell Demo Page - UI Kit
 * 
 * Demonstrează ambele variante A (Minimal) și B (Luxe) pentru AppShell.
 * Showcase RBAC, responsive behavior și A11y features.
 */

'use client';

import React, { useState } from 'react';
import { AppShell } from '@admin/shared/ui/composed/appshell';
import { UserRole } from '@admin/shared/ui/composed/appshell/types';
import styles from './appshell.module.css';

export default function AppShellPage() {
  const [currentVariant, setCurrentVariant] = useState<'minimal' | 'luxe'>('minimal');
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentPath, setCurrentPath] = useState('/dashboard');

  return (
    <div className={styles.container}>
      {/* Demo Controls */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <h3>Variant</h3>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.controlButton} ${currentVariant === 'minimal' ? styles.active : ''}`}
              onClick={() => setCurrentVariant('minimal')}
            >
              A - Minimal
            </button>
            <button
              className={`${styles.controlButton} ${currentVariant === 'luxe' ? styles.active : ''}`}
              onClick={() => setCurrentVariant('luxe')}
            >
              B - Luxe
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <h3>Role</h3>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.controlButton} ${currentRole === 'admin' ? styles.active : ''}`}
              onClick={() => setCurrentRole('admin')}
            >
              Admin
            </button>
            <button
              className={`${styles.controlButton} ${currentRole === 'operator' ? styles.active : ''}`}
              onClick={() => setCurrentRole('operator')}
            >
              Operator
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <h3>Current Path</h3>
          <select
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className={styles.pathSelect}
          >
            <option value="/dashboard">Dashboard</option>
            <option value="/bookings">Bookings</option>
            <option value="/bookings/active">Bookings - Active</option>
            <option value="/users">Users</option>
            <option value="/users/drivers">Users - Drivers</option>
            <option value="/documents">Documents</option>
            <option value="/support-tickets">Support</option>
            <option value="/settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Variant Info */}
      <div className={styles.variantInfo}>
        <div className={styles.infoCard}>
          <h4>
            {currentVariant === 'minimal' ? 'Variant A - Minimal' : 'Variant B - Luxe'}
            <span className={styles.recommended}>
              {currentVariant === 'minimal' ? ' (Recommended)' : ' (Premium)'}
            </span>
          </h4>
          <div className={styles.features}>
            {currentVariant === 'minimal' ? (
              <>
                <div className={styles.feature}>✅ Solid backgrounds</div>
                <div className={styles.feature}>✅ Best performance</div>
                <div className={styles.feature}>✅ Subtle gradient</div>
                <div className={styles.feature}>✅ Wide device support</div>
              </>
            ) : (
              <>
                <div className={styles.feature}>✨ Glass blur effects</div>
                <div className={styles.feature}>✨ Premium aesthetics</div>
                <div className={styles.feature}>⚠️ Requires modern browsers</div>
                <div className={styles.feature}>⚠️ Higher GPU usage</div>
              </>
            )}
          </div>
        </div>

        <div className={styles.infoCard}>
          <h4>RBAC - {currentRole === 'admin' ? 'Administrator' : 'Operator'}</h4>
          <div className={styles.roleInfo}>
            {currentRole === 'admin' ? (
              <div className={styles.feature}>
                Full access to all sections: Dashboard, Bookings, Users, Documents, Support, 
                Prices, Payments, Refunds, Disputes, Payouts, Monitoring, Project Health, 
                Audit History, Settings
              </div>
            ) : (
              <div className={styles.feature}>
                Limited access: Bookings, Drivers only, Documents, Support, Profile Settings
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo AppShell */}
      <div className={styles.demoContainer}>
        <div className={styles.demoLabel}>
          Live Demo - {currentVariant === 'minimal' ? 'Minimal' : 'Luxe'} | {currentRole}
        </div>
        
        <div className={styles.appShellDemo}>
          <AppShell
            role={currentRole}
            currentPath={currentPath}
            variant={currentVariant}
          >
            <div className={styles.demoContent}>
              <h1>Welcome to {currentPath}</h1>
              <p>This is a demo of the AppShell component with {currentVariant} variant.</p>
              
              <div className={styles.demoStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Current Role:</span>
                  <span className={styles.statValue}>{currentRole}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Variant:</span>
                  <span className={styles.statValue}>{currentVariant}</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Path:</span>
                  <span className={styles.statValue}>{currentPath}</span>
                </div>
              </div>

              <div className={styles.demoInstructions}>
                <h3>Test Features:</h3>
                <ul>
                  <li>🖱️ Click navigation items to see active states</li>
                  <li>📱 Resize window to test mobile drawer</li>
                  <li>⌨️ Use Tab/Enter for keyboard navigation</li>
                  <li>🔄 Switch variants to compare performance</li>
                  <li>👥 Change roles to see RBAC in action</li>
                </ul>
              </div>
            </div>
          </AppShell>
        </div>
      </div>
    </div>
  );
}
