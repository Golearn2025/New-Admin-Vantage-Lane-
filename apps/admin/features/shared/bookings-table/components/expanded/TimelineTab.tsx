/**
 * TimelineTab Component
 * 
 * Displays booking timeline/audit log with status changes.
 * Shows chronological events from creation to completion.
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */

'use client';

import React from 'react';
import type { BookingListItem } from '@vantage-lane/contracts';
import styles from './TimelineTab.module.css';

interface TimelineTabProps {
  booking: BookingListItem;
}

interface TimelineEvent {
  timestamp: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export function TimelineTab({ booking }: TimelineTabProps) {
  const events: TimelineEvent[] = [];

  // Created
  if (booking.created_at) {
    events.push({
      timestamp: booking.created_at,
      icon: '📝',
      title: 'Booking Created',
      description: `Source: ${booking.source.toUpperCase()}`,
    });
  }

  // Payment
  if (booking.payment_status === 'captured') {
    events.push({
      timestamp: booking.created_at, // Approximate
      icon: '💳',
      title: 'Payment Captured',
      description: `£${booking.fare_amount.toFixed(2)} via ${booking.payment_method}`,
    });
  }

  // Assignment
  if (booking.assigned_at && booking.driver_name) {
    events.push({
      timestamp: booking.assigned_at,
      icon: '<UserCheck size={18} strokeWidth={2} />',
      title: 'Driver Assigned',
      description: `${booking.driver_name}${booking.assigned_by_name ? ` by ${booking.assigned_by_name}` : ''}`,
    });
  }

  // Status-based events
  const statusEvents: Record<string, { icon: React.ReactNode; title: string }> = {
    'en_route': { icon: '<Car size={18} strokeWidth={2} />', title: 'Driver En Route' },
    'arrived': { icon: '<MapPin size={18} strokeWidth={2} />', title: 'Driver Arrived' },
    'in_progress': { icon: '<RefreshCw size={18} strokeWidth={2} />', title: 'Trip Started' },
    'completed': { icon: '<CheckCircle size={18} strokeWidth={2} />', title: 'Trip Completed' },
    'cancelled': { icon: '<XCircle size={18} strokeWidth={2} />', title: 'Booking Cancelled' },
  };

  if (booking.status in statusEvents) {
    const statusEvent = statusEvents[booking.status];
    if (statusEvent) {
      events.push({
        timestamp: booking.created_at, // Approximate
        icon: statusEvent.icon,
        title: statusEvent.title,
      });
    }
  }

  // Sort by timestamp
  events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (events.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📅</span>
          <p className={styles.emptyText}>No timeline events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        {events.map((event, index) => (
          <div key={index} className={styles.event}>
            <div className={styles.eventIcon}>{event.icon}</div>
            
            <div className={styles.eventContent}>
              <div className={styles.eventHeader}>
                <span className={styles.eventTitle}>{event.title}</span>
                <span className={styles.eventTime}>
                  {getRelativeTime(event.timestamp)}
                </span>
              </div>
              
              {event.description && (
                <p className={styles.eventDescription}>{event.description}</p>
              )}
              
              <span className={styles.eventTimestamp}>
                {formatTimestamp(event.timestamp)}
              </span>
            </div>

            {index < events.length - 1 && <div className={styles.eventLine} />}
          </div>
        ))}
      </div>
    </div>
  );
}
