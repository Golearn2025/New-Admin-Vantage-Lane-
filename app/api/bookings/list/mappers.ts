/**
 * Bookings List API - Data Mappers
 * Status mapping and response transformation utilities
 */

import type { BookingsListResponse } from '@admin-shared/api/contracts/bookings';
import type { BookingRowDTO } from '@entities/booking/types/bookingsList.types';

// Safe numeric parser for DB values (can be string, number, or null)
function parseNum(val: string | number | null | undefined): number {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  return parseFloat(val) || 0;
}

// Status mapping from DB to contract enum
export function mapDbStatusToContract(
  dbStatus: string
): 'pending' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' {
  switch (dbStatus?.toUpperCase()) {
    case 'NEW':
    case 'PENDING':
      return 'pending';
    case 'ASSIGNED':
    case 'CONFIRMED':
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
      is_urgent: row.is_urgent ?? false,
      is_new: row.is_new ?? false,
      
      // Trip info
      trip_type: (row.trip_type as 'oneway' | 'return' | 'hourly' | 'daily' | 'fleet') || 'oneway',
      category: (row.vehicle_category?.toUpperCase() as string) || 'EXEC',
      vehicle_model: row.vehicle_model || null,
      
      // Customer info - handle null/undefined safely
      customer_name: row.customer_name || 'Unknown Customer',
      customer_phone: row.customer_phone || '',
      customer_email: row.customer_email || null,
      customer_total_bookings: row.customer_total_rides ?? 0,
      customer_loyalty_tier: (row.customer_loyalty_tier as 'bronze' | 'silver' | 'gold' | 'platinum' | null) ?? null,
      customer_status: (row.customer_status as 'active' | 'inactive' | 'suspended' | null) ?? null,
      customer_total_spent: typeof row.customer_total_spent === 'string' ? parseFloat(row.customer_total_spent) || 0 : (row.customer_total_spent ?? 0),
      customer_rating_average: row.customer_rating_average ? parseFloat(String(row.customer_rating_average)) : null,
      customer_rating_count: row.customer_rating_count ? Number(row.customer_rating_count) : null,
      
      // Locations - use correct RPC field names
      pickup_location: row.pickup_location || 'Unknown',
      destination: row.destination || 'Unknown',
      
      // Dates
      scheduled_at: row.pickup_time,
      created_at: row.created_at,
      
      // Trip details - use real data from RPC
      distance_miles: typeof row.distance_miles === 'string' ? parseFloat(row.distance_miles) || null : (row.distance_miles ?? null),
      duration_min: row.duration_min ?? null,
      hours: null, // Extracted from destination text for hourly/daily if needed
      passenger_count: row.passenger_count ?? null,
      bag_count: row.bag_count ?? null,
      flight_number: row.flight_number || null,
      notes: row.notes || null,
      
      // Return trip
      return_date: null,
      return_time: null,
      return_flight_number: null,
      
      // Fleet
      fleet_executive: null,
      fleet_s_class: null,
      fleet_v_class: null,
      fleet_suv: null,
      
      // Pricing - use real data from RPC
      fare_amount: parseNum(row.price_total),
      base_price: parseNum(row.price_total),
      platform_fee: parseNum(row.platform_fee),
      operator_net: parseNum(row.operator_net),
      driver_payout: parseNum(row.driver_payout),
      platform_commission_pct: parseNum(row.platform_commission_pct) || null,
      driver_commission_pct: parseNum(row.driver_commission_pct) || null,
      paid_services: [],
      free_services: [],
      payment_method: row.payment_method || 'CARD',
      payment_status: row.payment_status || 'pending',
      currency: row.currency || 'GBP',
      
      // Assignment - use real data from RPC
      driver_name: row.driver_name || null,
      driver_id: row.driver_id || null,
      driver_phone: row.driver_phone || null,
      driver_email: row.driver_email || null,
      driver_rating: null,
      vehicle_id: row.vehicle_id || null,
      vehicle_make: row.vehicle_make || null,
      vehicle_model_name: row.vehicle_model || null,
      vehicle_year: row.vehicle_year || null,
      vehicle_color: row.vehicle_color || null,
      vehicle_plate: row.vehicle_plate || null,
      assigned_at: row.assigned_at || null,
      assigned_by_name: null,
      
      // Status timestamps
      arrived_at_pickup: row.arrived_at_pickup || null,
      passenger_onboard_at: row.passenger_onboard_at || null,
      started_at: row.started_at || null,
      completed_at: row.completed_at || null,
      cancelled_at: row.cancelled_at || null,
      cancel_reason: row.cancel_reason || null,
      
      // Meta
      operator_name: row.organization_name || null,
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
