/**
 * SecurityTab - TAB 3: Security Settings
 *
 * Tab pentru security settings (password, 2FA, sessions).
 * Limită: ≤150 linii
 */

'use client';

import React from 'react';
import { ProfileSection } from '@vantage-lane/ui-core';
import { SaveButton } from '@vantage-lane/ui-core';
import type { AdminProfile } from '../hooks/useProfileData';
import styles from './SecurityTab.module.css';

interface SecurityTabProps {
  profile: AdminProfile;
}

export function SecurityTab({ profile }: SecurityTabProps) {
  const handleChangePassword = () => {
    // TODO: Implement password change
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA enable
  };

  return (
    <>
      <ProfileSection
        title="Password"
        icon="🔐"
        description="Manage your account password"
        variant="highlight"
      >
        <div className={styles.securityItem}>
          <div className={styles.securityContent}>
            <h4 className={styles.securityTitle}>Change Password</h4>
            <p className={styles.securityDesc}>
              Update your password to keep your account secure. We recommend using a strong password
              with at least 12 characters.
            </p>
          </div>
          <SaveButton onClick={handleChangePassword} variant="secondary">
            Change Password
          </SaveButton>
        </div>
      </ProfileSection>

      <ProfileSection
        title="Two-Factor Authentication"
        icon="🛡️"
        description="Add an extra layer of security"
      >
        <div className={styles.securityItem}>
          <div className={styles.securityContent}>
            <h4 className={styles.securityTitle}>2FA Status</h4>
            <p className={styles.securityDesc}>
              {profile.two_factor_enabled ? (
                <>
                  <span className={styles.enabled}>✅ Enabled</span>
                  <br />
                  Two-factor authentication is active on your account.
                </>
              ) : (
                <>
                  <span className={styles.disabled}>❌ Disabled</span>
                  <br />
                  Enable 2FA to protect your account with an additional verification step.
                </>
              )}
            </p>
          </div>
          {!profile.two_factor_enabled && (
            <SaveButton onClick={handleEnable2FA} variant="primary">
              Enable 2FA
            </SaveButton>
          )}
        </div>
      </ProfileSection>

      <ProfileSection
        title="Active Sessions"
        icon="💻"
        description="Manage your active login sessions"
      >
        <div className={styles.sessionCard}>
          <div className={styles.sessionIcon}>🖥️</div>
          <div className={styles.sessionContent}>
            <h4 className={styles.sessionTitle}>Current Session</h4>
            <p className={styles.sessionInfo}>
              <strong>Device:</strong> MacOS • Chrome
              <br />
              <strong>Location:</strong> London, UK
              <br />
              <strong>Status:</strong> <span className={styles.activeNow}>Active now</span>
            </p>
          </div>
          <div className={styles.currentBadge}>Current</div>
        </div>
      </ProfileSection>

      <ProfileSection title="Danger Zone" icon="⚠️" description="Irreversible actions">
        <div className={styles.dangerZone}>
          <div className={styles.securityContent}>
            <h4 className={styles.dangerTitle}>Delete Account</h4>
            <p className={styles.securityDesc}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <SaveButton
            onClick={() => {
              /* TODO: Implement delete account */
            }}
            variant="secondary"
          >
            Delete Account
          </SaveButton>
        </div>
      </ProfileSection>
    </>
  );
}
