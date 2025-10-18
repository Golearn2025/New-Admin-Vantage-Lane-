/**
 * Profile Settings Page
 * 
 * Permite adminului să își editeze profilul.
 * Limită: ≤150 linii (page logic rule)
 */

'use client';

import React from 'react';
import { useCurrentUser } from '@admin/shared/hooks/useCurrentUser';
// eslint-disable-next-line no-restricted-imports -- Page can import from features
import { ProfileForm } from '../../../../apps/admin/features/settings-profile';
// eslint-disable-next-line no-restricted-imports -- Page can import from features
import { useProfileData, type AdminProfile } from '../../../../apps/admin/features/settings-profile';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const { profile, loading, error, updateProfile } = useProfileData(user?.auth_user_id);

  const handleSave = async (updates: Partial<AdminProfile>) => {
    return updateProfile(updates);
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>Manage your personal information and preferences</p>
        </div>
      </div>

      <div className={styles.content}>
        {profile ? (
          <ProfileForm
            profile={profile}
            loading={loading}
            error={error}
            onSave={handleSave}
          />
        ) : loading ? (
          <div className={styles.loading}>Loading your profile...</div>
        ) : (
          <div className={styles.error}>Failed to load profile</div>
        )}
      </div>
    </div>
  );
}
