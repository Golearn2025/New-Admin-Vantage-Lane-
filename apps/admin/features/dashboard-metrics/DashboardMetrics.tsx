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

import { MetricCard } from '@vantage-lane/ui-dashboard';
import { useDashboardMetrics, type DashboardMetrics as DashboardMetricsType } from './useDashboardMetrics';
import { type CardSpec } from '@admin-shared/config/dashboard.spec';
import styles from './DashboardMetrics.module.css';

interface DashboardMetricsProps {
  specs: CardSpec[];
  startDate?: string;
  endDate?: string;
}

export function DashboardMetrics({ specs, startDate, endDate }: DashboardMetricsProps) {
  const { metrics, isLoading, isError, refresh } = useDashboardMetrics(
    startDate && endDate ? { startDate, endDate } : undefined
  );

  // Error state
  if (isError) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Failed to load metrics</h3>
        <p className={styles.errorMessage}>
          Unable to fetch dashboard data. Please try again.
        </p>
        <button onClick={refresh} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  // Loading state - show skeleton cards
  if (isLoading || !metrics) {
    return (
      <div
        className={styles.cardGrid}
      >
        {specs.map((spec, index) => {
          const value = (metrics && getCardValues(metrics)[spec.field]) ?? null;
          return (
            <MetricCard
              key={spec.key}
              spec={spec}
              value={value}
              loading={isLoading}
              variant="gradient"
              gradient={getGradientForIndex(index)}
            />
          );
        })}
      </div>
    );
  }

  // Map metrics to card values
  const cardValues = getCardValues(metrics);

  return (
    <div className={styles.metricsGrid}>
      {specs.map((spec, index) => {
        // Use spec.field to lookup value (not spec.key!)
        const value = cardValues[spec.field];
        const delta = getDeltaForMetric(spec.key); // TODO: Calculate from historical data
        
        return (
          <MetricCard
            key={spec.key}
            spec={spec}
            value={value ?? null}
            delta={delta}
            variant="gradient"
            gradient={getGradientForIndex(index)}
          />
        );
      })}
    </div>
  );
}

/**
 * Map API metrics to card display values - EXACT MATCH with spec fields
 */
function getCardValues(metrics: DashboardMetricsType): Record<string, number> {
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
function getGradientForIndex(index: number): 'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'gold' {
  const gradients: Array<'purple' | 'pink' | 'blue' | 'green' | 'orange' | 'gold'> = [
    'purple',   // Card 1 - violet premium
    'pink',     // Card 2 - roz premium  
    'blue',     // Card 3 - albastru premium
    'green',    // Card 4 - verde premium
    'orange',   // Card 5 - portocaliu premium
    'gold',     // Card 6 - auriu premium
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
