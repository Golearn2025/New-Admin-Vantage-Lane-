/**
 * Review Statistics & Analytics
 * 
 * Rating breakdowns, platform statistics, and analytics operations
 */

import { createClient } from '@/lib/supabase/client';
import type { RatingBreakdown } from '../model/types';

/**
 * Get driver rating breakdown
 */
export async function getDriverRatingBreakdown(driverId: string): Promise<RatingBreakdown> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('rating_statistics')
      .select('five_star_count, four_star_count, three_star_count, two_star_count, one_star_count, total_ratings, current_rating')
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
    const supabase = createClient();

    // Get overall rating statistics (with safety cap)
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('driver_reviews')
      .select('rating')
      .limit(5000);
    
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

    // Get safety incidents breakdown (with safety cap)
    const { data: incidentsData, error: incidentsError } = await supabase
      .from('safety_incidents')
      .select('admin_investigation_status')
      .limit(5000);

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
