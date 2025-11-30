/**
 * Bookings List API - Data Mappers
 * Status mapping and response transformation utilities
 */

import type { BookingsListResponse } from '@admin-shared/api/contracts/bookings';
import type { BookingRowDTO } from '@entities/booking/types/bookingsList.types';

// Status mapping from DB to contract enum
export function mapDbStatusToContract(
  dbStatus: string
): 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' {
  switch (dbStatus?.toUpperCase()) {
    case 'NEW':
    case 'PENDING':
      return 'pending';
    case 'ASSIGNED':
      return 'assigned';
    case 'EN_ROUTE':
    case 'ENROUTE':
      return 'en_route';
    case 'ARRIVED':
      return 'arrived';
    case 'IN_PROGRESS':
    case 'INPROGRESS':
      return 'in_progress';
    case 'COMPLETED':
    case 'FINISHED':
      return 'completed';
    case 'CANCELLED':
    case 'CANCELED':
      return 'cancelled';
    default:
      return 'pending'; // Default fallback
  }
}

// Transform RPC rows to API response
export function transformRowsToResponse(
  rows: BookingRowDTO[],
  page: number,
  pageSize: number,
  startTime: number
): BookingsListResponse {
  const total = rows.length > 0 ? (rows[0]?.total_count ?? 0) : 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: rows.map(row => ({
      // Core identifiers
      id: row.booking_id,
      reference: row.reference || 'N/A',
      
      // Status & flags - map DB values to contract enum
      status: mapDbStatusToContract(row.status),
      is_urgent: false, // TODO: Calculate from pickup_time < 3h and no driver
      is_new: false, // TODO: Calculate from created_at < 24h ago
      
      // Trip info
      trip_type: (row.trip_type as 'oneway' | 'return' | 'hourly' | 'fleet') || 'oneway',
      category: 'EXEC', // TODO: Get from booking data
      vehicle_model: null, // TODO: Get from vehicle assignment
      
      // Customer info - handle null/undefined safely
      customer_name: row.customer_name || 'Unknown Customer',
      customer_phone: row.customer_phone || '',
      customer_email: row.customer_email || null,
      customer_total_bookings: 0, // TODO: Calculate
      customer_loyalty_tier: null,
      customer_status: null,
      customer_total_spent: 0,
      
      // Locations
      pickup_location: row.pickup_address,
      destination: row.dropoff_address,
      
      // Dates
      scheduled_at: row.pickup_time,
      created_at: row.created_at,
      
      // Trip details
      distance_miles: null,
      duration_min: null,
      hours: null,
      passenger_count: null,
      bag_count: null,
      flight_number: null,
      notes: null,
      
      // Return trip
      return_date: null,
      return_time: null,
      return_flight_number: null,
      
      // Fleet
      fleet_executive: null,
      fleet_s_class: null,
      fleet_v_class: null,
      fleet_suv: null,
      
      // Pricing - convert string to number
      fare_amount: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
      base_price: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
      platform_fee: 0,
      operator_net: typeof row.price_total === 'string' ? parseFloat(row.price_total) || 0 : (row.price_total || 0),
      driver_payout: 0,
      platform_commission_pct: null,
      driver_commission_pct: null,
      paid_services: [],
      free_services: [],
      payment_method: 'CARD',
      payment_status: 'pending',
      currency: row.currency || 'GBP',
      
      // Assignment
      driver_name: row.driver_name,
      driver_id: row.driver_id,
      driver_phone: null,
      driver_email: null,
      driver_rating: null,
      vehicle_id: row.vehicle_id,
      vehicle_make: null,
      vehicle_model_name: row.vehicle_name,
      vehicle_year: null,
      vehicle_color: null,
      vehicle_plate: null,
      assigned_at: null,
      assigned_by_name: null,
      
      // Meta
      operator_name: row.organization_name,
      operator_rating: null,
      operator_reviews: null,
      source: 'web' as const,
      
      // Legs
      legs: [],
    })),
    pagination: {
      total_count: total,
      page_size: pageSize,
      has_next_page: page < totalPages,
      has_previous_page: page > 1,
      current_page: page,
      total_pages: totalPages,
    },
    performance: {
      query_duration_ms: Date.now() - startTime,
      cache_hit: false,
    },
  };
}
