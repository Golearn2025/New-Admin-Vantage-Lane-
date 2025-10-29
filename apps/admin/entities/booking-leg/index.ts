/**
 * Booking Leg Entity - Public API
 * 
 * Barrel export for booking-leg entity.
 * 
 * Architecture: entities/booking-leg/index.ts
 */

// Types
export type {
  BookingLeg,
  BookingLegWithDetails,
  CreateBookingLegInput,
  UpdateBookingLegInput,
  LegType,
  LegStatus,
  PayoutStatus,
} from './model/types';

// Schemas
export {
  bookingLegSchema,
  createBookingLegSchema,
  updateBookingLegSchema,
  legTypeSchema,
  legStatusSchema,
  payoutStatusSchema,
} from './model/schema';

// API
export {
  getBookingLegs,
  getBookingLegsWithDetails,
  createBookingLeg,
  updateBookingLeg,
  assignDriverToLeg,
  updateLegStatus,
} from './api/bookingLegApi';
