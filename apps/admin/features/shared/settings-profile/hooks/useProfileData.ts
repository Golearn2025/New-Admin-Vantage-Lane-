/**
 * useProfileData Hook
 *
 * Citește și actualizează datele profilului admin.
 * Limită: ≤80 linii (hook rule)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AdminProfile {
  id: string;
  auth_user_id: string | null;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  job_title: string | null;
  department: string | null;
  bio: string | null;
  preferred_language: string;
  timezone: string;
  role: 'super_admin' | 'admin' | 'support';
  is_active: boolean;
  two_factor_enabled: boolean;
  notification_settings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  default_operator_id: string | null;
  default_operator_name: string | null;
}

export function useProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('🔍 PROFILE DEBUG: Fetching profile for userId:', userId);
        
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('admin_users')
          .select(
            `
            id, auth_user_id, email, name,
            first_name, last_name, phone, avatar_url,
            job_title, department, bio,
            preferred_language, timezone,
            role, is_active, two_factor_enabled,
            notification_settings,
            last_login, created_at, updated_at,
            approved_by, approved_at,
            default_operator_id,
            organizations:default_operator_id(name)
          `
          )
          .eq('auth_user_id', userId)
          .single();

        console.log('🔍 PROFILE DEBUG: Query result:', { data, fetchError });

        if (fetchError) {
          console.error('❌ PROFILE DEBUG: Fetch error:', fetchError);
          
          // Special handling for operators who might not have admin_users record
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('No rows returned')) {
            console.log('🔄 PROFILE DEBUG: No admin_users record found, creating operator profile placeholder');
            
            // Create a minimal profile for operator without admin_users record
            const operatorProfile: AdminProfile = {
              id: `temp-${userId}`,
              auth_user_id: userId,
              email: '', // Will be filled from session
              name: '',
              first_name: null,
              last_name: null,
              phone: null,
              avatar_url: null,
              job_title: null,
              department: null,
              bio: null,
              preferred_language: 'en',
              timezone: 'UTC',
              role: 'admin', // Fallback role
              is_active: true,
              two_factor_enabled: false,
              notification_settings: {
                email: true,
                sms: false,
                push: true,
              },
              last_login: null,
              created_at: new Date().toISOString(),
              updated_at: null,
              approved_by: null,
              approved_at: null,
              default_operator_id: null,
              default_operator_name: null,
            };
            
            setProfile(operatorProfile);
            setError('Profile not fully configured. Some features may be limited.');
            setLoading(false);
            return;
          }
          
          throw fetchError;
        }
        
        // Type-safe organization name extraction
        const orgData = data.organizations as { name?: string } | null;
        const orgName = orgData?.name || null;
        
        setProfile({
          ...data,
          default_operator_name: orgName,
          notification_settings: data.notification_settings || {
            email: true,
            sms: false,
            push: true,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = useCallback(
    async (
      updates: Partial<
        Pick<
          AdminProfile,
          | 'name'
          | 'first_name'
          | 'last_name'
          | 'phone'
          | 'avatar_url'
          | 'job_title'
          | 'department'
          | 'bio'
          | 'preferred_language'
          | 'timezone'
          | 'notification_settings'
          | 'default_operator_id'
        >
      >
    ) => {
      if (!profile) return false;
      
      // Spam protection - prevent multiple simultaneous updates
      if (saving) return false;
      
      setSaving(true);
      setError(null);

      try {
        const supabase = createClient();
        const { error: updateError } = await supabase
          .from('admin_users')
          .update(updates)
          .eq('id', profile.id);
        if (updateError) throw updateError;
        setProfile({ ...profile, ...updates });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [profile, saving]
  );

  return { profile, loading, saving, error, updateProfile };
}
