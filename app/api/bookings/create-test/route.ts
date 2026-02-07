/**
 * API Route: Create Test Booking
 * POST /api/bookings/create-test
 * Creates bookings directly in bookings and booking_legs tables
 */

import { NextResponse } from 'next/server';
import { createTestBooking } from '@entities/booking/api/createTestBooking';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createTestBooking(body);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    console.error('API create test booking error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
