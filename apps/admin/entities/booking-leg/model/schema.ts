/**
 * Booking Leg Entity - Zod Schemas
 * 
 * Validation schemas for booking legs.
 * 
 * Architecture: entities/booking-leg/model/schema.ts
 * Compliant: Zod validation, TypeScript strict
 */

import { z } from 'zod';

export const legTypeSchema = z.enum(['outbound', 'return', 'fleet_vehicle']);

export const legStatusSchema = z.enum([
  'pending',
  'assigned',
  'en_route',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
]);

export const payoutStatusSchema = z.enum(['pending', 'paid', 'failed']);

export const bookingLegSchema = z.object({
  id: z.string().uuid(),
  parent_booking_id: z.string().uuid(),
  
  leg_number: z.number().int().positive(),
  leg_type: legTypeSchema,
  internal_reference: z.string().min(1),
  driver_reference: z.string().min(1),
  
  pickup_location: z.string().min(1),
  pickup_lat: z.number().nullable(),
  pickup_lng: z.number().nullable(),
  destination: z.string().min(1),
  destination_lat: z.number().nullable(),
  destination_lng: z.number().nullable(),
  scheduled_at: z.string().datetime(),
  
  distance_miles: z.number().nullable(),
  duration_min: z.number().int().nullable(),
  
  vehicle_category: z.string().nullable(),
  vehicle_model: z.string().nullable(),
  
  assigned_driver_id: z.string().uuid().nullable(),
  assigned_vehicle_id: z.string().uuid().nullable(),
  assigned_at: z.string().datetime().nullable(),
  assigned_by: z.string().uuid().nullable(),
  
  status: legStatusSchema,
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  cancelled_at: z.string().datetime().nullable(),
  cancellation_reason: z.string().nullable(),
  
  leg_price: z.number(),
  driver_payout: z.number().nullable(),
  payout_status: payoutStatusSchema,
  paid_at: z.string().datetime().nullable(),
  
  notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createBookingLegSchema = z.object({
  parent_booking_id: z.string().uuid(),
  leg_number: z.number().int().positive(),
  leg_type: legTypeSchema,
  internal_reference: z.string().min(1),
  driver_reference: z.string().min(1),
  pickup_location: z.string().min(1),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  destination: z.string().min(1),
  destination_lat: z.number().optional(),
  destination_lng: z.number().optional(),
  scheduled_at: z.string().datetime(),
  distance_miles: z.number().optional(),
  duration_min: z.number().int().optional(),
  vehicle_category: z.string().optional(),
  vehicle_model: z.string().optional(),
  leg_price: z.number().positive(),
  notes: z.string().optional(),
});

export const updateBookingLegSchema = z.object({
  assigned_driver_id: z.string().uuid().optional(),
  assigned_vehicle_id: z.string().uuid().optional(),
  status: legStatusSchema.optional(),
  driver_payout: z.number().optional(),
  payout_status: payoutStatusSchema.optional(),
  notes: z.string().optional(),
});
