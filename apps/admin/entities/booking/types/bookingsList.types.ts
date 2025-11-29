/**
 * Bookings List Types - Enterprise Strict
 * 
 * ZERO any types, complete type safety
 * Maps directly to RPC get_bookings_list output
 */

export type BookingsSort = 'created_at' | 'pickup_time' | 'status' | 'price_total';
export type SortDir = 'asc' | 'desc';

export interface BookingsListParams {
  limit: number;
  offset: number;
  sort: BookingsSort;
  dir: SortDir;
  search?: string | null;
  status?: string | null;
  from?: string | null;
  to?: string | null;
}

export interface BookingRowDTO {
  booking_id: string;
  reference: string | null;
  created_at: string;
  status: string;
  trip_type: string | null;
  pickup_time: string | null;
  pickup_address: string;
  dropoff_address: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string;
  organization_id: string | null;
  organization_name: string | null;
  driver_id: string | null;
  driver_name: string | null;
  vehicle_id: string | null;
  vehicle_name: string | null;
  price_total: string | number | null;
  currency: string | null;
  total_count: number;
}

export interface BookingsListResult {
  rows: BookingRowDTO[];
  total: number;
}
