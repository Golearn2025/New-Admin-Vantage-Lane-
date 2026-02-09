/**
 * Business Intelligence Types
 *
 * All type definitions for the AI Business Advisor module.
 */

/* ── AI Message System ── */

export type InsightCategory = 'risk' | 'action' | 'opportunity' | 'growth' | 'system';
export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AIInsight {
  id: string;
  category: InsightCategory;
  priority: InsightPriority;
  title: string;
  description: string;
  why: string;
  recommendation: string;
}

/* ── Business Health ── */

export interface BusinessHealthScore {
  overall: number;           // 0–100
  revenueStability: number;
  clientDiversification: number;
  completionRate: number;
  fleetUtilization: number;
  driverAvailability: number;
}

/* ── Booking & Status ── */

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  revenue: number;
}

export interface BookingSummary {
  totalBookings: number;
  totalRevenue: number;
  platformProfit: number;
  avgPrice: number;
  completionRate: number;
  statusBreakdown: StatusBreakdown[];
}

/* ── Revenue & Pricing ── */

export interface CategoryRevenue {
  category: string;
  legs: number;
  revenue: number;
  avgPrice: number;
  driverPayout: number;
  platformProfit: number;
  marginPct: number;
}

export interface TripTypeRevenue {
  tripType: string;
  category: string;
  bookings: number;
  revenue: number;
  avgPrice: number;
  platformFee: number;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalPlatformFees: number;
  totalDriverPayouts: number;
  avgMargin: number;
  byCategory: CategoryRevenue[];
  byTripType: TripTypeRevenue[];
}

/* ── Routes & Demand ── */

export interface RouteData {
  pickup: string;
  destination: string;
  trips: number;
  avgMiles: number | null;
  avgDuration: number | null;
  revenue: number;
  avgPrice: number;
}

export interface DemandByHour {
  dayOfWeek: number;
  dayName: string;
  hour: number;
  bookings: number;
}

export interface RoutesSummary {
  totalLegs: number;
  avgDistance: number;
  avgDuration: number;
  totalLegRevenue: number;
  topRoutes: RouteData[];
  demandByTime: DemandByHour[];
}

/* ── Drivers & Fleet ── */

export interface DriverRow {
  id: string;
  name: string;
  status: string;
  onlineStatus: string;
  ratingAverage: number;
  ratingCount: number;
  totalCompleted: number;
  totalCancellations: number;
  completionRate: number;
  warningLevel: string;
}

export interface VehicleRow {
  category: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  isActive: boolean;
  approvalStatus: string;
}

export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  pendingApproval: number;
  categories: string[];
  vehicles: VehicleRow[];
}

export interface DriversSummary {
  totalDrivers: number;
  activeDrivers: number;
  onlineNow: number;
  avgRating: number;
  drivers: DriverRow[];
}

/* ── Customers ── */

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  status: string;
  ratingAverage: number;
  bookings: number;
  revenue: number;
  avgPrice: number;
  createdAt: string;
}

export interface CustomersSummary {
  totalCustomers: number;
  activeCustomers: number;
  avgBookingsPerCustomer: number;
  avgRevenuePerCustomer: number;
  customers: CustomerRow[];
}

/* ── Launch Plan ── */

export type LaunchPhase = 'pre_launch' | 'launch' | 'stabilize' | 'scale' | 'expand';

export interface LaunchMilestone {
  phase: LaunchPhase;
  title: string;
  description: string;
  status: 'done' | 'active' | 'upcoming';
  items: string[];
}

/* ── Master Data ── */

export interface BIData {
  bookings: BookingSummary;
  revenue: RevenueSummary;
  routes: RoutesSummary;
  drivers: DriversSummary;
  fleet: FleetSummary;
  customers: CustomersSummary;
  health: BusinessHealthScore;
  insights: AIInsight[];
  launchPlan: LaunchMilestone[];
}
