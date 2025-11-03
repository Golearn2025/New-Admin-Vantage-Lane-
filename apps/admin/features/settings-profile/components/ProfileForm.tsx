/**
 * ProfileForm - FORM PRINCIPAL PROFIL
 *
 * Form complet cu 3 tabs: Personal Info, Account, Security.
 * Include logica de auto-save în baza de date.
 * Limită: ≤200 linii
 */

'use client';

import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Tabs, type Tab } from '@vantage-lane/ui-core';
import { SaveButton } from '@vantage-lane/ui-core';
import { PersonalInfoTab } from './PersonalInfoTab';
import { AccountTab } from './AccountTab';
import { SecurityTab } from './SecurityTab';
import type { AdminProfile } from '../hooks/useProfileData';
import { useProfileForm } from '../hooks/useProfileForm';
import styles from './ProfileForm.module.css';

interface ProfileFormProps {
  profile: AdminProfile;
  loading?: boolean;
  error: string | null;
  onSave: (updates: Partial<AdminProfile>) => Promise<boolean>;
}

export function ProfileForm({ profile, loading = false, error, onSave }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState('personal');
  
  const {
    firstName,
    lastName,
    phone,
    bio,
    handleFirstNameChange,
    handleLastNameChange,
    handlePhoneChange,
    handleBioChange,
    handleChangePassword,
    handleEnable2FA,
    handleDeleteAccount,
    handleSave,
    hasPendingChanges,
    saving,
    saveSuccess,
  } = useProfileForm({ profile, onSave });

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
      content: (
        <PersonalInfoTab
          profile={profile}
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          bio={bio}
          onFirstNameChange={handleFirstNameChange}
          onLastNameChange={handleLastNameChange}
          onPhoneChange={handlePhoneChange}
          onBioChange={handleBioChange}
        />
      ),
    },
    {
      id: 'account',
      label: 'Account',
      content: <AccountTab profile={profile} />,
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <SecurityTab
          profile={profile}
          onChangePassword={handleChangePassword}
          onEnable2FA={handleEnable2FA}
          onDeleteAccount={handleDeleteAccount}
        />
      ),
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
          <span className={styles.successIcon}><CheckCircle size={18} strokeWidth={2} /></span>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <Tabs
        tabs={tabs}
        defaultActiveTab="personal"
        variant="underline"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* ✅ Save button DOAR pe Personal Info tab */}
      {activeTab === 'personal' && hasPendingChanges && (
        <div className={styles.saveButtonContainer}>
          <SaveButton 
            onClick={handleSave} 
            variant="primary" 
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </SaveButton>
        </div>
      )}
    </div>
  );
}
