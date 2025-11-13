/**
 * useBookingLegs Hook
 * 
 * Fetches booking legs for multi-leg bookings (RETURN & FLEET) via API route.
 * 
 * Architecture: features/bookings-table/hooks/useBookingLegs.ts
 * Compliant: <200 lines, TypeScript strict, client-side only
 */

'use client';

import { useState, useEffect } from 'react';
import type { BookingLegWithDetails } from '@entities/booking-leg';

interface UseBookingLegsResult {
  legs: BookingLegWithDetails[];
  loading: boolean;
  error: Error | null;
}

export function useBookingLegs(bookingId: string | null): UseBookingLegsResult {
  const [legs, setLegs] = useState<BookingLegWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setLegs([]);
      return;
    }

    const fetchLegs = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/bookings/${bookingId}/legs`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch legs');
        }
        
        const data = await response.json();
        setLegs(data.legs || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch legs'));
        setLegs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLegs();
  }, [bookingId]);

  return { legs, loading, error };
}
