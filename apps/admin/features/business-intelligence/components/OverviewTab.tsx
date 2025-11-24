/**
 * OverviewTab Component
 *
 * Main dashboard overview with stats and AI insights.
 * File: < 200 lines (RULES.md compliant)
 */

import React from 'react';
import { Card, StatCard, Badge, Icon } from '@vantage-lane/ui-core';
import { formatNumber, formatCurrency, getInsightColor, getInsightIcon } from '@entities/business-intelligence';
import { EmptyStateCard } from './EmptyStateCard';
import type { BusinessIntelligenceData } from '@entities/business-intelligence';
import styles from './OverviewTab.module.css';

interface OverviewTabProps {
  data: BusinessIntelligenceData | null;
  hasData: boolean;
}

export function OverviewTab({ data, hasData }: OverviewTabProps) {
  if (!hasData || !data?.bookingStats) {
    return (
      <EmptyStateCard 
        type="bookings" 
        icon="chart-bar" 
        title="Business Overview"
      />
    );
  }

  const { bookingStats, aiInsights } = data;

  return (
    <div className={styles.overviewContainer}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          label="Total Bookings"
          value={formatNumber(bookingStats.totalBookings)}
          chartColor="theme"
        />
        
        <StatCard
          label="Completed Bookings"
          value={formatNumber(bookingStats.completedBookings)}
          chartColor="success"
        />
        
        <StatCard
          label="Pending Bookings"
          value={formatNumber(bookingStats.pendingBookings)}
          chartColor="warning"
        />
        
        <StatCard
          label="Average Distance"
          value={`${bookingStats.averageDistance} mile`}
          chartColor="info"
        />
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className={styles.insightsCard || ''}>
          <div className={styles.insightsHeader}>
            <Icon name="star" size="sm" />
            <h3 className={styles.insightsTitle}>AI Business Insights</h3>
            <Badge color="magenta" variant="solid" size="sm">
              Live
            </Badge>
          </div>

          <div className={styles.insightsList}>
            {aiInsights.map((insight) => (
              <div key={insight.id} className={styles.insightItem}>
                <div className={styles.insightIcon}>
                  <Icon 
                    name={getInsightIcon(insight.type) as any} 
                    size="sm" 
                  />
                </div>
                
                <div className={styles.insightContent}>
                  <div className={styles.insightHeader}>
                    <h4 className={styles.insightTitle}>{insight.title}</h4>
                    <Badge 
                      color={getInsightColor(insight.impact) as any} 
                      size="sm"
                      variant="solid"
                    >
                      {insight.impact}
                    </Badge>
                  </div>
                  
                  <p className={styles.insightDescription}>
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className={styles.actionsCard || ''}>
        <h3 className={styles.actionsTitle}>Quick Analysis</h3>
        
        <div className={styles.actionButtons}>
          <div className={styles.actionButton}>
            <Icon name="clock" size="sm" />
            <span>View Peak Hours</span>
          </div>
          
          <div className={styles.actionButton}>
            <Icon name="star" size="sm" />
            <span>Analyze Routes</span>
          </div>
          
          <div className={styles.actionButton}>
            <Icon name="users" size="sm" />
            <span>Driver Performance</span>
          </div>
          
          <div className={styles.actionButton}>
            <Icon name="wallet" size="sm" />
            <span>Revenue Details</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
