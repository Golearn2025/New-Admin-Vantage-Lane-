/**
 * Notifications Management Page
 * Premium admin interface for managing all notifications
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs } from '@vantage-lane/ui-core';
import { MyNotificationsTab } from './MyNotificationsTab';
import { SendNotificationsTab } from './SendNotificationsTab';
import { NotificationHistoryTab } from './NotificationHistoryTab';
import { AutomatedNotificationsTab } from './AutomatedNotificationsTab';
import styles from './NotificationsManagementPage.module.css';

export function NotificationsManagementPage() {
  const [activeTab, setActiveTab] = useState('my-notifications');
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const tabs = [
    {
      id: 'my-notifications',
      label: 'My Notifications',
      icon: 'bell' as const,
    },
    {
      id: 'send',
      label: 'Send Notifications',
      icon: 'plus' as const,
    },
    {
      id: 'history',
      label: 'History',
      icon: 'chart-bar' as const,
    },
    {
      id: 'automated',
      label: 'Automated',
      icon: 'settings' as const,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications Management</h1>
          <p className={styles.subtitle}>
            Manage and send notifications to users across the platform
          </p>
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className={styles.content}>
        {activeTab === 'my-notifications' && <MyNotificationsTab highlightId={highlightId} />}
        {activeTab === 'send' && <SendNotificationsTab />}
        {activeTab === 'history' && <NotificationHistoryTab />}
        {activeTab === 'automated' && <AutomatedNotificationsTab />}
      </div>
    </div>
  );
}
