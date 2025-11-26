/**
 * System Health Tab Component
 * 
 * Displays real-time health metrics from /api/health endpoint
 * Conform RULES.md: <200 linii, TypeScript strict, ui-core components
 */

'use client';

import { useHealthMetrics } from '../hooks/useHealthMetrics';
import { StatCard, Card, Badge } from '@vantage-lane/ui-core';
import styles from './SystemHealthTab.module.css';

export function SystemHealthTab(): JSX.Element {
  const { health, metrics, loading, error } = useHealthMetrics();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading health data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Failed to load health data: {error}</p>
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';
  const uptime = health ? Math.floor(health.uptime / 3600) : 0;

  return (
    <div className={styles.container}>
      {/* Status Overview */}
      <div className={styles.statusGrid}>
        <StatCard
          title="System Status"
          value={isHealthy ? "Operational" : "Issues"}
          icon="Activity"
          trendValue={isHealthy ? "99.9%" : "95.2%"}
        />

        <StatCard
          title="Response Time"
          value={`${health?.responseTime || 0}ms`}
          icon="Zap"
          trendValue={metrics ? `${metrics.averageResponseTime}ms avg` : "N/A"}
        />

        <StatCard
          title="Uptime"
          value={`${uptime}h`}
          icon="Clock"
          trendValue="99.9%"
        />

        <StatCard
          title="Active Users"
          value={metrics?.activeUsers.toString() || "0"}
          icon="Users"
          trendValue="+12% today"
        />
      </div>

      {/* Health Checks Detail */}
      <div className={styles.checksGrid}>
        <Card className={styles.checksCard}>
          <h3 className={styles.cardTitle}>Health Checks</h3>
          
          <div className={styles.checksList}>
            <div className={styles.checkItem}>
              <span className={styles.checkName}>Environment Variables</span>
              <Badge color={health?.checks.env.status === 'ok' ? 'success' : 'danger'}>
                {health?.checks.env.status === 'ok' ? 'OK' : 'Error'}
              </Badge>
            </div>
            
            <div className={styles.checkItem}>
              <span className={styles.checkName}>Database Connection</span>
              <Badge color={health?.checks.database.status === 'ok' ? 'success' : 'danger'}>
                {health?.checks.database.status === 'ok' ? 'Connected' : 'Error'}
              </Badge>
            </div>
            
            <div className={styles.checkItem}>
              <span className={styles.checkName}>Performance Monitoring</span>
              <Badge color={health?.checks.performance?.status === 'ok' ? 'success' : 'danger'}>
                {health?.checks.performance?.status === 'ok' ? 'Active' : 'Error'}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className={styles.metricsCard}>
          <h3 className={styles.cardTitle}>Performance Metrics</h3>
          
          <div className={styles.metricsList}>
            <div className={styles.metricItem}>
              <span className={styles.metricName}>Total Requests (24h)</span>
              <span className={styles.metricValue}>{metrics?.totalRequests.toLocaleString() || 'N/A'}</span>
            </div>
            
            <div className={styles.metricItem}>
              <span className={styles.metricName}>Average Response Time</span>
              <span className={styles.metricValue}>{metrics?.averageResponseTime || 0}ms</span>
            </div>
            
            <div className={styles.metricItem}>
              <span className={styles.metricName}>Error Rate</span>
              <span className={styles.metricValue}>{metrics?.errorRate || 0}%</span>
            </div>
            
            <div className={styles.metricItem}>
              <span className={styles.metricName}>Database Connections</span>
              <span className={styles.metricValue}>{metrics?.databaseConnections || 0}/20</span>
            </div>
            
            <div className={styles.metricItem}>
              <span className={styles.metricName}>Memory Usage</span>
              <span className={styles.metricValue}>{metrics?.memoryUsage || 0}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
