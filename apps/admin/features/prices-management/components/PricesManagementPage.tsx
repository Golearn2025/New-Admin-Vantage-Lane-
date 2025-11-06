/**
 * Prices Management Page Component
 * 
 * Main page for managing pricing configuration with tabs
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@vantage-lane/ui-core';
import { Plus, RefreshCw, Car, Plane, TrendingUp, Star, Map, Settings, FileText, RotateCcw, Clock, Users } from 'lucide-react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import { VehicleTypesTab } from './VehicleTypesTab';
import { AirportFeesTab } from './AirportFeesTab';
import { SurgeMultipliersTab } from './SurgeMultipliersTab';
import { PremiumServicesTab } from './PremiumServicesTab';
import { ZoneFeesTab } from './ZoneFeesTab';
import { ServicePoliciesTab } from './ServicePoliciesTab';
import { GeneralPoliciesTab } from './GeneralPoliciesTab';
import styles from './PricesManagementPage.module.css';

type TabType = 'vehicles' | 'airports' | 'surge' | 'premium' | 'zones' | 'services' | 'policies' | 'return' | 'hourly' | 'fleet';

export function PricesManagementPage() {
  const { config, loading, error, isSaving, refresh } = usePricesManagement();
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');

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
          <Button 
            variant="secondary" 
            onClick={async () => {
              console.log('🔄 Refresh clicked!');
              await refresh();
              console.log('✅ Refresh complete!');
              alert('Data refreshed successfully!');
            }} 
            disabled={isSaving}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'vehicles' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          <Car className="h-4 w-4" />
          <span>Vehicle Types</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'airports' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('airports')}
        >
          <Plane className="h-4 w-4" />
          <span>Airport Fees</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'surge' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('surge')}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Surge Multipliers</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'premium' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('premium')}
        >
          <Star className="h-4 w-4" />
          <span>Premium Services</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'zones' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('zones')}
        >
          <Map className="h-4 w-4" />
          <span>Zone Fees</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'services' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('services')}
        >
          <Settings className="h-4 w-4" />
          <span>Service Policies</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'policies' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          <FileText className="h-4 w-4" />
          <span>General Policies</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'return' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('return')}
        >
          <RotateCcw className="h-4 w-4" />
          <span>Return Settings</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'hourly' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('hourly')}
        >
          <Clock className="h-4 w-4" />
          <span>Hourly Hire</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fleet' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Users className="h-4 w-4" />
          <span>Fleet Settings</span>
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'vehicles' && <VehicleTypesTab config={config} />}
        {activeTab === 'airports' && <AirportFeesTab config={config} />}
        {activeTab === 'surge' && <SurgeMultipliersTab config={config} />}
        {activeTab === 'premium' && <PremiumServicesTab config={config} />}
        {activeTab === 'zones' && <ZoneFeesTab config={config} />}
        {activeTab === 'services' && <ServicePoliciesTab config={config} />}
        {activeTab === 'policies' && <GeneralPoliciesTab config={config} />}
        {activeTab === 'return' && <div className={styles.section}><p>Return Settings - Coming soon</p></div>}
        {activeTab === 'hourly' && <div className={styles.section}><p>Hourly Hire - Coming soon</p></div>}
        {activeTab === 'fleet' && <div className={styles.section}><p>Fleet Settings - Coming soon</p></div>}
      </div>
    </div>
  );
}
