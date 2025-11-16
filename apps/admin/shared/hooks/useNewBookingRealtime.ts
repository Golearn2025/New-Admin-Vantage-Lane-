/**
 * New Booking Realtime Hook
 *
 * Listen pentru bookings noi în Supabase și trigger sound alert
 * 100% Reutilizabil - TypeScript Strict, cleanup useEffect
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useRef } from 'react';

export function useNewBookingRealtime() {
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  useEffect(() => {
    const setupBookingRealtime = async () => {
      console.log('🚀 useNewBookingRealtime: Starting setup...');

      const supabase = createClient();

      if (!supabase) {
        console.error('❌ Supabase client failed to initialize!');
        return;
      }

      console.log('✅ Supabase client initialized:', !!supabase);

      // Create unique channel name
      const channelName = `bookings-new:${Date.now()}`;

      console.log('🔄 Setting up New Booking Realtime subscription...');

      // Subscribe to INSERT events on bookings table
      channelRef.current = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
            presence: { key: 'admin-dashboard' },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            console.log('🆕 NEW BOOKING (Realtime):', payload.new);
            console.log('📡 Fetching only this booking (not entire list)...');
            
            // Note: Sound is handled by NotificationsProvider to avoid duplicates
            // This hook only handles real-time booking updates
          }
        )
        .subscribe((status, err) => {
          console.log('🔔 New Booking Realtime status:', status);
          if (err) {
            console.error('❌ Booking Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            console.log('✅ New Booking Realtime connected successfully!');
          }
        });
    };

    setupBookingRealtime();

    // Cleanup subscription
    return () => {
      if (channelRef.current) {
        console.log('🔌 Cleaning up New Booking Realtime subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, []);
}
