/**
 * DriverProfile Component
 * 
 * Main driver profile page with tabs for Profile, Documents, Vehicle, Operators
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, Button, ErrorBanner, Badge } from '@vantage-lane/ui-core';
import { useDriverProfile } from '../hooks/useDriverProfile';
import { useDriverActions } from '../hooks/useDriverActions';
import { createClient } from '@/lib/supabase/client';
import { ProfileTab } from './ProfileTab';
import { DocumentsTab } from './DocumentsTab';
import { VehicleTab } from './VehicleTab';
import { OperatorsTab } from './OperatorsTab';
import styles from '../driver-profile.module.css';

interface DriverProfileProps {
  driverId: string;
}

export function DriverProfile({ driverId }: DriverProfileProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [adminId, setAdminId] = useState<string>('');

  const { driver, isLoading, error, mutate } = useDriverProfile(driverId);
  const {
    activateDriver,
    deactivateDriver,
    approveDriver,
    isLoading: isActionLoading,
    error: actionError,
  } = useDriverActions();

  // Get admin ID from auth
  useEffect(() => {
    async function fetchAdminId() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        setAdminId(user.id);
      }
    }
    fetchAdminId();
  }, []);

  const handleActivate = useCallback(async () => {
    try {
      await activateDriver(driverId);
      mutate();
    } catch (err) {
      // Error handled by hook
    }
  }, [driverId, activateDriver, mutate]);

  const handleDeactivate = useCallback(async () => {
    try {
      await deactivateDriver(driverId);
      mutate();
    } catch (err) {
      // Error handled by hook
    }
  }, [driverId, deactivateDriver, mutate]);

  const handleApprove = useCallback(async () => {
    if (!adminId) {
      alert('Admin user not found. Please refresh the page.');
      return;
    }
    
    try {
      await approveDriver(driverId, adminId);
      mutate();
    } catch (err) {
      // Error handled by hook
    }
  }, [driverId, adminId, approveDriver, mutate]);

  if (isLoading) {
    return <div className={styles.loading}>Loading driver profile...</div>;
  }

  if (error || !driver) {
    return (
      <ErrorBanner
        message={error?.message || 'Failed to load driver profile'}
        actionLabel="Retry"
        onAction={mutate}
      />
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'documents', label: 'Documents' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'operators', label: 'Operators' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {driver.firstName} {driver.lastName}
          </h1>
          <div className={styles.badges}>
            <Badge color={driver.isActive ? 'success' : 'neutral'} size="md">
              {driver.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Badge color={driver.isApproved ? 'success' : 'warning'} size="md">
              {driver.isApproved ? 'Approved' : 'Pending Approval'}
            </Badge>
          </div>
        </div>

        <div className={styles.actions}>
          {!driver.isApproved && (
            <Button
              variant="primary"
              onClick={handleApprove}
              disabled={isActionLoading}
            >
              Approve Driver
            </Button>
          )}

          {driver.isActive ? (
            <Button
              variant="danger"
              onClick={handleDeactivate}
              disabled={isActionLoading}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleActivate}
              disabled={isActionLoading}
            >
              Activate
            </Button>
          )}
        </div>
      </div>

      {actionError && (
        <ErrorBanner message={actionError} />
      )}

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className={styles.content}>
        {activeTab === 'profile' && <ProfileTab driver={driver} onUpdate={mutate} />}
        {activeTab === 'documents' && <DocumentsTab driverId={driverId} />}
        {activeTab === 'vehicle' && <VehicleTab driverId={driverId} />}
        {activeTab === 'operators' && <OperatorsTab driver={driver} />}
      </div>
    </div>
  );
}
