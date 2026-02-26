/**
 * API Route: Create Booking
 * POST /api/bookings/create
 * Ver 3.4 - Add Zod validation
 */

import { NextResponse } from 'next/server';
import { createBooking } from '@entities/booking/api/createBooking';
import { validateRequest } from '@/lib/api/validateRequest';
import { CreateBookingSchema } from '@features/admin/booking-create/schema';
import { logger } from '@/lib/utils/logger';
export const runtime = 'nodejs';


export async function POST(request: Request) {
  try {
    // Validate request body with Zod
    const validated = await validateRequest(request, CreateBookingSchema);
    
    if (!validated.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation failed', 
          details: validated.error 
        },
        { status: 400 }
      );
    }
    
    const { payload, segments, services, basePrice } = validated.data;

    const result = await createBooking(payload, segments, services, basePrice);

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }
    
    return NextResponse.json(result, { status: 400 });
  } catch (error) {
    logger.error('API create booking error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
