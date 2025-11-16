/**
 * NotificationIcon Component
 * Maps notification types to professional Lucide React icons
 */

import React from 'react';
import {
  Bell,
  MapPin,
  XCircle,
  UserPlus,
  Upload,
  MessageSquare,
  CreditCard,
  AlertCircle,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  Building,
  Settings,
  Radio,
  Clock,
  UserCheck,
  FileUp,
} from 'lucide-react';

export type NotificationType = 
  | 'booking_created'
  | 'booking_cancelled'
  | 'booking_assigned'
  | 'driver_created'
  | 'driver_assigned'
  | 'driver_registered'
  | 'account_approved'
  | 'document_uploaded'
  | 'document_approved'
  | 'document_expiring'
  | 'driver_document_expiring'
  | 'operator_created'
  | 'admin_message'
  | 'payment_received'
  | 'payment_failed'
  | 'system'
  | 'test_realtime'
  | 'default';

interface NotificationIconProps {
  type: NotificationType | string;
  size?: number;
  className?: string | undefined;
}

const ICON_MAP: Record<NotificationType, React.ComponentType<any>> = {
  // Booking related
  'booking_created': MapPin,
  'booking_cancelled': XCircle,
  'booking_assigned': UserCheck,
  
  // Driver related
  'driver_created': UserPlus,
  'driver_assigned': UserCheck,
  'driver_registered': UserPlus,
  'account_approved': CheckCircle,
  
  // Document related
  'document_uploaded': Upload,
  'document_approved': FileCheck,
  'document_expiring': AlertTriangle,
  'driver_document_expiring': AlertTriangle,
  
  // Operator related
  'operator_created': Building,
  
  // Messages
  'admin_message': MessageSquare,
  
  // Payment related
  'payment_received': CreditCard,
  'payment_failed': AlertCircle,
  
  // System
  'system': Settings,
  'test_realtime': Radio,
  'default': Bell,
};

// Color mapping for notification types
const COLOR_MAP: Record<NotificationType, string> = {
  // Booking related - Blue
  'booking_created': 'primary',
  'booking_cancelled': 'danger',
  'booking_assigned': 'primary',
  
  // Driver related - Orange/Warning
  'driver_created': 'warning',
  'driver_assigned': 'warning',
  'driver_registered': 'warning',
  'account_approved': 'success',
  
  // Document related - Info/Success
  'document_uploaded': 'info',
  'document_approved': 'success',
  'document_expiring': 'warning',
  'driver_document_expiring': 'warning',
  
  // Operator related - Purple
  'operator_created': 'info',
  
  // Messages - Gray
  'admin_message': 'secondary',
  
  // Payment related - Green/Red
  'payment_received': 'success',
  'payment_failed': 'danger',
  
  // System - Gray
  'system': 'secondary',
  'test_realtime': 'secondary',
  'default': 'primary',
};

export function NotificationIcon({ type, size = 16, className = '' }: NotificationIconProps) {
  const IconComponent = ICON_MAP[type as NotificationType] || ICON_MAP.default;
  
  return (
    <IconComponent 
      size={size} 
      className={className}
      strokeWidth={2}
    />
  );
}

export function getNotificationColor(type: string): string {
  return COLOR_MAP[type as NotificationType] || COLOR_MAP.default;
}
