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

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { BookingCounts } from '@features/bookings-table/types/tabs';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all bookings with trip_type (RLS will filter automatically)
    // Note: booking_type column doesn't exist yet, will be added later
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

    // Calculate counts
    const counts: BookingCounts = {
      all: bookings?.length || 0,
      oneway: bookings?.filter((b: BookingRow) => b.trip_type === 'oneway').length || 0,
      return: bookings?.filter((b: BookingRow) => b.trip_type === 'return').length || 0,
      hourly: bookings?.filter((b: BookingRow) => b.trip_type === 'hourly').length || 0,
      fleet: bookings?.filter((b: BookingRow) => b.trip_type === 'fleet').length || 0,
      // These will be 0 until booking_type field is added to DB
      by_request: 0,
      events: 0,
      corporate: 0,
    };

    return NextResponse.json({
      counts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
