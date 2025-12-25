/**
 * Driver Location Entity - Public API
 * 
 * Centralized exports for driver location tracking functionality
 */

// Types
export type {
  DriverOnlineStatus,
  LocationCoordinates,
  DriverLocationData,
  UpdateLocationPayload,
  UpdateStatusPayload,
  OnlineDriversResponse,
  MapFilters,
  DriverLocationUpdate
} from './model/types';

export {
  DriverOnlineStatusSchema,
  LocationCoordinatesSchema,
  UpdateLocationPayloadSchema,
  UpdateStatusPayloadSchema,
  MapFiltersSchema,
  OnlineDriversQuerySchema
} from './model/schema';

// API Functions
export { getOnlineDrivers } from './api/getOnlineDrivers';
export { updateDriverLocation, updateDriverStatus } from './api/updateDriverLocation';
