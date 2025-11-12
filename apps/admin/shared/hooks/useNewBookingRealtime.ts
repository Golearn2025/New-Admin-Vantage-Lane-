/**
 * New Booking Realtime Hook
 * 
 * Listen pentru bookings noi în Supabase și trigger sound alert
 * 100% Reutilizabil - TypeScript Strict, cleanup useEffect
 */

'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationSound } from './useNotificationSound';

export function useNewBookingRealtime() {
  const { playNewBookingSound, settings } = useNotificationSound();
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  useEffect(() => {
    const setupBookingRealtime = async () => {
      console.log('🚀 useNewBookingRealtime: Starting setup...');
      console.log('🔊 Sound settings:', settings);
      
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
            console.log('🆕 NEW BOOKING DETECTED (Realtime):', payload.new);
            console.log('🔊 About to play sound. Settings enabled:', settings.enabled, 'muted:', settings.muteAll);
            
            // Play sound alert IMMEDIATELY
            try {
              playNewBookingSound();
              console.log('✅ Sound function called successfully');
            } catch (error) {
              console.error('❌ Sound play error:', error);
            }
            
            // Optional: Show browser notification if permission granted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Booking Alert!', {
                body: `Booking ${payload.new.reference} received`,
                icon: '/favicon.ico',
              });
            }
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
  }, [playNewBookingSound]);
}
