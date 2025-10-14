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
                <div className={styles.feature}>✨ Charcoal Premium gradient</div>
                <div className={styles.feature}>💎 Glass blur effects</div>
                <div className={styles.feature}>🌟 Sophisticated dark aesthetic</div>
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

        <div className={styles.infoCard}>
          <h4>✨ Luxe Design - Charcoal Premium</h4>
          <div className={styles.features}>
            <div className={styles.feature}>🎨 Elegant charcoal gradient background</div>
            <div className={styles.feature}>💎 Glass blur effects on surfaces</div>
            <div className={styles.feature}>✨ Premium semi-transparent elements</div>
            <div className={styles.feature}>🌟 Sophisticated dark aesthetic</div>
          </div>
        </div>
      </div>

      {/* Demo Components - Doar părțile relevante */}
      <div className={styles.demoContainer}>
        <div className={styles.demoLabel}>
          Style Demo - {currentVariant === 'minimal' ? 'Minimal' : 'Luxe'} | {currentRole}
        </div>
        
        <div className={styles.styleDemo}>
          {/* Sidebar Preview */}
          <div className={`${styles.sidebarPreview} ${styles[currentVariant]}`}>
            <div className={styles.previewHeader}>
              <img src="/brand/logo.png" alt="Logo" className={styles.previewLogo} />
              <div className={styles.previewBrand}>
                <span className={styles.brandVantage}>Vantage</span>
                <span className={styles.brandLane}>Lane</span>
              </div>
            </div>
            
            <div className={styles.previewRole}>
              {currentRole === 'admin' ? 'ADMINISTRATOR' : 'OPERATOR'}
            </div>
            
            <div className={styles.previewMenu}>
              <div className={`${styles.previewItem} ${styles.active}`}>
                <span className={styles.previewIcon}>📊</span> Dashboard
              </div>
              <div className={styles.previewItem}>
                <span className={styles.previewIcon}>📅</span> Bookings
              </div>
              {currentRole === 'admin' && (
                <>
                  <div className={styles.previewItem}>
                    <span className={styles.previewIcon}>👥</span> Users
                  </div>
                  <div className={styles.previewItem}>
                    <span className={styles.previewIcon}>💳</span> Payments
                  </div>
                  <div className={styles.previewItem}>
                    <span className={styles.previewIcon}>⚙️</span> Settings
                  </div>
                </>
              )}
              {currentRole === 'operator' && (
                <div className={styles.previewItem}>
                  <span className={styles.previewIcon}>🚗</span> Drivers Only
                </div>
              )}
            </div>
          </div>
          
          {/* Content Preview */}
          <div className={`${styles.contentPreview} ${styles[currentVariant]}`}>
            <div className={`${styles.topbarPreview} ${styles[currentVariant]}`}>
              <span className={styles.previewSearch}>🔍 Search...</span>
              <span className={styles.previewUser}>👤 John Doe</span>
            </div>
            
            <div className={styles.pagePreview}>
              <h2>Variant {currentVariant === 'minimal' ? 'A - Minimal' : 'B - Luxe'}</h2>
              <p>Role: <strong>{currentRole}</strong></p>
              
              <div className={styles.variantFeatures}>
                {currentVariant === 'minimal' ? (
                  <>
                    <div className={styles.feature}>✅ Solid backgrounds</div>
                    <div className={styles.feature}>✅ Best performance</div>
                    <div className={styles.feature}>✅ Wide browser support</div>
                  </>
                ) : (
                  <>
                    <div className={styles.feature}>✨ Glass blur effects</div>
                    <div className={styles.feature}>✨ Premium aesthetics</div>
                    <div className={styles.feature}>✨ Backdrop filter magic</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.fullDemoLink}>
          <p>Pentru a vedea AppShell-ul complet în acțiune:</p>
          <a href="/dashboard" className={styles.fullDemoButton}>
            🚀 Deschide Full AppShell Demo
          </a>
        </div>
      </div>
    </div>
  );
}
