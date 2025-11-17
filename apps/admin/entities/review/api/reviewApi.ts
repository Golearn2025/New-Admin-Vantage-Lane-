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

export interface SafetyIncidentsParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  severity?: 1 | 2 | 3 | 4;
  reportedByType?: 'driver' | 'customer';
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

/**
 * Get safety incidents with filtering
 */
export async function getSafetyIncidents(params: SafetyIncidentsParams = {}) {
  const {
    page = 1,
    limit = 25,
    status,
    severity,
    reportedByType,
  } = params;

  try {
    let query = supabase
      .from('safety_incidents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('admin_investigation_status', status);
    }
    if (severity) {
      query = query.eq('severity_level', severity);
    }
    if (reportedByType) {
      query = query.eq('reported_by_type', reportedByType);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    // Transform to SafetyIncident type
    const incidents: SafetyIncident[] = (data || []).map(row => ({
      id: row.id,
      reportedById: row.reported_by_id,
      reportedByType: row.reported_by_type,
      reportedAgainstId: row.reported_against_id,
      reportedAgainstType: row.reported_against_type,
      bookingId: row.booking_id,
      incidentType: row.incident_type,
      severityLevel: row.severity_level,
      description: row.description,
      evidenceUrls: row.evidence_urls || [],
      adminInvestigationStatus: row.admin_investigation_status,
      adminInvestigatorId: row.admin_investigator_id,
      adminNotes: row.admin_notes,
      investigationStartedAt: row.investigation_started_at,
      investigationCompletedAt: row.investigation_completed_at,
      penaltyApplied: row.penalty_applied,
      penaltyType: row.penalty_type,
      penaltyDetails: row.penalty_details,
      penaltyAppliedAt: row.penalty_applied_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return {
      incidents,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      page,
      limit
    };

  } catch (error) {
    console.error('Error fetching safety incidents:', error);
    throw new Error('Failed to fetch safety incidents');
  }
}

/**
 * Update safety incident status
 */
export async function updateSafetyIncidentStatus(
  incidentId: string, 
  status: SafetyIncident['adminInvestigationStatus'],
  notes?: string
) {
  try {
    const updateData: any = {
      admin_investigation_status: status,
      updated_at: new Date().toISOString(),
    };

    if (notes) {
      updateData.admin_notes = notes;
    }

    if (status === 'investigating') {
      updateData.investigation_started_at = new Date().toISOString();
    }

    if (status === 'resolved' || status === 'dismissed') {
      updateData.investigation_completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('safety_incidents')
      .update(updateData)
      .eq('id', incidentId)
      .select()
      .single();

    if (error) throw error;

    return data;

  } catch (error) {
    console.error('Error updating incident status:', error);
    throw new Error('Failed to update incident status');
  }
}

/**
 * Get driver rating breakdown
 */
export async function getDriverRatingBreakdown(driverId: string): Promise<RatingBreakdown> {
  try {
    const { data, error } = await supabase
      .from('rating_statistics')
      .select('*')
      .eq('user_id', driverId)
      .eq('user_type', 'driver')
      .single();

    if (error) throw error;

    return {
      fiveStars: data?.five_star_count || 0,
      fourStars: data?.four_star_count || 0,
      threeStars: data?.three_star_count || 0,
      twoStars: data?.two_star_count || 0,
      oneStar: data?.one_star_count || 0,
      totalRatings: data?.total_ratings || 0,
      averageRating: data?.current_rating || 5.00,
    };

  } catch (error) {
    console.error('Error fetching rating breakdown:', error);
    return {
      fiveStars: 1,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
      totalRatings: 1,
      averageRating: 5.00,
    };
  }
}

/**
 * Get feedback templates
 */
export async function getFeedbackTemplates(templateType?: string) {
  try {
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

    return data || [];

  } catch (error) {
    console.error('Error fetching feedback templates:', error);
    throw new Error('Failed to fetch feedback templates');
  }
}

/**
 * Get real platform statistics from database
 */
export async function getPlatformStatistics() {
  try {
    // Get overall rating statistics
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('driver_reviews')
      .select('rating');
    
    if (ratingsError) throw ratingsError;

    // Calculate rating breakdown
    const ratings = ratingsData || [];
    const totalRatings = ratings.length;
    
    const ratingBreakdown = {
      fiveStars: ratings.filter(r => r.rating === 5).length,
      fourStars: ratings.filter(r => r.rating === 4).length, 
      threeStars: ratings.filter(r => r.rating === 3).length,
      twoStars: ratings.filter(r => r.rating === 2).length,
      oneStar: ratings.filter(r => r.rating === 1).length,
      totalRatings,
      averageRating: totalRatings > 0 ? 
        parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(2)) : 
        5.00
    };

    // Get safety incidents breakdown
    const { data: incidentsData, error: incidentsError } = await supabase
      .from('safety_incidents')
      .select('admin_investigation_status');

    if (incidentsError) throw incidentsError;

    const incidents = incidentsData || [];
    const safetyStats = {
      total: incidents.length,
      pending: incidents.filter(i => i.admin_investigation_status === 'pending').length,
      investigating: incidents.filter(i => i.admin_investigation_status === 'investigating').length,
      resolved: incidents.filter(i => i.admin_investigation_status === 'resolved').length,
      dismissed: incidents.filter(i => i.admin_investigation_status === 'dismissed').length
    };

    return {
      ratingBreakdown,
      safetyStats
    };

  } catch (error) {
    console.error('Error fetching platform statistics:', error);
    throw new Error('Failed to fetch platform statistics');
  }
}
