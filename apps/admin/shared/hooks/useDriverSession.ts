/**
 * useDriverSession Hook
 * 
 * Get current driver ID from session
 * Zero UI logic
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DriverSession {
  driverId: string | null;
  organizationId: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useDriverSession(): DriverSession {
  const [state, setState] = useState<DriverSession>({
    driverId: null,
    organizationId: null,
    email: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient();
        
        // Get current user session
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        
        console.log('Driver Session - Auth User:', user?.email, user?.id);
        
        if (sessionError || !user) {
          console.error('No active session:', sessionError);
          throw new Error('No active session');
        }

        // Get driver record by auth user ID
        let driver = null;
        let driverError = null;
        
        // Try auth_user_id first (preferred)
        const authResult = await supabase
          .from('drivers')
          .select('id, email, organization_id, auth_user_id')
          .eq('auth_user_id', user.id)
          .single();
        
        driver = authResult.data;
        driverError = authResult.error;
        
        // Fallback to email if auth_user_id not set (temporary until migration runs)
        if (!driver && user.email) {
          const emailResult = await supabase
            .from('drivers')
            .select('id, email, organization_id, auth_user_id')
            .eq('email', user.email)
            .single();
          
          driver = emailResult.data;
          driverError = emailResult.error;
          
          console.log('Email fallback result:', {
            email: user.email,
            found: !!driver,
            driverId: driver?.id,
          });
        }

        if (driverError || !driver) {
          console.error('Driver not found:', user.email, driverError);
          throw new Error('Driver not found for this user');
        }
        
        console.log('Driver session loaded successfully:', driver.id);

        setState({
          driverId: driver.id,
          organizationId: driver.organization_id || null,
          email: driver.email,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          driverId: null,
          organizationId: null,
          email: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load session',
        });
      }
    }

    loadSession();
  }, []);

  return state;
}
