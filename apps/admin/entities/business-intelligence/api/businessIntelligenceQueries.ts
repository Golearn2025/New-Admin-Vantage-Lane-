/**
 * Business Intelligence Queries - Index
 * 
 * Re-exports all BI queries from focused modules
 * Refactored: Split 390 lines into focused domain files
 */

// Booking-related queries
export {
  fetchBookingStats,
  fetchPeakHoursData,
  fetchTopRoutes,
  fetchVehicleStats,
} from './bookingQueries';

// Performance-related queries
export {
  fetchDriverPerformance,
  fetchWeekdayStats,
  fetchNotificationMetrics,
} from './performanceQueries';

// Aggregated data queries
export {
  fetchBusinessIntelligenceData,
} from './aggregatedQueries';
