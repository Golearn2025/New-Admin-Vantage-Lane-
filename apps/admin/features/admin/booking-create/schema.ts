/**
 * Booking Creation Validation Schemas
 * Zod schemas for API request validation
 * Ver 3.4 - Add Zod validation
 */

import { z } from 'zod';

/**
 * Booking Service Schema
 */
export const BookingServiceSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  price: z.number().nonnegative(),
  selected: z.boolean(),
  isFree: z.boolean(),
});

/**
 * Booking Segment Schema (pickup, destination, stops)
 */
export const BookingSegmentSchema = z.object({
  seq_no: z.number().int().positive(),
  role: z.enum(['pickup', 'dropoff']),
  place_text: z.string().min(1),
  place_label: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
}).transform(data => ({
  seq_no: data.seq_no,
  role: data.role,
  place_text: data.place_text,
  ...(data.place_label && { place_label: data.place_label }),
  ...(data.lat && { lat: data.lat }),
  ...(data.lng && { lng: data.lng }),
}));

/**
 * Create Booking Payload Schema
 */
export const CreateBookingPayloadSchema = z.object({
  customer_id: z.string().uuid(),
  organization_id: z.string().uuid().optional(),
  operator_id: z.string().min(1),
  trip_type: z.enum(['oneway', 'return', 'hourly', 'fleet']),
  category: z.enum(['EXEC', 'LUX', 'SUV', 'VAN']),
  start_at: z.string(), // ISO timestamp
  passenger_count: z.number().int().min(1).max(20),
  bag_count: z.number().int().min(0).max(50),
  child_seats: z.number().int().min(0).max(10),
  flight_number: z.string().optional(),
  notes: z.string().optional(),
  status: z.string(),
  payment_status: z.string(),
  currency: z.string().length(3),
  payment_method: z.string(),
  
  // Return trip fields
  return_date: z.string().optional(),
  return_time: z.string().optional(),
  return_flight_number: z.string().optional(),
  
  // Hourly trip
  hours: z.number().int().min(1).max(24).optional(),
  
  // Fleet booking
  fleet_executive: z.number().int().min(0).optional(),
  fleet_s_class: z.number().int().min(0).optional(),
  fleet_v_class: z.number().int().min(0).optional(),
  fleet_suv: z.number().int().min(0).optional(),
});

/**
 * Create Booking Request Schema (full API request body)
 */
export const CreateBookingSchema = z.object({
  payload: CreateBookingPayloadSchema,
  segments: z.array(BookingSegmentSchema).min(2), // At least pickup + destination
  services: z.array(BookingServiceSchema),
  basePrice: z.number().nonnegative(),
});

/**
 * List Bookings Query Params Schema
 */
export const ListBookingsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50),
  status: z.string().optional(),
  customer_id: z.string().uuid().optional(),
  operator_id: z.string().optional(),
  trip_type: z.enum(['oneway', 'return', 'hourly', 'fleet']).optional(),
  start_date: z.string().optional(), // ISO date
  end_date: z.string().optional(), // ISO date
  search: z.string().optional(),
});

/**
 * Type exports for TypeScript
 */
export type BookingServiceInput = z.infer<typeof BookingServiceSchema>;
export type BookingSegmentInput = z.infer<typeof BookingSegmentSchema>;
export type CreateBookingPayloadInput = z.infer<typeof CreateBookingPayloadSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type ListBookingsQueryInput = z.infer<typeof ListBookingsQuerySchema>;
