/**
 * Booking Entity - Types
 * Domain types for booking entity
 */

import type { BOOKING_STATUS, TRIP_TYPES } from './constants';

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];
export type TripType = (typeof TRIP_TYPES)[keyof typeof TRIP_TYPES];

export interface Passenger {
  count: number;
  childSeats?: number;
}

export interface PriceBreakdown {
  basePrice: number;
  services: ServiceItem[];
  total: number;
  currency: string;
}

export interface ServiceItem {
  code: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BookingSegment {
  seqNo: number;
  role: 'pickup' | 'dropoff' | 'via';
  placeText: string;
  placeLabel: string;
  lat?: number;
  lng?: number;
}

export interface Booking {
  id: string;
  reference: string;
  tripType: TripType;
  status: BookingStatus;
  bookingStatus: string;
  customerId: string;
  startAt: string;
  passengers: Passenger;
  bagCount: number;
  distanceMiles: number;
  durationMin: number;
  vehicleCategory: string;
  vehicleModel?: string;
  flightNumber?: string;
  notes?: string;
  segments: BookingSegment[];
  pricing: PriceBreakdown;
  assignedDriverId?: string;
  assignedVehicleId?: string;
  createdAt: string;
  updatedAt: string;
}

// Re-export contract types
export type { BookingListItem, BookingsListRequest, BookingsListResponse } from '@admin-shared/api/contracts';
