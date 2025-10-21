/**
 * Booking Entity - API Interface
 * API calls specific to booking entity
 */

import type { Booking, BookingListItem } from '../model/types';
import type { BookingListRequestSchema, UpdateBookingStatusSchema } from '../model/schema';
import { createClient } from '@/lib/supabase/client';
import type { z } from 'zod';

type BookingListRequest = z.infer<typeof BookingListRequestSchema>;
type UpdateBookingStatusRequest = z.infer<typeof UpdateBookingStatusSchema>;

/**
 * List bookings with pagination and filters
 */
export async function listBookings(params: BookingListRequest): Promise<{
  data: BookingListItem[];
  total: number;
  page: number;
  limit: number;
}> {
  const supabase = createClient();
  const { statusFilter = [], page = 1, limit = 20 } = params;
  
  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  
  if (statusFilter.length > 0) {
    query = query.in('status', statusFilter);
  }
  
  const { data, error, count } = await query;
  
  if (error) throw error;
  
  return {
    data: data as BookingListItem[],
    total: count || 0,
    page,
    limit,
  };
}

/**
 * Get single booking by ID with full details
 */
export async function getBooking(id: string): Promise<Booking | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, booking_segments(*), booking_pricing(*), booking_services(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  return data as unknown as Booking;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  params: UpdateBookingStatusRequest
): Promise<void> {
  const supabase = createClient();
  const { id, status } = params;
  
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) throw error;
}
