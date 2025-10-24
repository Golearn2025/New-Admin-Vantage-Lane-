/**
 * Profile Header Component
 * Avatar, name, status, quick actions
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React from 'react';
import { Button } from '@vantage-lane/ui-core';
import type { UserProfileData } from '../types';
import styles from './ProfileHeader.module.css';

export interface ProfileHeaderProps {
  profile: UserProfileData;
  onEdit?: () => void;
  onToggleActive?: () => void;
  onDelete?: () => void;
}

export function ProfileHeader({
  profile,
  onEdit,
  onToggleActive,
  onDelete,
}: ProfileHeaderProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={fullName}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <span className={styles.initials}>{initials}</span>
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className={styles.infoSection}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{fullName}</h1>
            <span className={`${styles.statusBadge} ${profile.isActive ? styles.statusActive : styles.statusInactive}`}>
              {profile.isActive ? '✓ Active' : '⏸ Inactive'}
            </span>
            {profile.type === 'driver' && profile.status && (
              <span className={`${styles.onlineStatus} ${profile.status === 'online' ? styles.online : styles.offline}`}>
                {profile.status === 'online' ? '🟢 Online' : '⚫ Offline'}
              </span>
            )}
          </div>
          
          <div className={styles.details}>
            <span className={styles.detail}>
              📧 {profile.email}
            </span>
            {profile.phone && (
              <span className={styles.detail}>
                📞 {profile.phone}
              </span>
            )}
            <span className={styles.detail}>
              🏷️ {profile.type.charAt(0).toUpperCase() + profile.type.slice(1)}
            </span>
            <span className={styles.detail}>
              📅 Joined {new Date(profile.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          
          {/* Driver stats quick view */}
          {profile.type === 'driver' && (
            <div className={styles.quickStats}>
              {profile.rating !== undefined && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Rating</span>
                  <span className={styles.statValue}>⭐ {profile.rating.toFixed(1)}</span>
                </div>
              )}
              {profile.totalJobs !== undefined && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Jobs</span>
                  <span className={styles.statValue}>{profile.totalJobs}</span>
                </div>
              )}
              {profile.totalEarnings !== undefined && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Earnings</span>
                  <span className={styles.statValue}>£{profile.totalEarnings.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className={styles.actions}>
          {onEdit && (
            <Button variant="secondary" size="md" onClick={onEdit}>
              ✏️ Edit
            </Button>
          )}
          {onToggleActive && (
            <Button
              variant={profile.isActive ? 'danger' : 'primary'}
              size="md"
              onClick={onToggleActive}
            >
              {profile.isActive ? '🔴 Deactivate' : '✅ Activate'}
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="md" onClick={onDelete}>
              🗑️ Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
