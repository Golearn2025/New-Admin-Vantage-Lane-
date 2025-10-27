/**
 * Notification validation helpers
 */

import { NotificationSchema } from '../model/schema';
import type { Notification } from '../model/schema';

export function validateNotification(data: unknown): Notification {
  return NotificationSchema.parse(data);
}

export function isNotification(data: unknown): data is Notification {
  return NotificationSchema.safeParse(data).success;
}
