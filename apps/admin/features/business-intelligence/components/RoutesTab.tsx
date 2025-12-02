/**
 * RoutesTab Component
 *
 * Route frequency analysis with top routes and patterns.
 * File: < 200 lines (RULES.md compliant)
 */

import React, { useMemo } from 'react';
import { Card, Badge, Icon, StatCard } from '@vantage-lane/ui-core';
import { formatNumber } from '@entities/business-intelligence';
import { EmptyStateCard } from './EmptyStateCard';
import type { BusinessIntelligenceData } from '@entities/business-intelligence';
import styles from './RoutesTab.module.css';

interface RoutesTabProps {
  data: BusinessIntelligenceData | null;
  hasData: boolean;
}

export function RoutesTab({ data, hasData }: RoutesTabProps) {
  if (!hasData || !data?.topRoutes.length) {
    return (
      <EmptyStateCard 
        type="routes" 
        icon="trending-up" 
        title="Route Analysis"
      />
    );
  }

  const { topRoutes } = data;

  // Memoize route items to prevent re-creation on every render
  const routeItems = useMemo(() => 
    topRoutes.slice(0, 10).map((route, index) => (
      <div key={`${route.pickupLocation}-${route.destination}`} className={styles.routeItem}>
        <div className={styles.routeRank}>
          <span className={styles.rankNumber}>#{index + 1}</span>
        </div>
        
        <div className={styles.routeDetails}>
          <div className={styles.routeInfo}>
            <div className={styles.routePath}>
              <Icon name="star" size="sm" />
              <span className={styles.pickupLocation}>{route.pickupLocation}</span>
              <Icon name="arrow-right" size="sm" />
              <span className={styles.destination}>{route.destination}</span>
            </div>
            
            <div className={styles.routeMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Frequency:</span>
                <span className={styles.metricValue}>{formatNumber(route.frequency)} trips</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Share:</span>
                <span className={styles.metricValue}>{route.percentage.toFixed(1)}% of total</span>
              </div>
            </div>
          </div>
          
          <div className={styles.routeBadges}>
            <Badge color="info" variant="outline" size="sm">
              Popular Route
            </Badge>
          </div>
        </div>

        <div className={styles.routeProgress}>
          <div 
            className={styles.progressBar}
            style={{ width: `${(route.frequency / (topRoutes[0]?.frequency || 1)) * 100}%` }}
          />
        </div>
      </div>
    )), 
    [topRoutes]
  );
  const topRoute = topRoutes[0] || {
    pickupLocation: 'Unknown',
    destination: 'Unknown',
    frequency: 0,
    percentage: 0
  };

  return (
    <div className={styles.routesContainer}>
      {/* Route Statistics */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Routes"
          value={formatNumber(topRoutes.length)}
          chartColor="theme"
        />
        
        <StatCard
          label="Most Popular"
          value={`${topRoute.percentage}%`}
          chartColor="success"
        />
        
        <StatCard
          label="Top Route Frequency"
          value={formatNumber(topRoute.frequency)}
          chartColor="info"
        />
        
        <StatCard
          label="Route Coverage"
          value={`${Math.min(100, topRoutes.length * 5)}%`}
          chartColor="warning"
        />
      </div>

      {/* Top Routes List */}
      <Card className={styles.routesCard || ''}>
        <div className={styles.routesHeader}>
          <Icon name="trending-up" size="sm" />
          <h3 className={styles.routesTitle}>Top Routes</h3>
          <Badge color="info" variant="outline" size="sm">
            Live Data
          </Badge>
        </div>

        <div className={styles.routesList}>
          {routeItems}
        </div>
      </Card>

      {/* Route Insights */}
      <Card className={styles.insightsCard || ''}>
        <div className={styles.insightsHeader}>
          <Icon name="star" size="sm" />
          <h3 className={styles.insightsTitle}>Route Insights</h3>
        </div>

        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <Icon name="trending-up" size="sm" />
            <div>
              <strong>Most Popular:</strong> {topRoute.pickupLocation} → {topRoute.destination} ({topRoute.percentage}% of all rides)
            </div>
          </div>
          
          <div className={styles.insightItem}>
            <Icon name="trending-up" size="sm" />
            <div>
              <strong>Route Diversity:</strong> {topRoutes.length} unique routes tracked
            </div>
          </div>
          
          <div className={styles.insightItem}>
            <Icon name="star" size="sm" />
            <div>
              <strong>Optimization:</strong> Focus driver availability on top 3 routes for maximum efficiency
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
