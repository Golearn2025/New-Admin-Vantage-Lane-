/**
 * Create Booking API
 * Handles booking creation with segments, pricing, and services
 */

import { createClient } from '@/lib/supabase/server';
import type {
  CreateBookingPayload,
  BookingSegment,
  BookingService,
} from '@features/booking-create/types';

interface CreateBookingResult {
  success: boolean;
  bookingId?: string;
  reference?: string;
  error?: string;
}

/**
 * Generate booking reference (CB-XXXXX format)
 */
async function generateReference(): Promise<string> {
  const supabase = await createClient();
  
  // Get latest booking reference
  const { data } = await supabase
    .from('bookings')
    .select('reference')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (data?.reference) {
    const match = data.reference.match(/CB-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1]) + 1;
      return `CB-${String(nextNum).padStart(5, '0')}`;
    }
  }

  return 'CB-00001';
}

/**
 * Create complete booking with all related data
 */
export async function createBooking(
  payload: CreateBookingPayload,
  segments: BookingSegment[],
  services: BookingService[],
  basePrice: number
): Promise<CreateBookingResult> {
  const supabase = await createClient();

  try {
    // 1. Generate reference
    const reference = await generateReference();

    // 2. Create main booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        reference,
        ...payload,
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Booking creation failed: ${bookingError.message}`);
    }

    // 3. Create segments (pickup + dropoff)
    if (segments.length > 0) {
      const segmentsToInsert = segments.map(seg => ({
        booking_id: booking.id,
        ...seg,
      }));

      const { error: segmentsError } = await supabase
        .from('booking_segments')
        .insert(segmentsToInsert);

      if (segmentsError) {
        console.error('Segments creation failed:', segmentsError);
      }
    }

    // 4. Calculate services total
    const servicesTotal = services
      .filter(s => s.selected)
      .reduce((sum, s) => sum + (s.price || 0), 0);

    // 5. Create pricing
    const { error: pricingError } = await supabase
      .from('booking_pricing')
      .insert({
        booking_id: booking.id,
        price: basePrice,
        extras_total: servicesTotal,
        currency: payload.currency,
        payment_method: payload.payment_method,
        payment_status: payload.payment_status,
      });

    if (pricingError) {
      console.error('Pricing creation failed:', pricingError);
    }

    // 6. Create services (only selected ones)
    const selectedServices = services.filter(s => s.selected);
    if (selectedServices.length > 0) {
      const servicesToInsert = selectedServices.map(s => ({
        booking_id: booking.id,
        service_code: s.code,
        quantity: 1,
        unit_price: s.price || 0,
      }));

      const { error: servicesError } = await supabase
        .from('booking_services')
        .insert(servicesToInsert);

      if (servicesError) {
        console.error('Services creation failed:', servicesError);
      }
    }

    return {
      success: true,
      bookingId: booking.id,
      reference: booking.reference,
    };
  } catch (error) {
    console.error('Create booking error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
