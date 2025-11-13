/**
 * Driver Documents Upload Component
 * 
 * 3 Tabs:
 * 1. Personal Documents
 * 2. Profile Photo
 * 3. My Vehicles
 * 
 * 100% UI-core components, zero logic in component
 */

'use client';

import React, { useState } from 'react';
import { Tabs, Card } from '@vantage-lane/ui-core';
import type { IconName } from '@vantage-lane/ui-core';
import { PersonalDocumentsTab } from './PersonalDocumentsTab';
import { ProfilePhotoTab } from './ProfilePhotoTab';
import { MyVehiclesTab } from './MyVehiclesTab';
import styles from './DriverDocumentsUpload.module.css';

export function DriverDocumentsUpload() {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Documents',
      icon: 'fileText' as IconName,
      content: <PersonalDocumentsTab />,
    },
    {
      id: 'photo',
      label: 'Profile Photo',
      icon: 'user' as IconName,
      content: <ProfilePhotoTab />,
    },
    {
      id: 'vehicles',
      label: 'My Vehicles',
      icon: 'car' as IconName,
      content: <MyVehiclesTab />,
    },
  ];

  const cardClassName = styles.card || '';

  return (
    <div className={styles.container}>
      <Card className={cardClassName}>
        <div className={styles.header}>
          <h1 className={styles.title}>Documents</h1>
          <p className={styles.subtitle}>
            Upload and manage your personal documents and vehicle information
          </p>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
        />
      </Card>
    </div>
  );
}
