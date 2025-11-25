/**
 * Bookings Counts API Route
 * GET /api/bookings/counts
 * 
 * Returns count for each booking tab type
 * 
 * Compliant:
 * - app/ only routing (no logic)
 * - Imports from entities
 * - TypeScript strict
 */

import { NextRequest, NextResponse } from 'next/server';
import type { CountsByTripType } from '@features/shared/bookings-table/utils/createBookingTabs';
import { ZERO_COUNTS } from '@features/shared/bookings-table/utils/createBookingTabs';
import { withAdminOrOperatorClient, type SecureClientResult } from '@/lib/auth/secure-client';

export async function GET(request: NextRequest) {
  try {
    return await withAdminOrOperatorClient(request, async ({ supabase }: SecureClientResult) => {
      // Get all bookings with trip_type using authenticated client
      // RLS policies will ensure user sees only appropriate bookings
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('trip_type')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[API] Error fetching booking counts:', error);
        return NextResponse.json(
          { error: 'Failed to fetch booking counts' },
          { status: 500 }
        );
      }

      // Define booking type for type safety
      type BookingRow = { trip_type: string | null };

      // Calculate counts based on trip_type, starting from ZERO_COUNTS template
      const counts: CountsByTripType = {
        ...ZERO_COUNTS,
        all: bookings?.length || 0,
        oneway: bookings?.filter((b: BookingRow) => b.trip_type === 'oneway').length || 0,
        return: bookings?.filter((b: BookingRow) => b.trip_type === 'return').length || 0,
        hourly: bookings?.filter((b: BookingRow) => b.trip_type === 'hourly').length || 0,
        daily: bookings?.filter((b: BookingRow) => b.trip_type === 'daily').length || 0,
        fleet: bookings?.filter((b: BookingRow) => b.trip_type === 'fleet').length || 0,
        bespoke: bookings?.filter((b: BookingRow) => b.trip_type === 'bespoke').length || 0,
      };

      return NextResponse.json({
        counts,
        timestamp: new Date().toISOString(),
      });
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
