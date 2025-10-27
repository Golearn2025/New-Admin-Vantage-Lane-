/**
 * API Route: Create Booking
 * POST /api/bookings/create
 */

import { NextResponse } from 'next/server';
import { createBooking } from '@entities/booking/api/createBooking';
import type {
  CreateBookingPayload,
  BookingSegment,
  BookingService,
} from '@features/booking-create/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { payload, segments, services, basePrice } = body as {
      payload: CreateBookingPayload;
      segments: BookingSegment[];
      services: BookingService[];
      basePrice: number;
    };

    const result = await createBooking(payload, segments, services, basePrice);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('API create booking error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
