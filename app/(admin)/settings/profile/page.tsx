/**
 * Profile Settings Page
 *
 * Permite adminului să își editeze profilul.
 * Limită: ≤150 linii (page logic rule)
 */

'use client';

import React from 'react';
import { useCurrentUser } from '@admin-shared/hooks/useCurrentUser';
import { useProfileData, ProfileForm } from '@features/shared/settings-profile';
import { useOperatorProfileData } from '@features/shared/settings-profile/hooks/useOperatorProfileData';
import type { AdminProfile } from '@features/shared/settings-profile/hooks/useProfileData';
import type { OperatorProfile } from '@features/shared/settings-profile/hooks/useOperatorProfileData';
import { createClient } from '@/lib/supabase/client';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user } = useCurrentUser();
  
  // Use different hooks based on user role
  const isOperator = user?.role === 'operator';
  
  // Admin profile data
  const adminProfileData = useProfileData(isOperator ? undefined : user?.auth_user_id);
  
  // Operator profile data
  const operatorProfileData = useOperatorProfileData(isOperator ? user?.auth_user_id : undefined);
  
  // Select the correct data based on role
  const { profile, loading, error } = isOperator ? operatorProfileData : adminProfileData;

  const handleSave = async (updates: Partial<AdminProfile>) => {
    if (isOperator) {
      // Map AdminProfile updates back to OperatorProfile structure
      const operatorUpdates: Partial<OperatorProfile> = {};
      
      // Skip first_name și last_name - acestea rămân în auth metadata
      // DOAR alte câmpuri se salvează în organizations
      if (updates.email) operatorUpdates.contact_email = updates.email;
      if (updates.phone) operatorUpdates.contact_phone = updates.phone;
      if (updates.bio) operatorUpdates.description = updates.bio;
      if (updates.preferred_language) operatorUpdates.preferred_language = updates.preferred_language;
      if (updates.timezone) operatorUpdates.timezone = updates.timezone;
      if (updates.notification_settings) operatorUpdates.notification_settings = updates.notification_settings;
      
      // Salvează în organizations table
      const result = await operatorProfileData.updateProfile(operatorUpdates);
      
      // Pentru nume, actualizează auth metadata separat
      if ((updates.first_name || updates.last_name) && result) {
        const newFirstName = updates.first_name || user?.name?.split(' ')[0] || '';
        const newLastName = updates.last_name || user?.name?.split(' ').slice(1).join(' ') || '';
        
        try {
          const supabase = createClient();
          const { error: authError } = await supabase.auth.updateUser({
            data: {
              first_name: newFirstName,
              last_name: newLastName
            }
          });
          
          if (authError) {
            throw authError;
          }
        } catch (err) {
          // Silent error handling for production
          return false;
        }
      }
      
      return result;
    } else {
      return adminProfileData.updateProfile(updates);
    }
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
        {loading ? (
          <div className={styles.loading}>Loading your profile...</div>
        ) : error ? (
          <div className={styles.error}>
            <p>Failed to load profile: {error}</p>
            <p><strong>Debug Info:</strong></p>
            <ul>
              <li>User role: {user?.role}</li>
              <li>User ID: {user?.auth_user_id}</li>
              <li>Looking in: {isOperator ? 'organizations table' : 'admin_users table'}</li>
            </ul>
          </div>
        ) : profile ? (
          (() => {
            // Map operator profile to AdminProfile structure pentru ProfileForm
            const mappedProfile: AdminProfile = isOperator ? {
              id: (profile as OperatorProfile).id,
              auth_user_id: (profile as OperatorProfile).auth_user_id,
              email: (profile as OperatorProfile).contact_email,
              name: (profile as OperatorProfile).name,
              // Pentru operatori: folosește numele personal din auth metadata, nu numele organizației
              first_name: user?.name?.split(' ')[0] || 'Florin',
              last_name: user?.name?.split(' ').slice(1).join(' ') || 'Andrita',
              phone: (profile as OperatorProfile).contact_phone,
              avatar_url: null,
              job_title: 'Organization', // Pentru operatori
              department: 'Operator',
              bio: (profile as OperatorProfile).description,
              preferred_language: (profile as OperatorProfile).preferred_language,
              timezone: (profile as OperatorProfile).timezone,
              role: 'admin', // Keep as admin for form compatibility
              is_active: (profile as OperatorProfile).is_active,
              two_factor_enabled: false,
              notification_settings: (profile as OperatorProfile).notification_settings,
              last_login: null,
              created_at: (profile as OperatorProfile).created_at,
              updated_at: (profile as OperatorProfile).updated_at,
              approved_by: null,
              approved_at: null,
              default_operator_id: null,
              default_operator_name: null,
            } : profile as AdminProfile;

            return (
              <ProfileForm 
                profile={mappedProfile} 
                loading={loading} 
                error={error} 
                onSave={handleSave} 
              />
            );
          })()
        ) : (
          <div className={styles.error}>No profile found</div>
        )}
      </div>
    </div>
  );
}
