/**
 * Performance Tab Component
 * 
 * Displays performance metrics and trends
 * Conform RULES.md: <200 linii, TypeScript strict
 */

'use client';

import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { StatCard, Card, DataTable } from '@vantage-lane/ui-core';
import { performanceColumns } from '../columns/performanceColumns';
import styles from './PerformanceTab.module.css';

export function PerformanceTab(): JSX.Element {
  const { metrics, recentRequests, loading } = usePerformanceMetrics();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Performance Overview */}
      <div className={styles.metricsGrid}>
        <StatCard
          title="Average Response Time"
          value={`${metrics.averageResponseTime}ms`}
          icon="Zap"
          trend={metrics.averageResponseTime < 300 ? "up" : "down"}
          trendValue={`${metrics.responseTimeTrend > 0 ? '+' : ''}${metrics.responseTimeTrend}ms vs yesterday`}
        />

        <StatCard
          title="Requests per Hour"
          value={metrics.requestsPerHour.toLocaleString()}
          icon="Activity"
          trend="up"
          trendValue={`+${metrics.requestGrowth}% vs last hour`}
        />

        <StatCard
          title="Error Rate"
          value={`${metrics.errorRate}%`}
          icon="AlertTriangle"
          trend={metrics.errorRate < 1 ? "up" : "down"}
          trendValue={metrics.errorRate < 1 ? "Excellent" : "Needs attention"}
        />

        <StatCard
          title="Cache Hit Rate"
          value={`${metrics.cacheHitRate}%`}
          icon="Database"
          trend={metrics.cacheHitRate > 80 ? "up" : "down"}
          trendValue={`${metrics.cacheHitRate > 80 ? 'Good' : 'Poor'} performance`}
        />
      </div>

      {/* Performance Details */}
      <div className={styles.detailsGrid}>
        {/* API Performance */}
        <Card className={styles.apiCard}>
          <h3 className={styles.cardTitle}>API Performance</h3>
          
          <div className={styles.apiMetrics}>
            <div className={styles.apiMetric}>
              <span className={styles.metricLabel}>Fastest Endpoint</span>
              <span className={styles.metricValue}>/api/health (12ms)</span>
            </div>
            
            <div className={styles.apiMetric}>
              <span className={styles.metricLabel}>Slowest Endpoint</span>
              <span className={styles.metricValue}>/api/bookings/list (245ms)</span>
            </div>
            
            <div className={styles.apiMetric}>
              <span className={styles.metricLabel}>Most Used</span>
              <span className={styles.metricValue}>/api/dashboard (1.2k/h)</span>
            </div>
          </div>
        </Card>

        {/* System Resources */}
        <Card className={styles.resourcesCard}>
          <h3 className={styles.cardTitle}>System Resources</h3>
          
          <div className={styles.resourceMetrics}>
            <div className={styles.resourceMetric}>
              <span className={styles.metricLabel}>CPU Usage</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress} 
                  style={{ width: `${metrics.cpuUsage}%` }}
                ></div>
              </div>
              <span className={styles.metricValue}>{metrics.cpuUsage}%</span>
            </div>
            
            <div className={styles.resourceMetric}>
              <span className={styles.metricLabel}>Memory Usage</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress} 
                  style={{ width: `${metrics.memoryUsage}%` }}
                ></div>
              </div>
              <span className={styles.metricValue}>{metrics.memoryUsage}%</span>
            </div>
            
            <div className={styles.resourceMetric}>
              <span className={styles.metricLabel}>Disk I/O</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progress} 
                  style={{ width: `${metrics.diskUsage}%` }}
                ></div>
              </div>
              <span className={styles.metricValue}>{metrics.diskUsage}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Requests Table */}
      <Card className={styles.requestsCard}>
        <h3 className={styles.cardTitle}>Recent Slow Requests</h3>
        <DataTable
          data={recentRequests}
          columns={performanceColumns}
          pagination={{ 
            pageSize: 10
          }}
        />
      </Card>
    </div>
  );
}
