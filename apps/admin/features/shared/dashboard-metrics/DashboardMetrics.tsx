/**
 * DashboardMetrics Component
 *
 * Displays dashboard metric cards with real data from Supabase
 * - Fetches via useDashboardMetrics hook
 * - Shows loading skeleton
 * - Shows error state
 * - Converts pence to pounds for display
 *
 * MAX 200 LINES (current: 110)
 */

'use client';

import { useMemo } from 'react';
import { type CardSpec } from '@admin-shared/config/dashboard.types';
import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import { MetricCard } from '@vantage-lane/ui-dashboard';
import styles from './DashboardMetrics.module.css';
import {
  useDashboardMetrics,
  type DashboardMetrics as DashboardMetricsType,
} from './useDashboardMetrics';

interface DashboardMetricsProps {
  specs: CardSpec[];
  startDate?: string;
  endDate?: string;
}

export function DashboardMetrics({ specs, startDate, endDate }: DashboardMetricsProps) {
  const { user } = useCurrentUser();
  const { metrics, isLoading, isError, refresh } = useDashboardMetrics(
    startDate && endDate ? { startDate, endDate } : undefined
  );

  // Error state
  if (isError) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Failed to load metrics</h3>
        <p className={styles.errorMessage}>Unable to fetch dashboard data. Please try again.</p>
        <button onClick={refresh} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Filter specs based on user role
  const filteredSpecs = getSpecsForRole(specs, user?.role || 'admin');

  // Map metrics to card values (or null if loading)
  const cardValues = metrics ? getCardValues(metrics, user?.role || 'admin') : {};

  // Memoize metric cards to prevent re-creation on every render
  const metricCards = useMemo(() => 
    filteredSpecs.map((spec, index) => {
      // Use spec.field to lookup value (not spec.key!)
      const value = cardValues[spec.field] ?? null;
      const delta = getDeltaForMetric(spec.key); // TODO: Calculate from historical data

      return (
        <MetricCard
          key={spec.key}
          spec={spec}
          value={value}
          delta={delta}
          loading={isLoading}
          variant="gradient"
          gradient={getGradientForIndex(index)}
        />
      );
    }), 
    [filteredSpecs, cardValues, isLoading]
  );

  return (
    <div className={styles.metricsGrid}>
      {metricCards}
    </div>
  );
}

/**
 * Filter card specs based on user role
 */
function getSpecsForRole(specs: CardSpec[], role: string): CardSpec[] {
  if (role === 'operator') {
    // Operator only sees specific cards
    const allowedKeys = [
      'total_revenue',
      'total_bookings',
      'avg_booking_value',
      'operator_earnings',
      'cancelled_bookings',
      'scheduled_bookings',
    ];
    return specs.filter((spec) => allowedKeys.includes(spec.key));
  }

  // Admin sees all cards
  return specs;
}

/**
 * Map API metrics to card display values - USE DATA DIRECTLY FROM API
 * NO manual calculations - DB/API already handles role-based logic correctly
 */
function getCardValues(metrics: DashboardMetricsType, role: string): Record<string, number> {
  if (role === 'operator') {
    // Operator uses API data directly - RPC already filters for organization
    return {
      // API returns correct values for operator's organization
      total_revenue_pence: metrics.total_revenue_pence || 0, // Operator revenue from API
      total_bookings: metrics.total_bookings || 0, // Operator bookings count
      avg_booking_pence: metrics.avg_booking_pence || 0, // Operator avg booking from API
      operator_earnings_pence: metrics.platform_commission_pence || 0, // For operator context, this is their earnings

      // Operations data
      cancelled_count: metrics.cancelled_count || 0,
      scheduled_count: metrics.scheduled_count || 0,
    };
  }

  // Admin sees all data from API (no organization filter)
  return {
    // Row 1: Financial Overview
    total_revenue_pence: metrics.total_revenue_pence || 0,
    total_bookings: metrics.total_bookings || 0,
    avg_booking_pence: metrics.avg_booking_pence || 0,
    platform_commission_pence: metrics.platform_commission_pence || 0,

    // Row 2: Operations & Future
    operator_payout_pence: metrics.operator_payout_pence || 0,
    cancelled_count: metrics.cancelled_count || 0,
    refunds_total_pence: metrics.refunds_total_pence || 0,
    scheduled_count: metrics.scheduled_count || 0,
  };
}

/**
 * Get gradient color for card index
 */
function getGradientForIndex(
  index: number
): 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'gold' {
  const gradients: Array<'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'gold'> = [
    'purple', // Card 1 - violet premium
    'pink', // Card 2 - roz premium
    'blue', // Card 3 - albastru premium
    'green', // Card 4 - verde premium
    'orange', // Card 5 - portocaliu premium
    'gold', // Card 6 - auriu premium
  ];
  return gradients[index % gradients.length] || 'purple';
}

/**
 * Get delta (percentage change) for a metric
 *
 * TODO: Calculate delta from historical data
 * For now, return null (no trend indicator)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getDeltaForMetric(key: string): number | null {
  return null;
}
