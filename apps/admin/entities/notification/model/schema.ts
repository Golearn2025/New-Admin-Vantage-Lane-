/**
 * Notification Schema
 * Zod validation schemas for notifications
 */

import { z } from 'zod';

/**
 * Notification schema for validation
 */
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum([
    'driver_registered',
    'docs_uploaded',
    'driver_verified',
    'driver_activated',
    'driver_rejected',
    'booking_created',
    'booking_updated',
    'payment_received',
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  link: z.string().url().optional().nullable(),
  read: z.boolean().default(false),
  createdAt: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;
