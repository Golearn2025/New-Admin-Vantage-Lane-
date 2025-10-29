/**
 * Booking Leg Entity - API Layer
 * 
 * CRUD operations for booking legs.
 * 
 * Architecture: entities/booking-leg/api/bookingLegApi.ts
 * Compliant: TypeScript strict, Supabase client, error handling
 */

import { createClient } from '@/lib/supabase/server';
import type { 
  BookingLeg, 
  BookingLegWithDetails, 
  CreateBookingLegInput, 
  UpdateBookingLegInput 
} from '../model/types';

/**
 * Get all legs for a booking
 */
export async function getBookingLegs(
  bookingId: string
): Promise<BookingLeg[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('booking_legs')
    .select('*')
    .eq('parent_booking_id', bookingId)
    .order('leg_number', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch booking legs: ${error.message}`);
  }
  
  return data as BookingLeg[];
}

/**
 * Get legs with driver and vehicle details
 */
export async function getBookingLegsWithDetails(
  bookingId: string
): Promise<BookingLegWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('booking_legs')
    .select(`
      *,
      driver:assigned_driver_id (
        id,
        name,
        phone,
        rating
      ),
      vehicle:assigned_vehicle_id (
        id,
        make,
        model,
        plate,
        color,
        year
      )
    `)
    .eq('parent_booking_id', bookingId)
    .order('leg_number', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch booking legs with details: ${error.message}`);
  }
  
  // Transform to flat structure
  return (data as any[]).map((leg) => ({
    ...leg,
    driver_name: leg.driver?.name || null,
    driver_phone: leg.driver?.phone || null,
    driver_rating: leg.driver?.rating || null,
    vehicle_make: leg.vehicle?.make || null,
    vehicle_model_name: leg.vehicle?.model || null,
    vehicle_plate: leg.vehicle?.plate || null,
    vehicle_color: leg.vehicle?.color || null,
    vehicle_year: leg.vehicle?.year || null,
  })) as BookingLegWithDetails[];
}

/**
 * Create a new booking leg
 */
export async function createBookingLeg(
  input: CreateBookingLegInput
): Promise<BookingLeg> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('booking_legs')
    .insert(input)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create booking leg: ${error.message}`);
  }
  
  return data as BookingLeg;
}

/**
 * Update a booking leg
 */
export async function updateBookingLeg(
  legId: string,
  input: UpdateBookingLegInput
): Promise<BookingLeg> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('booking_legs')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', legId)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update booking leg: ${error.message}`);
  }
  
  return data as BookingLeg;
}

/**
 * Assign driver to a leg
 */
export async function assignDriverToLeg(
  legId: string,
  driverId: string,
  vehicleId: string,
  assignedBy: string
): Promise<BookingLeg> {
  return updateBookingLeg(legId, {
    assigned_driver_id: driverId,
    assigned_vehicle_id: vehicleId,
    status: 'assigned',
  });
}

/**
 * Update leg status
 */
export async function updateLegStatus(
  legId: string,
  status: BookingLeg['status']
): Promise<BookingLeg> {
  const updates: UpdateBookingLegInput = { status };
  
  // Set timestamps based on status
  const now = new Date().toISOString();
  if (status === 'completed') {
    updates.status = 'completed';
  } else if (status === 'cancelled') {
    updates.status = 'cancelled';
  }
  
  return updateBookingLeg(legId, updates);
}
