/**
 * Notification Types
 */

export type NotificationType =
  // Driver related
  | 'driver_registered'
  | 'driver_created'
  | 'driver_verified'
  | 'driver_activated'
  | 'driver_rejected'
  | 'driver_assigned'
  | 'docs_uploaded'
  | 'account_approved'
  // Booking related
  | 'booking_created'
  | 'booking_cancelled'
  | 'booking_assigned'
  | 'booking_updated'
  // Document related
  | 'document_uploaded'
  | 'document_approved'
  | 'document_expiring'
  | 'driver_document_expiring'
  // Operator related
  | 'operator_created'
  // Messages
  | 'admin_message'
  // Payment related
  | 'payment_received'
  | 'payment_failed'
  // System
  | 'system'
  | 'test_realtime';

export interface NotificationData {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
  targetType?: string;
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

export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  errors?: string[];
}
