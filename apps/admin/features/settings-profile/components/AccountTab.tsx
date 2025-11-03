'use client';

/**
 * AccountTab - TAB 2: Account Information
 *
 * Tab pentru informații cont (role, member since, last login, statistics).
 * Limită: ≤150 linii
 */

import React from 'react';
import { CheckCircle, Clock, Shield, Building2 } from 'lucide-react';
import { ProfileSection } from '@vantage-lane/ui-core';
import type { AdminProfile } from '../hooks/useProfileData';
import { formatDate, formatDateTime, getRoleLabel } from '../utils/formatters';
import styles from './AccountTab.module.css';

interface AccountTabProps {
  profile: AdminProfile;
}

export function AccountTab({ profile }: AccountTabProps) {
  const roleBadgeClass = profile.role === 'admin' ? styles.badgeAdmin : styles.badgeSupport;
  const roleLabel = getRoleLabel(profile.role);

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
            <div className={styles.infoIcon}>
              <Shield size={18} strokeWidth={2} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Role</span>
              <span className={roleBadgeClass}>{roleLabel}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}><CheckCircle size={18} strokeWidth={2} /></div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.statusActive}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Clock size={18} strokeWidth={2} />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Member Since</span>
              <span className={styles.infoValue}>{formatDate(profile.created_at)}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}><Clock size={18} strokeWidth={2} /></div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>Last Login</span>
              <span className={styles.infoValue}>{formatDateTime(profile.last_login)}</span>
            </div>
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="Organization" icon="🏢" description="Your assigned organization">
        <div className={styles.orgCard}>
          <div className={styles.orgIcon}>
            <Building2 size={24} strokeWidth={2} />
          </div>
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
