/**
 * RevenueTab Component
 *
 * Revenue analysis by vehicle category and performance metrics.
 * File: < 200 lines (RULES.md compliant)
 */

import React from 'react';
import { Card, Badge, Icon, StatCard } from '@vantage-lane/ui-core';
import { formatNumber, formatCurrency } from '@entities/business-intelligence';
import { EmptyStateCard } from './EmptyStateCard';
import type { BusinessIntelligenceData } from '@entities/business-intelligence';
import styles from './RevenueTab.module.css';

interface RevenueTabProps {
  data: BusinessIntelligenceData | null;
  hasData: boolean;
}

export function RevenueTab({ data, hasData }: RevenueTabProps) {
  if (!hasData || !data?.vehicleStats.length) {
    return (
      <EmptyStateCard 
        type="revenue" 
        icon="wallet" 
        title="Revenue Analysis"
      />
    );
  }

  const { vehicleStats } = data;
  const totalRevenue = vehicleStats.reduce((sum, stat) => sum + stat.totalRevenue, 0);
  const totalBookings = vehicleStats.reduce((sum, stat) => sum + stat.bookingsCount, 0);
  const averageRevenue = totalRevenue / totalBookings;
  const topCategory = vehicleStats[0] || {
    vehicleCategory: 'Unknown',
    totalRevenue: 0,
    bookingsCount: 0,
    averageRating: 0,
    utilizationRate: 0
  };

  return (
    <div className={styles.revenueContainer}>
      {/* Revenue Statistics */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          chartColor="theme"
        />
        
        <StatCard
          label="Average per Ride"
          value={formatCurrency(averageRevenue)}
          chartColor="success"
        />
        
        <StatCard
          label="Top Category"
          value={topCategory.vehicleCategory}
          chartColor="info"
        />
        
        <StatCard
          label="Vehicle Categories"
          value={formatNumber(vehicleStats.length)}
          chartColor="warning"
        />
      </div>

      {/* Revenue by Category */}
      <Card className={styles.categoryCard || ''}>
        <div className={styles.categoryHeader}>
          <Icon name="wallet" size="sm" />
          <h3 className={styles.categoryTitle}>Revenue by Category</h3>
          <Badge color="info" variant="outline" size="sm">
            Live Data
          </Badge>
        </div>

        <div className={styles.categoryList}>
          {vehicleStats.map((category, index) => (
            <div key={category.vehicleCategory} className={styles.categoryItem}>
              <div className={styles.categoryRank}>
                <span className={styles.rankNumber}>#{index + 1}</span>
              </div>
              
              <div className={styles.categoryDetails}>
                <div className={styles.categoryName}>
                  <Icon name="dollar-circle" size="sm" />
                  <span>{category.vehicleCategory}</span>
                </div>
                
                <div className={styles.categoryMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Revenue:</span>
                    <span className={styles.metricValue}>{formatCurrency(category.totalRevenue)}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Bookings:</span>
                    <span className={styles.metricValue}>{formatNumber(category.bookingsCount)}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Rating:</span>
                    <span className={styles.metricValue}>{category.averageRating}⭐</span>
                  </div>
                </div>
                
                <div className={styles.categoryBadges}>
                  <Badge color="success" variant="outline" size="sm">
                    {category.utilizationRate}% utilized
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className={styles.categoryProgress}>
                <div 
                  className={styles.categoryProgressBar}
                  style={{
                    width: `${(category.totalRevenue / topCategory.totalRevenue) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Insights */}
      <Card className={styles.insightsCard || ''}>
        <div className={styles.insightsHeader}>
          <Icon name="star" size="sm" />
          <h3 className={styles.insightsTitle}>Revenue Insights</h3>
        </div>

        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <Icon name="trending-up" size="sm" />
            <div>
              <strong>Top Performer:</strong> {topCategory.vehicleCategory} generates {formatCurrency(topCategory.totalRevenue)} ({Math.round((topCategory.totalRevenue / totalRevenue) * 100)}% of total)
            </div>
          </div>
          
          <div className={styles.insightItem}>
            <Icon name="wallet" size="sm" />
            <div>
              <strong>Average Revenue:</strong> {formatCurrency(averageRevenue)} per ride across all categories
            </div>
          </div>
          
          <div className={styles.insightItem}>
            <Icon name="star" size="sm" />
            <div>
              <strong>Optimization:</strong> Focus marketing on {topCategory.vehicleCategory} category for maximum ROI
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
