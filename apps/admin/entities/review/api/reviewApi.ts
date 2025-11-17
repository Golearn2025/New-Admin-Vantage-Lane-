/**
 * Review API - Complete CRUD Operations
 * 
 * Centralized API layer pentru reviews management.
 * Zero fetch în UI components - toate callurile aici.
 */

import { createClient } from '@supabase/supabase-js';
import type { 
  DriverReview, 
  CustomerReview, 
  SafetyIncident, 
  FeedbackTemplate,
  RatingBreakdown 
} from '../model/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ReviewsListParams {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'rating' | 'driver_name' | 'customer_name';
  sortOrder?: 'asc' | 'desc';
  ratingFilter?: number; // 1-5
  safetyIssuesOnly?: boolean;
  driverId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SafetyIncidentsParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity?: 1 | 2 | 3 | 4;
  reportedByType?: 'driver' | 'customer' | 'admin';
}

/**
 * Get paginated driver reviews with filtering
 */
export async function getDriverReviews(params: ReviewsListParams = {}) {
  const {
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'desc',
    ratingFilter,
    safetyIssuesOnly,
    driverId,
    customerId,
    dateFrom,
    dateTo
  } = params;

  const offset = (page - 1) * limit;

  let query = supabase
    .from('driver_reviews')
    .select(`
      *,
      driver:drivers!driver_id(
        id,
        first_name,
        last_name,
        email,
        rating,
        rating_count
      ),
      customer:customers!customer_id(
        id,
        first_name,
        last_name,
        email
      ),
      booking:bookings!booking_id(
        id,
        booking_number,
        pickup_location,
        destination_location
      )
    `)
    .range(offset, offset + limit - 1)
    .order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply filters
  if (ratingFilter) {
    query = query.eq('rating', ratingFilter);
  }

  if (driverId) {
    query = query.eq('driver_id', driverId);
  }

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }

  if (dateFrom) {
    query = query.gte('created_at', dateFrom);
  }

  if (dateTo) {
    query = query.lte('created_at', dateTo);
  }

  if (safetyIssuesOnly) {
    // Join with safety incidents
    query = query.not('booking_id', 'is', null);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    reviews: data as DriverReview[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

/**
 * Get safety incidents with filtering
 */
export async function getSafetyIncidents(params: SafetyIncidentsParams = {}) {
  const {
    page = 1,
    limit = 50,
    status,
    severity,
    reportedByType
  } = params;

  const offset = (page - 1) * limit;

  let query = supabase
    .from('safety_incidents')
    .select(`
      *,
      booking:bookings!booking_id(
        id,
        booking_number,
        pickup_location,
        destination_location
      )
    `)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('admin_investigation_status', status);
  }

  if (severity) {
    query = query.eq('severity_level', severity);
  }

  if (reportedByType) {
    query = query.eq('reported_by_type', reportedByType);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    incidents: data as SafetyIncident[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  };
}

/**
 * Get driver rating breakdown (Uber style)
 */
export async function getDriverRatingBreakdown(driverId: string): Promise<RatingBreakdown> {
  const { data, error } = await supabase
    .from('driver_reviews')
    .select('rating')
    .eq('driver_id', driverId);

  if (error) throw error;

  const ratings = data.map(r => r.rating);
  const total = ratings.length;

  if (total === 0) {
    return {
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
      totalRatings: 0,
      averageRating: 5.0
    };
  }

  const breakdown = {
    fiveStars: ratings.filter(r => r === 5).length,
    fourStars: ratings.filter(r => r === 4).length,
    threeStars: ratings.filter(r => r === 3).length,
    twoStars: ratings.filter(r => r === 2).length,
    oneStar: ratings.filter(r => r === 1).length,
    totalRatings: total,
    averageRating: Number((ratings.reduce((sum, r) => sum + r, 0) / total).toFixed(2))
  };

  return breakdown;
}

/**
 * Update safety incident status (Admin only)
 */
export async function updateSafetyIncidentStatus(
  incidentId: string,
  status: SafetyIncident['adminInvestigationStatus'],
  notes?: string
) {
  const { data, error } = await supabase
    .from('safety_incidents')
    .update({
      admin_investigation_status: status,
      admin_notes: notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', incidentId)
    .select()
    .single();

  if (error) throw error;
  return data as SafetyIncident;
}

/**
 * Get feedback templates by type
 */
export async function getFeedbackTemplates(templateType?: string) {
  let query = supabase
    .from('feedback_templates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (templateType) {
    query = query.eq('template_type', templateType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as FeedbackTemplate[];
}
