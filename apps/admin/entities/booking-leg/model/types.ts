/**
 * Booking Leg Entity - Type Definitions
 * 
 * Multi-leg bookings: RETURN bookings split into 2 legs (outbound + return),
 * FLEET bookings split into N legs (one per vehicle).
 * Each leg can have different driver, vehicle, and status.
 * 
 * Architecture: entities/booking-leg/model/types.ts
 * Compliant: TypeScript strict, zero any
 */

export type LegType = 'outbound' | 'return' | 'fleet_vehicle';

export type LegStatus = 
  | 'pending' 
  | 'assigned' 
  | 'en_route' 
  | 'arrived' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type PayoutStatus = 'pending' | 'paid' | 'failed';

export interface BookingLeg {
  id: string;
  parent_booking_id: string;
  
  // Leg identification
  leg_number: number;
  leg_type: LegType;
  internal_reference: string; // CB-00129-LEG1
  driver_reference: string; // CB-00129-OUT
  
  // Trip details
  pickup_location: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  destination: string;
  destination_lat: number | null;
  destination_lng: number | null;
  scheduled_at: string; // ISO 8601
  
  // Distance & Duration
  distance_miles: number | null;
  duration_min: number | null;
  
  // Vehicle type (for fleet legs)
  vehicle_category: string | null;
  vehicle_model: string | null;
  
  // Assignment
  assigned_driver_id: string | null;
  assigned_vehicle_id: string | null;
  assigned_at: string | null;
  assigned_by: string | null;
  
  // Status
  status: LegStatus;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  
  // Pricing
  leg_price: number;
  driver_payout: number | null;
  payout_status: PayoutStatus;
  paid_at: string | null;
  
  // Metadata
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingLegWithDetails extends BookingLeg {
  driver_name: string | null;
  driver_phone: string | null;
  driver_rating: number | null;
  vehicle_make: string | null;
  vehicle_model_name: string | null;
  vehicle_plate: string | null;
  vehicle_color: string | null;
  vehicle_year: number | null;
}

export interface CreateBookingLegInput {
  parent_booking_id: string;
  leg_number: number;
  leg_type: LegType;
  internal_reference: string;
  driver_reference: string;
  pickup_location: string;
  pickup_lat?: number;
  pickup_lng?: number;
  destination: string;
  destination_lat?: number;
  destination_lng?: number;
  scheduled_at: string;
  distance_miles?: number;
  duration_min?: number;
  vehicle_category?: string;
  vehicle_model?: string;
  leg_price: number;
  notes?: string;
}

export interface UpdateBookingLegInput {
  assigned_driver_id?: string;
  assigned_vehicle_id?: string;
  status?: LegStatus;
  driver_payout?: number;
  payout_status?: PayoutStatus;
  notes?: string;
}
