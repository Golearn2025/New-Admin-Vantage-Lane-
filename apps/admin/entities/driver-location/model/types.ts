/**
 * Driver Location Entity - Type Definitions
 * 
 * Handles live driver tracking and location management.
 * Phase 1: Current position only (no historical data)
 */

/**
 * Driver Online Status
 */
export type DriverOnlineStatus = 
  | 'offline'  // Not available for bookings
  | 'online'   // Available and can accept jobs
  | 'busy'     // Currently on a trip
  | 'break';   // On break, not accepting jobs

/**
 * Location coordinates with metadata
 */
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;    // GPS accuracy in meters
  timestamp?: string;   // ISO timestamp
}

/**
 * Driver location data for live map display
 */
export interface DriverLocationData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePhotoUrl: string | null;
  onlineStatus: DriverOnlineStatus;
  currentLatitude: number | null;
  currentLongitude: number | null;
  locationUpdatedAt: string | null;
  locationAccuracy: number | null;
  lastOnlineAt: string | null;
  organizationId: string | null;
  organizationName: string | null;
}

/**
 * Payload for mobile app location update
 */
export interface UpdateLocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;     // km/h (optional for future use)
  heading?: number;   // degrees 0-360 (optional for future use)
}

/**
 * Payload for mobile app status update  
 */
export interface UpdateStatusPayload {
  status: DriverOnlineStatus;
  latitude?: number;  // Include location when going online
  longitude?: number;
  accuracy?: number;
}

/**
 * Response for get online drivers API
 */
export interface OnlineDriversResponse {
  drivers: DriverLocationData[];
  totalCount: number;
  onlineCount: number;
  busyCount: number;
  lastUpdated: string;
}

/**
 * Map filter options
 */
export interface MapFilters {
  showOnline: boolean;
  showBusy: boolean;
  organizationId?: string;  // For operator filtering
}

/**
 * Real-time driver update event
 */
export interface DriverLocationUpdate {
  driverId: string;
  onlineStatus: DriverOnlineStatus;
  currentLatitude: number | null;
  currentLongitude: number | null;
  locationUpdatedAt: string | null;
  lastOnlineAt: string | null;
}
