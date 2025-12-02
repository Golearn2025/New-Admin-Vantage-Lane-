/**
 * Monitoring Page
 * 
 * Cross-project monitoring dashboard cu real Sentry data
 * Conform RULES.md: <200 linii, TypeScript strict, ui-core components
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Tabs, type Tab } from '@vantage-lane/ui-core';
import { CrossProjectTab } from './CrossProjectTab';
import { SecurityMonitoringTab } from './SecurityMonitoringTab';
import { PerformanceOverviewTab } from './PerformanceOverviewTab';
import styles from './MonitoringPage.module.css';

export function MonitoringPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('cross-project');

  const tabs: Tab[] = [
    {
      id: 'cross-project',
      label: 'Cross-Project',
      icon: 'users',
      content: <CrossProjectTab />
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'settings',
      content: <SecurityMonitoringTab />
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: 'lightning',
      content: <PerformanceOverviewTab />
    }
  ];

  return (
    <div className={styles.container || ""}>
      {/* Header */}
      <div className={styles.header || ""}>
        <div className={styles.headerContent || ""}>
          <h1 className={styles.title || ""}>Ecosystem Monitoring</h1>
          <p className={styles.description || ""}>
            Real-time monitoring pentru întregul ecosistem Vantage Lane
          </p>
        </div>
        <div className={styles.headerActions || ""}>
          <span className={styles.lastUpdated || ""}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer || ""}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          fullWidth={false}
        />
      </div>
    </div>
  );
}
