/**
 * Performance Analytics Queries
 * Business Intelligence - Driver and operational performance
 */

import { createClient } from '@/lib/supabase/client';
import type {
  DriverPerformance,
  DayOfWeekStats,
  NotificationMetrics,
} from './businessIntelligenceTypes';

const supabase = createClient();

export async function fetchDriverPerformance(): Promise<DriverPerformance[]> {
  // Return empty for now - driver performance needs JOIN with drivers table
  // TODO: Implement when driver assignment is properly tracked
  return [];
}

export async function fetchWeekdayStats(): Promise<DayOfWeekStats[]> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_at, status')
      .not('start_at', 'is', null);
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    // Group by day of week (0 = Sunday, 6 = Saturday)
    const dayCounts: { [key: number]: number } = {};
    
    data.forEach(booking => {
      const date = new Date(booking.start_at);
      const dayOfWeek = date.getDay();
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    });
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Convert to array with day names
    return dayNames.map((dayName, index) => ({
      dayOfWeek: dayName,
      bookingsCount: dayCounts[index] || 0,
      percentage: 0, // TODO: Calculate percentage
      averageRevenue: 0, // TODO: Calculate from booking totals
    }));
  } catch (error) {
    return [];
  }
}

export async function fetchNotificationMetrics(): Promise<NotificationMetrics[]> {
  // Return empty for now - notifications are separate feature
  return [];
}
