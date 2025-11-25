/**
 * Single Booking API - Get one booking with all JOINs
 * Used by realtime to fetch new booking complete data
 */

import { logger } from '@/lib/utils/logger';
import { fetchBookingsData } from '@entities/booking/api';
import { transformBookingsData } from '../list/transform';
import { withAdminOrOperatorClient, type SecureClientResult } from '@/lib/auth/secure-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    return await withAdminOrOperatorClient(request, async ({ supabase }: SecureClientResult) => {
      // Fetch single booking with all JOINs using authenticated client
      // RLS policies will ensure user can only see appropriate bookings
      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error || !booking) {
        logger.error('Booking not found', { bookingId, error });
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // Use same fetchBookingsData logic for consistency
      const queryResult = await fetchBookingsData(supabase, {
        page: 1,
        pageSize: 1,
        status: null,
      });

      // Filter to get only this booking
      const singleBooking = queryResult.bookings.find((b) => b.id === bookingId);

      if (!singleBooking) {
        return NextResponse.json({ error: 'Booking not found after fetch' }, { status: 404 });
      }

      // Transform using same logic as list
      const items = transformBookingsData({
        ...queryResult,
        bookings: [singleBooking],
      });

      return NextResponse.json(items[0] || null);
    });
  } catch (error) {
    logger.error('Error fetching single booking', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
