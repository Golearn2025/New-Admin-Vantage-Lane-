/**
 * Create Test Booking API
 * Creates bookings directly in bookings and booking_legs tables
 * For test-creator page - bypasses the old booking system
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

interface CreateTestBookingParams {
  customer_id: string;
  trip_type: 'oneway' | 'return' | 'hourly' | 'daily';
  category: string;
  start_at: string;
  passenger_count: number;
  bag_count: number;
  currency: string;
  notes: string;
  pickup_location: string;
  pickup_lat: number;
  pickup_lng: number;
  destination: string;
  destination_lat: number;
  destination_lng: number;
  leg_price: number;
  driver_payout: number;
  hours?: number;
  days?: number;
  return_date?: string;
  return_time?: string;
}

interface CreateTestBookingResult {
  success: boolean;
  reference?: string;
  bookingId?: string;
  error?: string;
}

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function createTestBooking(
  params: CreateTestBookingParams
): Promise<CreateTestBookingResult> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Generate reference
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const reference = `VL-${dateStr}-${randomNum}`;

    // Calculate distance and duration
    const distanceMiles = Number(calculateDistance(
      params.pickup_lat,
      params.pickup_lng,
      params.destination_lat,
      params.destination_lng
    ).toFixed(2));
    
    // Estimate duration: ~30 mph average in London, minimum 15 minutes
    const durationMin = Math.max(15, Math.round(distanceMiles * 2));

    // 1. Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: params.customer_id,
        trip_type: params.trip_type,
        category: params.category,
        status: 'pending',
        booking_status: 'pending',
        payment_status: 'pending',
        reference: reference,
        start_at: params.start_at,
        passenger_count: params.passenger_count,
        bag_count: params.bag_count,
        currency: params.currency,
        notes: params.notes,
      })
      .select('id, reference')
      .single();

    if (bookingError) {
      throw new Error(`Booking insert failed: ${bookingError.message}`);
    }

    const bookingId = booking.id;

    // 2. Create leg(s)
    if (params.trip_type === 'return') {
      // Create 2 legs for return trip
      const returnDate = params.return_date || new Date(new Date(params.start_at).getTime() + 24 * 60 * 60 * 1000).toISOString();
      
      // Leg 1 - Outbound
      await supabase.from('booking_legs').insert({
        parent_booking_id: bookingId,
        leg_number: 1,
        pickup_location: params.pickup_location,
        destination: params.destination,
        pickup_lat: params.pickup_lat,
        pickup_lng: params.pickup_lng,
        destination_lat: params.destination_lat,
        destination_lng: params.destination_lng,
        vehicle_category: params.category,
        leg_type: 'return',
        status: 'pending',
        scheduled_at: params.start_at,
        leg_price: params.leg_price,
        driver_payout: params.driver_payout,
        distance_miles: distanceMiles,
        duration_min: durationMin,
      });

      // Leg 2 - Return
      await supabase.from('booking_legs').insert({
        parent_booking_id: bookingId,
        leg_number: 2,
        pickup_location: params.destination,
        destination: params.pickup_location,
        pickup_lat: params.destination_lat,
        pickup_lng: params.destination_lng,
        destination_lat: params.pickup_lat,
        destination_lng: params.pickup_lng,
        vehicle_category: params.category,
        leg_type: 'return',
        status: 'pending',
        scheduled_at: returnDate,
        leg_price: params.leg_price,
        driver_payout: params.driver_payout,
        distance_miles: distanceMiles,
        duration_min: durationMin,
      });
    } else {
      // Create 1 leg for oneway, hourly, daily
      const destination = params.trip_type === 'hourly' || params.trip_type === 'daily'
        ? `Multiple destinations - ${params.trip_type === 'hourly' ? (params.hours || 4) + ' hour' : (params.days || 1) + ' day'} hire`
        : params.destination;

      await supabase.from('booking_legs').insert({
        parent_booking_id: bookingId,
        leg_number: 1,
        pickup_location: params.pickup_location,
        destination: destination,
        pickup_lat: params.pickup_lat,
        pickup_lng: params.pickup_lng,
        destination_lat: params.trip_type === 'hourly' || params.trip_type === 'daily' ? params.pickup_lat : params.destination_lat,
        destination_lng: params.trip_type === 'hourly' || params.trip_type === 'daily' ? params.pickup_lng : params.destination_lng,
        vehicle_category: params.category,
        leg_type: params.trip_type,
        status: 'pending',
        scheduled_at: params.start_at,
        leg_price: params.leg_price,
        driver_payout: params.driver_payout,
        distance_miles: distanceMiles,
        duration_min: durationMin,
      });
    }

    // 3. Update booking_metadata with hours/days for hourly/daily bookings
    // Note: booking_metadata row is auto-created by sync_bookings_to_modular trigger
    console.log('DEBUG: trip_type =', params.trip_type, 'hours =', params.hours, 'days =', params.days);
    const { error: metadataError } = await supabase
      .from('booking_metadata')
      .update({
        hours: params.trip_type === 'hourly' ? params.hours : null,
        days: params.trip_type === 'daily' ? params.days : null,
        return_date: params.trip_type === 'return' ? params.return_date : null,
        return_time: params.trip_type === 'return' ? params.return_time : null,
      })
      .eq('booking_id', bookingId);

    if (metadataError) {
      console.error('❌ booking_metadata update error:', metadataError);
      throw new Error(`Metadata update failed: ${metadataError.message}`);
    }
    console.log('✅ booking_metadata updated successfully with hours =', params.trip_type === 'hourly' ? params.hours : null);

    return {
      success: true,
      reference: booking.reference,
      bookingId: bookingId,
    };
  } catch (error) {
    console.error('Create test booking error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
