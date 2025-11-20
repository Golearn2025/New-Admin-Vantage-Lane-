/**
 * useOperatorProfileData Hook
 *
 * Citește și actualizează datele profilului operator din organizations table.
 * Operatorii sunt în organizations cu org_type = 'operator'
 * Limită: ≤80 linii (hook rule)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface OperatorProfile {
  id: string;
  auth_user_id: string | null;
  name: string;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  preferred_language: string;
  timezone: string;
  is_active: boolean;
  org_type: 'operator';
  notification_settings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string | null;
}

export function useOperatorProfileData(userId: string | undefined) {
  const [profile, setProfile] = useState<OperatorProfile | null>(null);
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
        console.log('🔍 OPERATOR PROFILE DEBUG: Fetching profile for userId:', userId);
        
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('user_organization_roles')
          .select(`
            *,
            organizations!inner(*)
          `)
          .eq('user_id', userId)
          .eq('is_active', true)
          .eq('organizations.org_type', 'operator')
          .single();

        console.log('🔍 OPERATOR PROFILE DEBUG: Query result:', { data, fetchError });

        if (fetchError) {
          console.error('❌ OPERATOR PROFILE DEBUG: Fetch error:', fetchError);
          
          // If no operator found, try to find by different criteria for debugging
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('No rows returned')) {
            console.log('🔍 OPERATOR DEBUG: No operator found with auth_user_id, searching all operators...');
            
            const { data: allOperators } = await supabase
              .from('organizations')
              .select('*')
              .eq('org_type', 'operator');
              
            console.log('🔍 OPERATOR DEBUG: All operators in database:', allOperators);
            
            // Also search by contact_email if we know the email
            const { data: operatorByEmail } = await supabase
              .from('organizations')
              .select('*')
              .eq('org_type', 'operator')
              .eq('contact_email', 'den@vantage-lane.com');
              
            console.log('🔍 OPERATOR DEBUG: Operator by email (den@vantage-lane.com):', operatorByEmail);
          }
          
          throw fetchError;
        }
        
        // Extract organization data from the joined result
        const orgData = data.organizations;
        
        setProfile({
          id: orgData.id,
          auth_user_id: userId,
          name: orgData.name,
          contact_email: orgData.contact_email,
          contact_phone: orgData.contact_phone,
          address: null, // Not in current schema
          website: null, // Not in current schema  
          description: orgData.description,
          logo_url: null, // Not in current schema
          preferred_language: 'en',
          timezone: 'UTC',
          is_active: orgData.is_active,
          org_type: orgData.org_type,
          notification_settings: {
            email: true,
            sms: false,  
            push: true,
          },
          created_at: orgData.created_at,
          updated_at: orgData.updated_at,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load operator profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<OperatorProfile, 'name' | 'contact_email' | 'contact_phone' | 'address' | 'website' | 'description' | 'logo_url' | 'preferred_language' | 'timezone' | 'notification_settings'>>) => {
      if (!profile) return false;
      
      if (saving) return false;
      
      setSaving(true);
      setError(null);

      try {
        console.log('🔄 OPERATOR UPDATE: Saving to organizations table', { 
          updates, 
          profileId: profile.id,
          profileName: profile.name 
        });
        
        const supabase = createClient();
        
        // Test query pentru debugging
        const { data: beforeData } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.id)
          .single();
        
        console.log('🔍 OPERATOR UPDATE: Before update data', beforeData);
        
        const { data: updateResult, error: updateError } = await supabase
          .from('organizations')
          .update(updates)
          .eq('id', profile.id)
          .select();
          
        console.log('🔍 OPERATOR UPDATE: Update result', { updateResult, updateError });
          
        if (updateError) {
          console.error('❌ OPERATOR UPDATE: Error saving', updateError);
          throw updateError;
        }
        
        console.log('✅ OPERATOR UPDATE: Successfully saved', updateResult);
        
        setProfile({ ...profile, ...updates });
        return true;
      } catch (err) {
        console.error('❌ OPERATOR UPDATE: Failed', err);
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
