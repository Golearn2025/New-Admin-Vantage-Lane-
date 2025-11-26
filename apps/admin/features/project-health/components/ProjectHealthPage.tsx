/**
 * Project Health Page
 * 
 * Real-time system monitoring dashboard
 * Conform RULES.md: <200 linii, TypeScript strict, 100% design tokens
 */

'use client';

import { useState } from 'react';
import { Tabs, type Tab } from '@vantage-lane/ui-core';
import { SystemHealthTab } from './SystemHealthTab';
import { PerformanceTab } from './PerformanceTab';
import { EventsTab } from './EventsTab';
import styles from './ProjectHealthPage.module.css';

export function ProjectHealthPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('health');

  const tabs: Tab[] = [
    {
      id: 'health',
      label: 'System Health',
      icon: 'Activity',
      content: <SystemHealthTab />
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: 'Zap',
      content: <PerformanceTab />
    },
    {
      id: 'events',
      label: 'Recent Events',
      icon: 'History',
      content: <EventsTab />
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Project Health</h1>
          <p className={styles.description}>
            Real-time system monitoring și performance metrics
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.lastUpdated}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
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
