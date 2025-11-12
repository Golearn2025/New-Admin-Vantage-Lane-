/**
 * Notification Bell Component
 * Reusable notification bell with badge and dropdown
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import styles from './NotificationBell.module.css';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (id: string) => void;
  onViewAll: () => void;
  onMarkAllRead: () => void;
}

export function NotificationBell({
  notifications,
  unreadCount,
  onNotificationClick,
  onViewAll,
  onMarkAllRead,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (dateString: string) => {
    try {
      // Handle multiple date formats and invalid dates
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // Handle negative differences (future dates)
      if (diffMs < 0) {
        return 'Just now';
      }
      
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'Invalid Date';
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.bell}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell size={24} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button className={styles.markAllRead} onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>No notifications</div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <button
                  key={notification.id}
                  className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => onNotificationClick(notification.id)}
                >
                  {!notification.read && <span className={styles.dot} />}
                  <div className={styles.content}>
                    <p className={styles.notifTitle}>{notification.title}</p>
                    <p className={styles.message}>{notification.message}</p>
                    <p className={styles.time}>{formatTime(notification.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className={styles.footer}>
              <button className={styles.viewAll} onClick={onViewAll}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
