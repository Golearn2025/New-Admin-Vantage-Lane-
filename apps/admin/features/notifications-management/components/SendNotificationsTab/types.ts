/**
 * Send Notifications Tab - Shared Types
 * Type definitions for notification sending
 */

export type { SelectOption } from '@vantage-lane/ui-core';

export type TargetType = 
  | 'all-admins' 
  | 'all-operators' 
  | 'all-drivers' 
  | 'all-customers' 
  | 'individual-driver' 
  | 'individual-operator';

export interface NotificationFormData {
  title: string;
  message: string;
  link: string;
}

export interface UserOption {
  id: string;
  name: string;
}

export interface SendResult {
  success: boolean;
  count?: number;
}
