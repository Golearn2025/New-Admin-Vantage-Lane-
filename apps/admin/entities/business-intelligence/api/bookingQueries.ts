/**
 * Booking Statistics Queries
 * Business Intelligence - Booking related analytics
 */

import { createClient } from '@/lib/supabase/client';
import type {
    BookingStats,
    PeakHourData,
    RouteFrequency,
    VehicleStats,
} from './businessIntelligenceTypes';

export async function fetchBookingStats(): Promise<BookingStats | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('status, distance_miles, passenger_count')
      .limit(5000);
    
    if (error) {
      // Handle error silently
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const totalBookings = data.length;
    const completedBookings = data.filter(b => b.status === 'COMPLETED').length;
    const pendingBookings = data.filter(b => b.status === 'NEW').length;
    const cancelledBookings = data.filter(b => b.status === 'CANCELLED').length;
    
    // Calculate averages (only for bookings with valid data)
    const bookingsWithDistance = data.filter(b => b.distance_miles && b.distance_miles > 0);
    const averageDistance = bookingsWithDistance.length > 0
      ? bookingsWithDistance.reduce((sum, b) => sum + parseFloat(b.distance_miles), 0) / bookingsWithDistance.length
      : 0;
    
    const averagePassengers = data.length > 0
      ? data.reduce((sum, b) => sum + (parseFloat(b.passenger_count) || 1), 0) / data.length
      : 1;
    
    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
    
    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      averageDistance: Math.round(averageDistance * 100) / 100,
      averagePassengers: Math.round(averagePassengers * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  } catch (error) {
    // Handle error silently
    return null;
  }
}

export async function fetchPeakHoursData(): Promise<PeakHourData[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('start_at, status')
      .not('start_at', 'is', null)
      .limit(5000);
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    // Group by hour
    const hourCounts: { [key: number]: number } = {};
    
    data.forEach(booking => {
      const date = new Date(booking.start_at);
      const hour = date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    // Convert to array and sort by hour
    return Object.entries(hourCounts).map(([hour, count]) => ({
      hourOfDay: parseInt(hour),
      bookingsCount: count,
      averageDistance: 0, // TODO: Calculate from data
      averagePassengers: 0, // TODO: Calculate from data
    })).sort((a, b) => a.hourOfDay - b.hourOfDay);
  } catch (error) {
    return [];
  }
}

export async function fetchTopRoutes(): Promise<RouteFrequency[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('from_location_name, to_location_name, status')
      .not('from_location_name', 'is', null)
      .not('to_location_name', 'is', null)
      .limit(5000);
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    // Group routes by from->to combination
    const routeCounts: { [key: string]: number } = {};
    
    data.forEach(booking => {
      const key = `${booking.from_location_name}|||${booking.to_location_name}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;
    });
    
    const totalRoutes = Object.values(routeCounts).reduce((sum, count) => sum + count, 0);
    
    // Convert to array, sort by frequency, and take top 10
    return Object.entries(routeCounts)
      .map(([key, frequency]) => {
        const [pickupLocation, destination] = key.split('|||');
        return {
          pickupLocation: pickupLocation || 'Unknown',
          destination: destination || 'Unknown',
          frequency,
          percentage: totalRoutes > 0 ? Math.round((frequency / totalRoutes) * 100 * 100) / 100 : 0,
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  } catch (error) {
    return [];
  }
}

export async function fetchVehicleStats(): Promise<VehicleStats[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('vehicle_type, status')
      .limit(5000);
    
    if (error || !data || data.length === 0) {
      return [];
    }
    
    // Group by vehicle type
    const vehicleCounts: { [key: string]: number } = {};
    
    data.forEach(booking => {
      const vehicleType = booking.vehicle_type || 'Unknown';
      vehicleCounts[vehicleType] = (vehicleCounts[vehicleType] || 0) + 1;
    });
    
    // Convert to array and sort by usage
    return Object.entries(vehicleCounts)
      .map(([vehicleCategory, bookingsCount]) => ({
        vehicleCategory,
        bookingsCount,
        averageRating: 0, // TODO: Calculate from ratings
        totalRevenue: 0, // TODO: Calculate from booking totals
        utilizationRate: 0, // TODO: Calculate utilization percentage
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);
  } catch (error) {
    return [];
  }
}
