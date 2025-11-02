/**
 * Dashboard Page - Fleet Portal
 * Overview of fleet statistics and performance
 */

import { DollarSign } from 'lucide-react';
import { getCurrentOperatorId } from '../../../shared/lib/supabase/server';
import { createClient } from '../../../shared/lib/supabase/server';
import styles from './page.module.css';

interface OperatorStats {
  operator_name: string;
  total_bookings: number;
  active_drivers: number;
  total_earnings: number;
  total_driver_payouts: number;
  total_revenue: number;
  avg_booking_value: number;
}

async function getOperatorStats(operatorId: string): Promise<OperatorStats | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('operator_dashboard_stats')
    .select('*')
    .eq('organization_id', operatorId)
    .single();

  if (error) {
    console.error('Error fetching operator stats:', error);
    return null;
  }

  return data as OperatorStats;
}

export default async function FleetDashboardPage() {
  const operatorId = await getCurrentOperatorId();

  if (!operatorId) {
    return (
      <div className={styles.error}>
        <p>Unable to load operator data</p>
      </div>
    );
  }

  const stats = await getOperatorStats(operatorId);

  if (!stats) {
    return (
      <div className={styles.empty}>
        <p>No statistics available yet</p>
        <p className={styles.emptySubtext}>
          Start by adding drivers and accepting bookings
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fleet Dashboard</h1>
        <p className={styles.subtitle}>
          Welcome back, {stats.operator_name}
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📊</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Total Bookings</p>
            <p className={styles.cardValue}>{stats.total_bookings}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>👥</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Active Drivers</p>
            <p className={styles.cardValue}>{stats.active_drivers}</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}><DollarSign size={18} strokeWidth={2} /></div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>My Earnings</p>
            <p className={styles.cardValue}>
              £{(stats.total_earnings || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>💳</div>
          <div className={styles.cardContent}>
            <p className={styles.cardLabel}>Driver Payouts</p>
            <p className={styles.cardValue}>
              £{(stats.total_driver_payouts || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Revenue Overview</h2>
        <div className={styles.revenueCard}>
          <div className={styles.revenueItem}>
            <p className={styles.revenueLabel}>Total Revenue (After Platform Fee)</p>
            <p className={styles.revenueValue}>
              £{(stats.total_revenue || 0).toFixed(2)}
            </p>
          </div>
          <div className={styles.revenueItem}>
            <p className={styles.revenueLabel}>Average Booking Value</p>
            <p className={styles.revenueValue}>
              £{(stats.avg_booking_value || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
