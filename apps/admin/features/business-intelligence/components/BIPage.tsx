/**
 * Business Intelligence Page — Main Shell
 *
 * Tab navigation + loading state. Zero logic in UI.
 * REGULA 11: < 200 lines
 */

'use client';

import type { Tab } from '@vantage-lane/ui-core';
import { Tabs } from '@vantage-lane/ui-core';
import { RefreshCw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useBIData } from '../hooks/useBIData';
import { AdvisorTab } from './AdvisorTab';
import styles from './BIPage.module.css';
import { BusinessTab } from './BusinessTab';
import { CustomersTab } from './CustomersTab';
import { DriversFleetTab } from './DriversFleetTab';
import { HomeTab } from './HomeTab';
import { LaunchTab } from './LaunchTab';
import { MoneyTab } from './MoneyTab';
import { RoutesTab } from './RoutesTab';

export function BusinessIntelligencePage() {
  const { data, isLoading, error, refetch } = useBIData();
  const [activeTab, setActiveTab] = useState('home');

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={32} className={styles.spinner} />
        <p>Analyzing your business data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.loading}>
        <XCircle size={32} />
        <p>{error ?? 'Failed to load data'}</p>
        <button className={styles.retryBtn} onClick={refetch}>Retry</button>
      </div>
    );
  }

  const tabs: Tab[] = [
    { id: 'home', label: 'Home', icon: 'lightning', tabColor: 'theme', content: <HomeTab data={data} /> },
    { id: 'business', label: 'Business', icon: 'chart-bar', tabColor: 'info', badge: data.bookings.totalBookings, content: <BusinessTab data={data} /> },
    { id: 'money', label: 'Money', icon: 'wallet', tabColor: 'success', content: <MoneyTab data={data} /> },
    { id: 'routes', label: 'Routes', icon: 'trending-up', tabColor: 'warning', badge: data.routes.topRoutes.length, content: <RoutesTab data={data} /> },
    { id: 'drivers', label: 'Drivers & Fleet', icon: 'users', tabColor: 'magenta', badge: data.drivers.totalDrivers, content: <DriversFleetTab data={data} /> },
    { id: 'customers', label: 'Customers', icon: 'user-circle', tabColor: 'info', badge: data.customers.totalCustomers, content: <CustomersTab data={data} /> },
    { id: 'advisor', label: 'AI Advisor', icon: 'star', tabColor: 'magenta', badge: data.insights.length, content: <AdvisorTab data={data} /> },
    { id: 'launch', label: 'Launch Plan', icon: 'arrow-right', tabColor: 'theme', content: <LaunchTab data={data} /> },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Business Intelligence</h1>
          <p className={styles.subtitle}>AI-powered insights and advisor for your business</p>
        </div>
      </header>
      <div className={styles.content}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
