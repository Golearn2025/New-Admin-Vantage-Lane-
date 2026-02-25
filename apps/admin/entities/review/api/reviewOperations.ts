/**
 * Review Operations - Reviews CRUD
 * 
 * Driver reviews filtering, pagination, and management operations
 */

import { createClient } from '@/lib/supabase/client';
import type { DriverReview } from '../model/types';

export interface ReviewsListParams {
  page?: number;
  limit?: number;
  driverId?: string;
  rating?: number;
  startDate?: string;
  endDate?: string;
  isVerified?: boolean;
}

export interface ReviewsListResponse {
  reviews: DriverReview[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

/**
 * Get paginated driver reviews with filtering
 */
export async function getDriverReviews(params: ReviewsListParams = {}): Promise<ReviewsListResponse> {
  const {
    page = 1,
    limit = 25,
    driverId,
    rating,
    startDate,
    endDate,
    isVerified
  } = params;

  try {
    const supabase = createClient();
    let query = supabase
      .from('driver_reviews')
      .select(`
        *,
        drivers(id, first_name, last_name, email, phone),
        customers(id, first_name, last_name, email),
        bookings(id, reference)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (driverId) {
      query = query.eq('driver_id', driverId);
    }
    if (rating) {
      query = query.eq('rating', rating);
    }
    if (isVerified !== undefined) {
      query = query.eq('is_verified', isVerified);
    }
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Transform data to match our types
    const reviews: DriverReview[] = (data || []).map(row => ({
      id: row.id,
      driverId: row.driver_id,
      customerId: row.customer_id,
      bookingId: row.booking_id,
      rating: row.rating,
      reviewText: row.review_text,
      categories: null, // TODO: Add when implemented
      isAnonymous: false, // TODO: Add when implemented
      isVerified: row.is_verified,
      createdAt: row.created_at,
      
      // Populated fields
      driverName: `${row.drivers?.first_name || ''} ${row.drivers?.last_name || ''}`.trim() || 'Unknown',
      customerName: `${row.customers?.first_name || ''} ${row.customers?.last_name || ''}`.trim() || 'Unknown',
      bookingNumber: row.bookings?.reference,
      driverCurrentRating: row.rating_statistics?.[0]?.current_rating || 5.00,
      driverTotalRatings: row.rating_statistics?.[0]?.total_ratings || 0,
    }));

    const totalPages = Math.ceil((count || 0) / limit);

    return {
      reviews,
      total: count || 0,
      totalPages,
      page,
      limit
    };

  } catch (error) {
    console.error('Error fetching driver reviews:', error);
    throw new Error('Failed to fetch driver reviews');
  }
}
