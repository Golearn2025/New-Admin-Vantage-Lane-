/**
 * Driver Location Entity - Zod Validation Schemas
 * 
 * Type-safe validation for location tracking APIs
 */

import { z } from 'zod';

/**
 * Online status validation
 */
export const DriverOnlineStatusSchema = z.enum(['offline', 'online', 'busy', 'break']);

/**
 * Location coordinates validation
 */
export const LocationCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10000).optional(), // 0-10km accuracy
  timestamp: z.string().datetime().optional(),
});

/**
 * Mobile app location update validation
 */
export const UpdateLocationPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10000).optional(),
  speed: z.number().min(0).max(300).optional(), // 0-300 km/h
  heading: z.number().min(0).max(360).optional(), // 0-360 degrees
});

/**
 * Mobile app status update validation
 */
export const UpdateStatusPayloadSchema = z.object({
  status: DriverOnlineStatusSchema,
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  accuracy: z.number().min(0).max(10000).optional(),
});

/**
 * Map filters validation
 */
export const MapFiltersSchema = z.object({
  showOnline: z.boolean().default(true),
  showBusy: z.boolean().default(true),
  organizationId: z.string().uuid().optional(),
});

/**
 * Query parameters for online drivers endpoint
 */
export const OnlineDriversQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  includeOffline: z.boolean().default(false),
  limit: z.number().min(1).max(100).default(50),
});

// Type exports for runtime use
export type UpdateLocationPayload = z.infer<typeof UpdateLocationPayloadSchema>;
export type UpdateStatusPayload = z.infer<typeof UpdateStatusPayloadSchema>;
export type MapFilters = z.infer<typeof MapFiltersSchema>;
export type OnlineDriversQuery = z.infer<typeof OnlineDriversQuerySchema>;
