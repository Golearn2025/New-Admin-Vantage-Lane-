/**
 * Booking Entity - Zod Schemas
 * Validation schemas for booking entity
 */

import { z } from 'zod';
import { BOOKING_STATUS, TRIP_TYPES } from './constants';

export const PassengerSchema = z.object({
  count: z.number().int().min(1).max(8),
  childSeats: z.number().int().min(0).max(4).optional(),
});

export const ServiceItemSchema = z.object({
  code: z.string(),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

export const PriceBreakdownSchema = z.object({
  basePrice: z.number().min(0),
  services: z.array(ServiceItemSchema),
  total: z.number().min(0),
  currency: z.string().length(3),
});

export const BookingSegmentSchema = z.object({
  seqNo: z.number().int().min(1),
  role: z.enum(['pickup', 'dropoff', 'via']),
  placeText: z.string().min(1),
  placeLabel: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const BookingSchema = z.object({
  id: z.string().uuid(),
  reference: z.string().regex(/^CB-\d{5}$/),
  tripType: z.enum([TRIP_TYPES.ONEWAY, TRIP_TYPES.RETURN, TRIP_TYPES.HOURLY, TRIP_TYPES.FLEET]),
  status: z.enum([
    BOOKING_STATUS.NEW,
    BOOKING_STATUS.ASSIGNED,
    BOOKING_STATUS.IN_PROGRESS,
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED,
  ]),
  bookingStatus: z.string(),
  customerId: z.string().uuid(),
  startAt: z.string().datetime(),
  passengers: PassengerSchema,
  bagCount: z.number().int().min(0),
  distanceMiles: z.number().min(0),
  durationMin: z.number().int().min(0),
  vehicleCategory: z.string(),
  vehicleModel: z.string().optional(),
  flightNumber: z.string().optional(),
  notes: z.string().optional(),
  segments: z.array(BookingSegmentSchema).min(2),
  pricing: PriceBreakdownSchema,
  assignedDriverId: z.string().uuid().optional(),
  assignedVehicleId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const BookingListRequestSchema = z.object({
  statusFilter: z.array(z.string()).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const UpdateBookingStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    BOOKING_STATUS.NEW,
    BOOKING_STATUS.ASSIGNED,
    BOOKING_STATUS.IN_PROGRESS,
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED,
  ]),
});
