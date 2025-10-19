/**
 * Bookings Columns - Helper Functions
 * 
 * Date formatting, trip details, vehicle display utilities
 */

import type { BookingListItem } from '@admin/shared/api/contracts/bookings';

/**
 * Format date/time for display
 */
export const formatDateTime = (
  dateStr: string | null, 
  format: 'full' | 'date' | 'time' = 'full'
): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  
  if (format === 'date') {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }
  
  if (format === 'time') {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  return date.toLocaleString('en-GB', { 
    dateStyle: 'short', 
    timeStyle: 'short' 
  });
};

/**
 * Format trip details based on trip type
 */
export const formatTripDetails = (row: BookingListItem): string => {
  if (row.trip_type === 'hourly') {
    return `${row.hours || 1} hour${(row.hours || 1) > 1 ? 's' : ''}`;
  }
  
  if (row.trip_type === 'fleet') {
    const total = (row.fleet_executive || 0) + (row.fleet_s_class || 0) + 
                  (row.fleet_v_class || 0) + (row.fleet_suv || 0);
    return `${total} vehicles`;
  }
  
  const miles = row.distance_miles ? `${Math.round(row.distance_miles)} mi` : '';
  const hours = row.duration_min ? `${Math.floor(row.duration_min / 60)}h ${row.duration_min % 60}m` : '';
  
  if (miles && hours) return `${miles} • ${hours}`;
  return miles || hours || 'N/A';
};

/**
 * Get vehicle display name from model code
 */
export const getVehicleDisplay = (row: BookingListItem): string => {
  const vehicleMap: Record<string, string> = {
    'exec_5_series': 'BMW 5 Series',
    'exec_e_class': 'Mercedes E-Class',
    'lux_s_class': 'Mercedes S-Class',
    'lux_7_series': 'BMW 7 Series',
    'suv_range_rover': 'Range Rover',
    'van_v_class': 'Mercedes V-Class',
  };
  
  return row.vehicle_model ? vehicleMap[row.vehicle_model] || row.vehicle_model : 'Any Vehicle';
};

/**
 * Get trip type icon
 */
export const getTripTypeIcon = (type: string): string => {
  switch (type) {
    case 'oneway': return '🚗';
    case 'return': return '⟲';
    case 'hourly': return '⏱️';
    case 'fleet': return '🚙';
    default: return '📍';
  }
};

/**
 * Calculate fleet total vehicles
 */
export const calculateFleetTotal = (row: BookingListItem): number => {
  return (row.fleet_executive || 0) + 
         (row.fleet_s_class || 0) + 
         (row.fleet_v_class || 0) + 
         (row.fleet_suv || 0);
};
