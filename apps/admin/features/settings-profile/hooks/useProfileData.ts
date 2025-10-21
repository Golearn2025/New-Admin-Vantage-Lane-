/**
 * useProfileData Hook
 *
 * Citește și actualizează datele profilului admin.
 * Limită: ≤80 linii (hook rule)
 */

'use client';

import { useState, useEffect } from 'react';
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

        if (fetchError) throw fetchError;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const orgName = (data.organizations as any)?.name || null;
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

  const updateProfile = async (
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
  };

  return { profile, loading, saving, error, updateProfile };
}
