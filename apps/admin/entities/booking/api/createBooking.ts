/**
 * Create Booking API
 * Handles booking creation with segments, pricing, and services
 * Uses service role key to bypass RLS (admin operations)
 * Ver 3.4 - Replace console with structured logger
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/utils/logger';
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

// Note: Reference generation is now handled by database trigger
// booking_reference_trigger auto-generates CB-XXXXX on INSERT

/**
 * Create complete booking with all related data
 */
export async function createBooking(
  payload: CreateBookingPayload,
  segments: BookingSegment[],
  services: BookingService[],
  basePrice: number
): Promise<CreateBookingResult> {
  // Validate service role key exists (required for admin operations)
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  // Use service role key to bypass RLS for admin operations
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Calculate services total
    const servicesTotal = services
      .filter(s => s.selected)
      .reduce((sum, s) => sum + (s.price || 0), 0);

    // Prepare segments data
    const segmentsData = segments.map(seg => ({
      seq_no: seg.seq_no,
      role: seg.role,
      place_text: seg.place_text,
      place_label: seg.place_label || null,
      lat: seg.lat || null,
      lng: seg.lng || null,
    }));

    // Prepare pricing data
    const pricingData = {
      price: basePrice,
      extras_total: servicesTotal,
      currency: payload.currency,
      payment_method: payload.payment_method,
      payment_status: payload.payment_status,
    };

    // Prepare services data (only selected ones)
    const selectedServices = services.filter(s => s.selected);
    const servicesData = selectedServices.map(s => ({
      service_code: s.code,
      quantity: 1,
      unit_price: s.price || 0,
    }));

    // Call RPC transaction function (ALL OR NOTHING)
    const { data, error } = await supabase
      .rpc('create_booking_transaction', {
        p_booking: payload,
        p_segments: segmentsData,
        p_pricing: pricingData,
        p_services: servicesData,
      });

    if (error) {
      throw new Error(`Transaction failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Unknown transaction error');
    }

    return {
      success: true,
      bookingId: data.booking_id,
      reference: data.reference,
    };
  } catch (error) {
    logger.error('Create booking error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
