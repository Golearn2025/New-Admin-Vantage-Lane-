/**
 * Prices Management Page Component
 * 
 * Main page for managing pricing configuration with tabs
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { usePricesManagement } from '../hooks/usePricesManagement';
import { VehicleTypesTab } from './VehicleTypesTab';
import { AirportFeesTab } from './AirportFeesTab';
import { SurgeMultipliersTab } from './SurgeMultipliersTab';
import { PremiumServicesTab } from './PremiumServicesTab';
import styles from './PricesManagementPage.module.css';

type TabType = 'vehicles' | 'airports' | 'surge' | 'premium';

export function PricesManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { config, loading, error, isSaving, refresh } = usePricesManagement();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading pricing configuration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading pricing configuration: {error}
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No pricing configuration found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Pricing Management</h1>
          <p className={styles.subtitle}>
            Configure vehicle rates, airport fees, surge multipliers, and premium services
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            ✨ Add New
          </Button>
          <Button variant="secondary" onClick={() => refresh()} disabled={isSaving}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'vehicles' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          🚗 Vehicle Types
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'airports' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('airports')}
        >
          ✈️ Airport Fees
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'surge' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('surge')}
        >
          📈 Surge Multipliers
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'premium' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('premium')}
        >
          ⭐ Premium Services
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'vehicles' && <VehicleTypesTab config={config} />}
        {activeTab === 'airports' && <AirportFeesTab config={config} />}
        {activeTab === 'surge' && <SurgeMultipliersTab config={config} />}
        {activeTab === 'premium' && <PremiumServicesTab config={config} />}
      </div>
    </div>
  );
}
