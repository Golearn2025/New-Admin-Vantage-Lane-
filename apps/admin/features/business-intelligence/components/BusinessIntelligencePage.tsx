/**
 * BusinessIntelligencePage Component
 *
 * Main BI dashboard with tabbed interface.
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React, { useState } from 'react';
import { Tabs, Icon, Badge } from '@vantage-lane/ui-core';
import { useBusinessIntelligence } from '../hooks/useBusinessIntelligence';
import { OverviewTab } from './OverviewTab';
import { PeakHoursTab } from './PeakHoursTab';
import { RoutesTab } from './RoutesTab';
import { RevenueTab } from './RevenueTab';
import { EmptyStateCard } from './EmptyStateCard';
import type { Tab } from '@vantage-lane/ui-core';
import styles from './BusinessIntelligencePage.module.css';

export function BusinessIntelligencePage() {
  const { data, isLoading, hasData, refetch } = useBusinessIntelligence();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate badge counts for tabs
  const getTabBadge = (tabId: string): string | number => {
    if (!hasData || !data) return 0;
    
    switch (tabId) {
      case 'overview':
        return data.bookingStats?.totalBookings || 0;
      case 'peak-hours':
        return data.peakHours.length;
      case 'routes':
        return data.topRoutes.length;
      case 'drivers':
        return data.driverPerformance.length;
      case 'revenue':
        return data.vehicleStats.length;
      default:
        return 0;
    }
  };

  const tabs: Tab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'chart-bar',
      tabColor: 'theme',
      badge: getTabBadge('overview'),
      content: <OverviewTab data={data} hasData={hasData} />,
    },
    {
      id: 'peak-hours', 
      label: 'Peak Hours',
      icon: 'clock',
      tabColor: 'info',
      badge: getTabBadge('peak-hours'),
      content: <PeakHoursTab data={data} hasData={hasData} />,
    },
    {
      id: 'routes',
      label: 'Routes',
      icon: 'trending-up',
      tabColor: 'success',
      badge: getTabBadge('routes'),
      content: <RoutesTab data={data} hasData={hasData} />,
    },
    {
      id: 'drivers',
      label: 'Drivers', 
      icon: 'users',
      tabColor: 'warning',
      badge: getTabBadge('drivers'),
      content: (
        <EmptyStateCard 
          type="drivers" 
          icon="users" 
          title="Driver Performance"
        />
      ),
    },
    {
      id: 'revenue',
      label: 'Revenue',
      icon: 'wallet',
      tabColor: 'magenta',
      badge: getTabBadge('revenue'),
      content: <RevenueTab data={data} hasData={hasData} />,
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <Icon name="refresh" size="lg" />
          <h2 className={styles.loadingTitle}>Loading Business Intelligence...</h2>
          <p className={styles.loadingDescription}>
            Analyzing booking data and generating insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1 className={styles.pageTitle}>Business Intelligence</h1>
            <p className={styles.pageDescription}>
              AI-powered analytics and insights for your business
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <Badge color={hasData ? 'success' : 'neutral'} variant="outline">
              <Icon name="chart-bar" size="sm" />
              <span>{hasData ? 'Data Available' : 'No Data Yet'}</span>
            </Badge>
            
            {data?.lastUpdated && (
              <Badge color="info" variant="outline" size="sm">
                <Icon name="clock" size="sm" />
                <span>Updated {new Date(data.lastUpdated).toLocaleTimeString()}</span>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Interface */}
      <div className={styles.tabsContainer}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          fullWidth={false}
          className={styles.tabs || ''}
        />
      </div>
    </div>
  );
}
