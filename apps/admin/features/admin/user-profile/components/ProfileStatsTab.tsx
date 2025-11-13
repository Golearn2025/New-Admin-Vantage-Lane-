'use client';

/**
 * Profile Stats Tab - Charts & Analytics
 * Shows earnings, jobs, and performance stats
 * 
 * MODERN & PREMIUM Design with glass morphism
 */

import React, { useState, useEffect } from 'react';
import { Car, CheckCircle, Hourglass } from 'lucide-react';
import { getDriverStats } from '@entities/driver/api/driverApi';
import { getCustomerStats } from '@entities/customer/api/customerApi';
import { getOperatorStats } from '@entities/operator/api/operatorApi';
import type { UserType } from '../types';
import styles from './ProfileStatsTab.module.css';

export interface ProfileStatsTabProps {
  userId: string;
  userType: UserType;
  className?: string;
}

interface Stats {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalEarnings: number;
  rating: number;
}

export function ProfileStatsTab({ userId, userType, className }: ProfileStatsTabProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        let data;
        
        if (userType === 'driver') {
          data = await getDriverStats(userId);
        } else if (userType === 'customer') {
          data = await getCustomerStats(userId);
        } else if (userType === 'operator') {
          data = await getOperatorStats(userId);
        } else {
          data = { totalJobs: 0, completedJobs: 0, pendingJobs: 0 };
        }
        
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId, userType]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.empty}>
        <p>No statistics available</p>
      </div>
    );
  }

  const totalJobs = stats.totalJobs || stats.totalBookings || stats.totalDrivers || 0;
  const completedJobs = stats.completedJobs || stats.completedBookings || 0;
  const completionRate = totalJobs > 0 
    ? Math.round((completedJobs / totalJobs) * 100) 
    : 0;

  const titleMap = {
    driver: 'Performance Statistics',
    customer: 'Booking Statistics',
    operator: 'Organization Statistics',
    admin: 'Admin Statistics',
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h2 className={styles.title}>{titleMap[userType] || 'Statistics'}</h2>
      
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>
              {userType === 'operator' ? 'Total Drivers' : userType === 'customer' ? 'Total Bookings' : 'Total Jobs'}
            </span>
            <span className={styles.statValue}>{totalJobs}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><CheckCircle size={18} strokeWidth={2} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Completed</span>
            <span className={styles.statValue}>{completedJobs}</span>
          </div>
        </div>

        {userType !== 'operator' && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Hourglass size={18} strokeWidth={2} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Pending</span>
              <span className={styles.statValue}>{stats.pendingJobs || stats.pendingBookings || 0}</span>
            </div>
          </div>
        )}

        {userType === 'operator' && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Car size={18} strokeWidth={2} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Total Vehicles</span>
              <span className={styles.statValue}>{stats.totalVehicles || 0}</span>
            </div>
          </div>
        )}

        {stats?.rating && stats.rating > 0 && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⭐</div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>Rating</span>
              <span className={styles.statValue}>{(stats.rating || 0).toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Completion Rate</span>
          <span className={styles.progressPercent}>{completionRate}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Earnings Section - Only for Drivers */}
      {userType === 'driver' && stats?.totalEarnings !== undefined && (
        <div className={styles.earningsSection}>
          <h3 className={styles.sectionTitle}>Earnings Overview</h3>
          <div className={styles.earningsCard}>
            <div className={styles.earningsAmount}>
              <span className={styles.currency}>£</span>
              <span className={styles.amount}>{(stats.totalEarnings || 0).toFixed(2)}</span>
            </div>
            <p className={styles.earningsLabel}>Total Earnings</p>
            <p className={styles.earningsNote}>Calculated from completed jobs</p>
          </div>
        </div>
      )}
    </div>
  );
}
