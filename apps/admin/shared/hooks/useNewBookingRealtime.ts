/**
 * 🚨 DEPRECATED - New Booking Realtime Hook
 *
 * ❌ THIS HOOK IS DEPRECATED! DO NOT USE!
 * ✅ MOVED TO: useBookingsList.ts (single source of truth)
 * 
 * REASON: Multiple realtime subscriptions for same table caused:
 * - Duplicate sounds (2+ audio plays per booking)
 * - Performance issues (multiple websockets)
 * - Race conditions and event duplication
 * 
 * STEP 2 - REALTIME STANDARDIZATION: Unified all bookings realtime
 */

'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useRef } from 'react';

export function useNewBookingRealtime() {
  console.warn('🚨 useNewBookingRealtime is DEPRECATED! Use useBookingsList realtime instead.');
  
  // NO-OP: This hook is disabled to prevent duplicate subscriptions
  // All bookings realtime logic moved to useBookingsList.ts
  
  return;
}
