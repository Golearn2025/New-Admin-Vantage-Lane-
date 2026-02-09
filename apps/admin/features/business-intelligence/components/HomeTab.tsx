/**
 * HomeTab — Today Focus + Health Score + Next 7 Days
 *
 * REGULA 11: < 200 lines | REGULA 9: zero fetch in UI
 */

'use client';

import type { AIInsight, BIData } from '@entities/business-intelligence';
import { formatCurrency, formatNumber, formatPercent } from '@entities/business-intelligence';
import { Badge, Card, StatCard } from '@vantage-lane/ui-core';
import styles from './BIPage.module.css';

interface Props { data: BIData }

function healthColor(score: number): string {
  if (score >= 70) return 'var(--color-success-500)';
  if (score >= 40) return 'var(--color-warning-500)';
  return 'var(--color-danger-default)';
}

function categoryBadgeColor(cat: AIInsight['category']): 'danger' | 'warning' | 'success' | 'info' | 'neutral' {
  const map: Record<string, 'danger' | 'warning' | 'success' | 'info' | 'neutral'> = {
    risk: 'danger', action: 'warning', opportunity: 'success', growth: 'info', system: 'neutral',
  };
  return map[cat] ?? 'neutral';
}

export function HomeTab({ data }: Props) {
  const { health, insights, bookings, revenue, drivers, fleet } = data;
  const todayFocus = insights.filter(i => i.priority === 'critical' || i.priority === 'high').slice(0, 5);

  return (
    <div className={styles.tabContent}>
      {/* KPI Overview */}
      <div className={styles.statsGrid6}>
        <StatCard label="Total Bookings" value={formatNumber(bookings.totalBookings)} chartColor="theme" />
        <StatCard label="Revenue" value={formatCurrency(bookings.totalRevenue)} chartColor="success" />
        <StatCard label="Platform Profit" value={formatCurrency(bookings.platformProfit)} chartColor="info" />
        <StatCard label="Drivers" value={formatNumber(drivers.totalDrivers)} chartColor="warning" />
        <StatCard label="Fleet" value={formatNumber(fleet.totalVehicles)} chartColor="theme" />
        <StatCard label="Completion" value={formatPercent(bookings.completionRate)} chartColor="success" />
      </div>

      {/* Business Health Score */}
      <Card>
        <div style={{ padding: 'var(--spacing-4)' }}>
          <h3 className={styles.sectionTitle}>Business Health Score</h3>
          <div className={styles.healthBar} style={{ marginTop: 'var(--spacing-3)' }}>
            <span className={styles.healthScore} style={{ color: healthColor(health.overall) }}>
              {health.overall}
            </span>
            <div className={styles.healthTrack}>
              <div
                className={styles.healthFill}
                style={{ width: `${health.overall}%`, background: healthColor(health.overall) }}
              />
            </div>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>/100</span>
          </div>
          <div className={styles.statsGrid6} style={{ marginTop: 'var(--spacing-3)' }}>
            <HealthMetric label="Revenue" value={health.revenueStability} />
            <HealthMetric label="Clients" value={health.clientDiversification} />
            <HealthMetric label="Completion" value={health.completionRate} />
            <HealthMetric label="Fleet" value={health.fleetUtilization} />
            <HealthMetric label="Drivers" value={health.driverAvailability} />
          </div>
        </div>
      </Card>

      {/* Today Focus */}
      <Card>
        <div style={{ padding: 'var(--spacing-4)' }}>
          <h3 className={styles.sectionTitle}>Today Focus</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
            {todayFocus.length === 0 && (
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-secondary)' }}>No critical items today.</p>
            )}
            {todayFocus.map(insight => (
              <div key={insight.id} className={styles.insightCard} data-category={insight.category}>
                <div className={styles.insightBody}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                    <Badge color={categoryBadgeColor(insight.category)} size="sm" variant="solid">
                      {insight.category.toUpperCase()}
                    </Badge>
                    <span className={styles.insightTitle}>{insight.title}</span>
                  </div>
                  <p className={styles.insightDesc}>{insight.description}</p>
                  <p className={styles.insightRec}>{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function HealthMetric({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 'var(--font-sm)', fontWeight: 'var(--font-weight-semibold)' as string, color: healthColor(value) }}>{value}</div>
    </div>
  );
}
