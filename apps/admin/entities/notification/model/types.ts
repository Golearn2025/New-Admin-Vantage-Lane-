/**
 * Notification Types
 */

export type NotificationType =
  | 'driver_registered'
  | 'docs_uploaded'
  | 'driver_verified'
  | 'driver_activated'
  | 'driver_rejected'
  | 'driver_assigned'
  | 'booking_created'
  | 'booking_updated'
  | 'payment_received';

export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

export interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export interface UpdateNotificationPayload {
  read?: boolean;
}
