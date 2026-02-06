/**
 * Booking Entity - Constants
 * Domain constants for booking entity
 */

export const BOOKING_STATUS = {
  NEW: 'NEW',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const TRIP_TYPES = {
  ONEWAY: 'oneway',
  RETURN: 'return',
  HOURLY: 'hourly',
  DAILY: 'daily',
  FLEET: 'fleet',
} as const;

// TODO: Add more domain constants
