/**
 * Notification Types - Driver
 */

export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
