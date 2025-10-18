/**
 * ProfileForm - FORM PRINCIPAL PROFIL
 * 
 * Form complet cu 3 tabs: Personal Info, Account, Security.
 * Include logica de auto-save în baza de date.
 * Limită: ≤200 linii
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Tabs, type Tab } from '@admin/shared/ui/core/Tabs';
import { SaveButton } from '@admin/shared/ui/core/SaveButton';
import { PersonalInfoTab } from './PersonalInfoTab';
import { AccountTab } from './AccountTab';
import { SecurityTab } from './SecurityTab';
import type { AdminProfile } from '../hooks/useProfileData';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  profile: AdminProfile;
  loading?: boolean;
  error: string | null;
  onSave: (updates: Partial<AdminProfile>) => Promise<boolean>;
}

export function ProfileForm({ profile, loading = false, error, onSave }: ProfileFormProps) {
  const [pendingChanges, setPendingChanges] = useState<Partial<AdminProfile> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleChange = useCallback((updates: Partial<AdminProfile>) => {
    setPendingChanges(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = async () => {
    if (!pendingChanges || saving) return;

    setSaving(true);
    setSaveSuccess(false);

    const success = await onSave(pendingChanges);

    if (success) {
      setSaveSuccess(true);
      setPendingChanges(null);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading profile...</p>
      </div>
    );
  }

  const tabs: Tab[] = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: '👤',
      content: <PersonalInfoTab profile={profile} onChange={handleChange} />,
    },
    {
      id: 'account',
      label: 'Account',
      icon: '📊',
      content: <AccountTab profile={profile} />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: '🔒',
      content: <SecurityTab profile={profile} />,
    },
  ];

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorBanner} role="alert">
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className={styles.successBanner} role="status">
          <span className={styles.successIcon}>✅</span>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <Tabs 
        tabs={tabs} 
        defaultTab="personal" 
        variant="premium"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* ✅ Save button DOAR pe Personal Info tab */}
      {activeTab === 'personal' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <SaveButton onClick={handleSave} variant="primary" loading={saving}>
            Save Changes
          </SaveButton>
        </div>
      )}
    </div>
  );
}
