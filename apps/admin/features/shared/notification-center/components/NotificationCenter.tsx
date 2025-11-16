/**
 * NotificationCenter Component
 * 
 * Bell icon with dropdown for notifications
 * Real-time unread count badge
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationCenter } from '../hooks/useNotificationCenter';
import { formatRelativeTime } from '@admin-shared/utils/formatDate';
import styles from './NotificationCenter.module.css';

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationCenter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return undefined;
  }, [isOpen]);

  const handleNotificationClick = async (id: string, link?: string | null) => {
    await markAsRead(id);
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        className={styles.bellButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <div className={styles.bellContainer}>
          <Bell className={styles.bellIcon} size={20} strokeWidth={2} />
        </div>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className={styles.markAllButton}
                onClick={() => markAllAsRead()}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {loading && (
              <div className={styles.loading}>Loading...</div>
            )}

            {!loading && notifications.length === 0 && (
              <div className={styles.empty}>
                <p>No notifications</p>
              </div>
            )}

            {!loading && notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
                onClick={() => handleNotificationClick(notification.id, notification.link)}
              >
                <div className={styles.itemContent}>
                  <h4 className={styles.itemTitle}>{notification.title}</h4>
                  <p className={styles.itemMessage}>{notification.message}</p>
                  <span className={styles.itemTime}>
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
                {!notification.read && <div className={styles.unreadDot} />}
              </div>
            ))}
          </div>

          {notifications.length > 0 && (
            <div className={styles.footer}>
              <button className={styles.viewAllButton}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

