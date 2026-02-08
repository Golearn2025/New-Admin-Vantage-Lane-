/**
 * Prices Management Page Component
 * 
 * Main page for managing pricing configuration with tabs
 * Architecture: Feature component (UI only, no business logic)
 */

'use client';

import { Button } from '@vantage-lane/ui-core';
import { Calendar, Car, Clock, FileText, Map, Plane, RefreshCw, RotateCcw, Settings, Star, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { usePricesManagement } from '../hooks/usePricesManagement';
import { AirportFeesTab } from './AirportFeesTab';
import { DailyHireTab } from './DailyHireTab';
import { FleetSettingsTab } from './FleetSettingsTab';
import { GeneralPoliciesTab } from './GeneralPoliciesTab';
import { HourlyHireTab } from './HourlyHireTab';
import { PremiumServicesTab } from './PremiumServicesTab';
import styles from './PricesManagementPage.module.css';
import { ReturnSettingsTab } from './ReturnSettingsTab';
import { ServicePoliciesTab } from './ServicePoliciesTab';
import { SurgeMultipliersTab } from './SurgeMultipliersTab';
import { TimePeriodConfigTab } from './TimePeriodConfigTab';
import { VehicleTypesTab } from './VehicleTypesTab';
import { ZoneFeesTab } from './ZoneFeesTab';

type TabType = 'vehicles' | 'airports' | 'surge' | 'premium' | 'zones' | 'services' | 'policies' | 'return' | 'hourly' | 'daily' | 'fleet' | 'timePeriods';

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
          className={`${styles.tab} ${activeTab === 'daily' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          <Calendar className="h-4 w-4" />
          <span>Daily Hire</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fleet' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Users className="h-4 w-4" />
          <span>Fleet Settings</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'timePeriods' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('timePeriods')}
        >
          <Clock className="h-4 w-4" />
          <span>Time Periods</span>
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
        {activeTab === 'return' && <ReturnSettingsTab config={config} />}
        {activeTab === 'hourly' && <HourlyHireTab config={config} />}
        {activeTab === 'daily' && <DailyHireTab config={config} />}
        {activeTab === 'fleet' && <FleetSettingsTab config={config} />}
        {activeTab === 'timePeriods' && <TimePeriodConfigTab config={config} />}
      </div>
    </div>
  );
}
