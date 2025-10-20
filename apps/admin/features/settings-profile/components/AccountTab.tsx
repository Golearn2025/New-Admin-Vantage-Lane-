/**
 * AccountTab - TAB 2: Account Information
 * 
 * Tab pentru informații cont (role, member since, last login, statistics).
 * Limită: ≤150 linii
 */

'use client';

import React from 'react';
import { ProfileSection } from '@admin-shared/ui/core/ProfileSection';
import type { AdminProfile } from '../hooks/useProfileData';
import styles from './AccountTab.module.css';

interface AccountTabProps {
  profile: AdminProfile;
}

export function AccountTab({ profile }: AccountTabProps) {
  const getRoleBadge = () => {
    switch (profile.role) {
      case 'admin':
        return <span className={styles.badgeAdmin}>⭐ Administrator</span>;
      case 'support':
        return <span className={styles.badgeSupport}>🎧 Support</span>;
      default:
        return <span>{profile.role}</span>;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <ProfileSection
        title="Account Details"
        icon="👥"
        description="Your account role and status"
        variant="highlight"
      >
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎭</div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Role</span>
              {getRoleBadge()}
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>✅</div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.statusActive}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📅</div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>{formatDate(profile.created_at)}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🕐</div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Last Login</span>
              <span className={styles.infoValue}>{formatDateTime(profile.last_login)}</span>
            </div>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection
        title="Organization"
        icon="🏢"
        description="Your assigned organization"
      >
        <div className={styles.orgCard}>
          <div className={styles.orgIcon}>🏬</div>
          <div className={styles.orgContent}>
            <span className={styles.orgLabel}>Default Operator</span>
            <span className={styles.orgValue}>
              {profile.default_operator_name || 'Not assigned'}
            </span>
            <span className={styles.orgHint}>Contact administrator to change</span>
          </div>
        </div>
      </ProfileSection>
    </>
  );
}
