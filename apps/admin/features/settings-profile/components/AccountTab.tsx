'use client';

/**
 * AccountTab - TAB 2: Account Information
 *
 * Tab pentru informații cont (role, member since, last login, statistics).
 * Limită: ≤150 linii
 */

import React from 'react';
import { CheckCircle, Clock, Shield, Building2, Volume2, VolumeX } from 'lucide-react';
import { ProfileSection, Checkbox, Input, Button } from '@vantage-lane/ui-core';
import type { AdminProfile } from '../hooks/useProfileData';
import { formatDate, formatDateTime, getRoleLabel } from '../utils/formatters';
import { useNotificationSound } from '../../../shared/hooks/useNotificationSound';
import styles from './AccountTab.module.css';

interface AccountTabProps {
  profile: AdminProfile;
}

export function AccountTab({ profile }: AccountTabProps) {
  const roleBadgeClass = profile.role === 'admin' ? styles.badgeAdmin : styles.badgeSupport;
  const roleLabel = getRoleLabel(profile.role);
  const { playNewBookingSound, settings, updateSettings } = useNotificationSound();

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

      <ProfileSection
        title="Sound Notifications"
        icon="🔊"
        description="Control desktop sound alerts"
        variant="default"
      >
        <div className={styles.soundSettings}>
          <div className={styles.soundControl}>
            <Checkbox
              id="enable-sound"
              label="New Booking Sound Alert"
              checked={settings.enabled}
              onChange={(e) => updateSettings({ enabled: e.target.checked })}
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={settings.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              onClick={playNewBookingSound}
              disabled={!settings.enabled}
            >
              Test Sound
            </Button>
          </div>
          
          {settings.enabled && (
            <div className={styles.volumeControl}>
              <label htmlFor="volume-slider" className={styles.volumeLabel}>
                Volume: {settings.volume}%
              </label>
              <Input
                id="volume-slider"
                type="range"
                min="10"
                max="100"
                step="10"
                value={settings.volume}
                onChange={(e) => updateSettings({ volume: parseInt(e.target.value, 10) })}
              />
            </div>
          )}
          
          <div className={styles.muteAllControl}>
            <Checkbox
              id="mute-all"
              label="Mute All Notifications"
              checked={settings.muteAll}
              onChange={(e) => updateSettings({ muteAll: e.target.checked })}
            />
          </div>
        </div>
      </ProfileSection>
    </>
  );
}
