/**
 * User Profile Component
 * Main profile container with header and documents tab
 * 
 * MODERN & PREMIUM - 100% Design Tokens
 * File: < 200 lines (RULES.md compliant)
 */

'use client';

import React from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileDocumentsTab } from './ProfileDocumentsTab';
import { useUserProfile } from '../hooks/useUserProfile';
import type { UserType } from '../types';
import styles from './UserProfile.module.css';

export interface UserProfileProps {
  userId: string;
  userType: UserType;
  className?: string;
}

export function UserProfile({ userId, userType, className }: UserProfileProps) {
  const { profile, loading, error, refetch } = useUserProfile(userId, userType);
  
  if (loading) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            Error: {error || 'Profile not found'}
          </p>
          <button className={styles.retryButton} onClick={refetch}>
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <ProfileHeader
        profile={profile}
        onEdit={() => console.log('Edit profile')}
        onToggleActive={() => console.log('Toggle active')}
        onDelete={() => console.log('Delete profile')}
      />
      
      {/* Documents Tab - Only for drivers */}
      {profile.type === 'driver' && profile.documents && (
        <div className={styles.tabContent}>
          <h2 className={styles.tabTitle}>Documents</h2>
          <ProfileDocumentsTab
            documents={profile.documents}
            onViewDocument={(doc) => console.log('View doc:', doc)}
            onApprove={(doc) => console.log('Approve:', doc)}
            onReject={(doc) => console.log('Reject:', doc)}
          />
        </div>
      )}
      
      {/* Placeholder for other tabs */}
      {profile.type !== 'driver' && (
        <div className={styles.placeholder}>
          <p className={styles.placeholderText}>
            Profile tabs for {profile.type}s coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
