/**
 * Review Statistics & Analytics
 * 
 * Rating breakdowns, platform statistics, and analytics operations
 */

import { createClient } from '@supabase/supabase-js';
import type { RatingBreakdown } from '../model/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
