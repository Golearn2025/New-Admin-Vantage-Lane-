/**
 * OperatorDashboard Component
 * Dashboard for operators - shows ONLY their data
 */

'use client';

import React from 'react';
import { useOperatorDashboard } from '../hooks/useOperatorDashboard';
import styles from './OperatorDashboard.module.css';

export function OperatorDashboard() {
  const { stats, recentDrivers, notifications, loading } = useOperatorDashboard();

  if (loading) {
    return <div className={styles.loading}>Loading your dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Operator Dashboard</h1>
        <p className={styles.subtitle}>Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Drivers</span>
            <span className={styles.statValue}>{stats.totalDrivers}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Pending Verification</span>
            <span className={styles.statValue}>{stats.pendingDrivers}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Active Drivers</span>
            <span className={styles.statValue}>{stats.activeDrivers}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Bookings</span>
            <span className={styles.statValue}>{stats.totalBookings}</span>
          </div>
        </div>
      </div>

      {/* Recent Drivers */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recently Added Drivers</h2>
        <div className={styles.driversList}>
          {recentDrivers.map((driver) => (
            <div key={driver.id} className={styles.driverCard}>
              <div className={styles.driverInfo}>
                <div className={styles.driverAvatar}>{driver.firstName[0]}{driver.lastName[0]}</div>
                <div>
                  <div className={styles.driverName}>{driver.firstName} {driver.lastName}</div>
                  <div className={styles.driverEmail}>{driver.email}</div>
                </div>
              </div>
              <span className={driver.status === 'pending' ? styles.statusPending : styles.statusActive}>
                {driver.status === 'pending' ? '⏳ Pending' : '✓ Active'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Notifications</h2>
        <div className={styles.notifsList}>
          {notifications.map((notif) => (
            <div key={notif.id} className={styles.notifCard}>
              <div className={styles.notifIcon}>{notif.type === 'driver_assigned' ? '👤' : '📋'}</div>
              <div className={styles.notifContent}>
                <div className={styles.notifTitle}>{notif.title}</div>
                <div className={styles.notifMessage}>{notif.message}</div>
                <div className={styles.notifTime}>{new Date(notif.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
