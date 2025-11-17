/**
 * Support Tickets Management Page
 * Premium admin interface for managing all support tickets
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs } from '@vantage-lane/ui-core';
import { AllTicketsTab } from './AllTicketsTab';
import { CreateTicketTab } from './CreateTicketTab';
import { TicketStatsTab } from './TicketStatsTab';
import styles from './SupportTicketsManagementPage.module.css';

export function SupportTicketsManagementPage() {
  const [activeTab, setActiveTab] = useState('all-tickets');
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  const tabs = [
    {
      id: 'all-tickets',
      label: 'All Tickets',
      icon: 'users' as const,
    },
    {
      id: 'create-ticket',
      label: 'Create Ticket',
      icon: 'plus' as const,
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: 'chart-bar' as const,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Support Tickets</h1>
          <p className={styles.subtitle}>
            Manage customer, driver, and operator support requests
          </p>
        </div>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className={styles.content}>
        {activeTab === 'all-tickets' && <AllTicketsTab highlightId={highlightId} />}
        {activeTab === 'create-ticket' && <CreateTicketTab />}
        {activeTab === 'statistics' && <TicketStatsTab />}
      </div>
    </div>
  );
}
