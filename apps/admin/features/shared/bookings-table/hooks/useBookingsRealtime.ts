/**
 * useBookingsRealtime Hook
 * 
 * Realtime subscription and booking injection - focused on realtime updates
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import { logger } from '@/lib/utils/logger';
import { createClient } from '@/lib/supabase/client';
import { playBookingNotificationSound } from '@admin-shared/utils/notificationSound';
import { transformRawBookingToListItem } from '../utils/bookingTransforms';

interface UseBookingsRealtimeParams {
  currentPage: number;
  pageSize: number;
  shouldInjectBooking: (booking: any, currentPage: number) => boolean;
  onNewBooking: (booking: BookingListItem) => void;
  onUpdateTotalCount: (increment: number) => void;
}

export function useBookingsRealtime({
  currentPage,
  pageSize,
  shouldInjectBooking,
  onNewBooking,
  onUpdateTotalCount,
}: UseBookingsRealtimeParams) {
  
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  const handleRealtimeInsert = useCallback((payload: any) => {
    logger.info('🆕 NEW BOOKING (Realtime):', payload.new);
    logger.info('📡 INJECT without refetch (STEP 2 - Realtime Standardization)');

    const newBookingRaw = payload.new as any;
    
    // Check if we should inject based on current page and filters
    const shouldInject = shouldInjectBooking(newBookingRaw, currentPage);

    if (shouldInject) {
      // Transform raw DB row to BookingListItem format
      const newBookingItem = transformRawBookingToListItem(newBookingRaw);
      
      // Inject booking and update count
      onNewBooking(newBookingItem);
      onUpdateTotalCount(1);
      
      logger.info('✅ NEW BOOKING injected into list without refetch', {
        id: newBookingItem.id,
        reference: newBookingItem.reference,
      });
      
      // 🔊 SINGLE SOUND SOURCE - Play notification sound
      playBookingNotificationSound();
    } else {
      logger.info('📊 New booking not injected (wrong page/filter)', {
        current_page: currentPage,
        booking_status: newBookingRaw.status
      });
    }
  }, [currentPage, shouldInjectBooking, onNewBooking, onUpdateTotalCount]);

  useEffect(() => {
    const supabase = createClient();

    const setupRealtime = () => {
      logger.info('🔄 Setting up Bookings Realtime subscription');

      channelRef.current = supabase
        .channel('bookings-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
          },
          handleRealtimeInsert
        )
        .subscribe((status, err) => {
          if (err) {
            logger.error('❌ Bookings Realtime error:', err);
          }
          if (status === 'SUBSCRIBED') {
            logger.info('✅ Bookings Realtime connected!');
          }
        });
    };

    setupRealtime();

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        logger.info('🔌 Cleaning up Bookings Realtime subscription');
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [handleRealtimeInsert]);

  return {
    // No return values needed - this hook manages side effects only
  };
}
