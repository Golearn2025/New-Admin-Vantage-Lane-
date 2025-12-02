/**
 * Aggregated Business Intelligence Queries
 * Main API that combines all BI data sources
 */

import type {
  BusinessIntelligenceData,
  AIInsight,
} from './businessIntelligenceTypes';
import {
  fetchBookingStats,
  fetchPeakHoursData,
  fetchTopRoutes,
  fetchVehicleStats,
} from './bookingQueries';
import {
  fetchDriverPerformance,
  fetchWeekdayStats,
  fetchNotificationMetrics,
} from './performanceQueries';

export async function fetchBusinessIntelligenceData(): Promise<BusinessIntelligenceData> {
  try {
    const [
      bookingStats,
      peakHours,
      topRoutes,
      vehicleStats,
      driverPerformance,
      weekdayStats,
      notificationMetrics,
    ] = await Promise.all([
      fetchBookingStats(),
      fetchPeakHoursData(),
      fetchTopRoutes(),
      fetchVehicleStats(),
      fetchDriverPerformance(),
      fetchWeekdayStats(),
      fetchNotificationMetrics(),
    ]);

    const insights = await generateAIInsights({
      bookingStats,
      peakHours,
      topRoutes,
      vehicleStats,
      driverPerformance,
      weekdayStats,
      notifications: notificationMetrics,
    });

    return {
      bookingStats,
      peakHours,
      topRoutes,
      vehicleStats,
      driverPerformance,
      weekdayStats,
      notifications: notificationMetrics,
      aiInsights: insights,
      hasData: true,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    // Handle error and return empty data structure
    return {
      bookingStats: null,
      peakHours: [],
      topRoutes: [],
      vehicleStats: [],
      driverPerformance: [],
      weekdayStats: [],
      notifications: [],
      aiInsights: [],
      hasData: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

async function generateAIInsights(data: Partial<BusinessIntelligenceData>): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  // Booking completion rate insight
  if (data.bookingStats && data.bookingStats.totalBookings > 0) {
    const completionRate = (data.bookingStats.completedBookings / data.bookingStats.totalBookings) * 100;
    
    if (completionRate < 70) {
      insights.push({
        id: '1',
        type: 'alert',
        title: 'Low Booking Completion Rate',
        description: `Only ${Math.round(completionRate)}% of bookings are being completed. Consider investigating common cancellation reasons.`,
        impact: 'high',
        category: 'efficiency',
      });
    }
  }

  // Peak hours insight
  if (data.peakHours && data.peakHours.length > 0) {
    const peakHour = data.peakHours.reduce((prev, current) => 
      prev.bookingsCount > current.bookingsCount ? prev : current
    );
    
    insights.push({
      id: '2',
      type: 'recommendation',
      title: 'Peak Hour Identified',
      description: `Most bookings occur at ${peakHour.hourOfDay}:00 with ${peakHour.bookingsCount} bookings. Ensure adequate driver availability during this time.`,
      impact: 'medium',
      category: 'efficiency',
    });
  }

  // Popular route insight
  if (data.topRoutes && data.topRoutes.length > 0) {
    const topRoute = data.topRoutes[0];
    
    if (topRoute) {
      insights.push({
        id: '3',
        type: 'opportunity',
        title: 'Most Popular Route',
        description: `${topRoute.pickupLocation} → ${topRoute.destination} is your most popular route with ${topRoute.frequency} bookings. Consider optimizing pricing or driver allocation for this route.`,
        impact: 'medium',
        category: 'revenue',
      });
    }
  }

  return insights;
}
