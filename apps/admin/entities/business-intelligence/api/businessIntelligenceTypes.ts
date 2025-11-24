/**
 * Business Intelligence Types
 *
 * Type definitions for analytics and insights data.
 * File: < 200 lines (RULES.md compliant)
 */

export interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  averageDistance: number;
  averagePassengers: number;
  completionRate: number;
}

export interface PeakHourData {
  hourOfDay: number;
  bookingsCount: number;
  averageDistance: number;
  averagePassengers: number;
}

export interface RouteFrequency {
  pickupLocation: string;
  destination: string;
  frequency: number;
  percentage: number;
}

export interface VehicleStats {
  vehicleCategory: string;
  bookingsCount: number;
  averageRating: number;
  totalRevenue: number;
  utilizationRate: number;
}

export interface DriverPerformance {
  driverName: string;
  ratingAverage: number | null;
  ratingCount: number;
  organization: string;
  documentsCount: number;
  approvedDocs: number;
  assignedBookings: number;
}

export interface DayOfWeekStats {
  dayOfWeek: string;
  bookingsCount: number;
  percentage: number;
  averageRevenue: number;
}

export interface NotificationMetrics {
  notificationDate: string;
  targetType: string;
  type: string;
  senderType: string | null;
  notificationCount: number;
  readNotifications: number;
  unreadNotifications: number;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: 'revenue' | 'efficiency' | 'quality' | 'growth';
  data?: Record<string, any>;
}

export interface BusinessIntelligenceData {
  bookingStats: BookingStats | null;
  peakHours: PeakHourData[];
  topRoutes: RouteFrequency[];
  vehicleStats: VehicleStats[];
  driverPerformance: DriverPerformance[];
  weekdayStats: DayOfWeekStats[];
  notifications: NotificationMetrics[];
  aiInsights: AIInsight[];
  hasData: boolean;
  lastUpdated: string;
}
