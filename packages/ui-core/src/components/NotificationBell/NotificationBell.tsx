/**
 * Notification Bell Component
 * Reusable notification bell with badge and dropdown
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Archive, Settings, Trash, RotateCcw, CheckCircle, MoreHorizontal } from 'lucide-react';
import { NotificationIcon, getNotificationColor } from './NotificationIcon';
import { NotificationActions } from '../../NotificationActions';
import { Button } from '../../Button';
import { ActionMenu } from '../../ActionMenu';
import styles from './NotificationBell.module.css';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: string;
  link?: string;
}

export interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onViewAll: () => void;
  onMarkAllRead: () => void;
  
  // Individual action callbacks
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  
  // Enterprise action callbacks
  onMarkAllUnread?: () => void;
  onArchiveAll?: () => void;
  onClearAll?: () => void;
  onViewArchived?: () => void;
  onSettings?: () => void;
  
  // Action states
  loadingActions?: boolean;
  loadingAction?: { id: string; action: 'read' | 'unread' | 'delete' };
}

export function NotificationBell({
  notifications,
  unreadCount,
  onNotificationClick,
  onViewAll,
  onMarkAllRead,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onMarkAllUnread,
  onArchiveAll,
  onClearAll,
  onViewArchived,
  onSettings,
  loadingActions = false,
  loadingAction,
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
        <div className={styles.bellContainer}>
          <Bell size={24} strokeWidth={2} />
        </div>
        {unreadCount > 0 && (
          <span className={styles.badgeContainer}>
            <span className={styles.badgePing} />
            <span className={styles.badge}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Notifications</h3>
            
            {/* Enterprise Actions Menu */}
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onMarkAllRead}
                  className={styles.quickAction}
                >
                  <CheckCircle size={14} />
                  Mark all read
                </Button>
              )}
              
              <ActionMenu
                trigger={
                  <Button variant="ghost" size="sm" className={styles.menuTrigger}>
                    <MoreHorizontal size={16} />
                  </Button>
                }
                position="bottom-right"
                items={[
                  ...(onMarkAllUnread ? [{
                    icon: <RotateCcw size={14} />,
                    label: 'Mark all unread',
                    onClick: onMarkAllUnread
                  }] : []),
                  
                  ...(onArchiveAll || onClearAll ? [{ separator: true }] : []),
                  
                  ...(onArchiveAll ? [{
                    icon: <Archive size={14} />,
                    label: 'Archive all',
                    onClick: onArchiveAll
                  }] : []),
                  
                  ...(onClearAll ? [{
                    icon: <Trash size={14} />,
                    label: 'Clear all',
                    onClick: onClearAll,
                    variant: 'danger' as const
                  }] : []),
                  
                  ...(onViewArchived || onSettings ? [{ separator: true }] : []),
                  
                  ...(onViewArchived ? [{
                    icon: <Archive size={14} />,
                    label: 'View archived',
                    onClick: onViewArchived
                  }] : []),
                  
                  ...(onSettings ? [{
                    icon: <Settings size={14} />,
                    label: 'Settings',
                    onClick: onSettings
                  }] : []),
                ].filter(item => item !== undefined)}
              />
            </div>
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>No notifications</div>
            ) : (
              notifications.slice(0, 5).map((notification) => {
                const colorType = getNotificationColor(notification.type || 'default');
                const isCurrentLoading = loadingAction?.id === notification.id;
                const currentAction = isCurrentLoading ? loadingAction.action : undefined;
                
                return (
                  <div
                    key={notification.id}
                    className={`${styles.item} ${!notification.read ? styles.unread : ''} ${styles[`item${colorType.charAt(0).toUpperCase() + colorType.slice(1)}`] || ''}`}
                  >
                    <button
                      className={styles.itemContent}
                      onClick={() => onNotificationClick(notification)}
                      disabled={loadingActions}
                    >
                      <div className={`${styles.iconContainer} ${styles[`iconContainer${colorType.charAt(0).toUpperCase() + colorType.slice(1)}`] || ''}`}>
                        <NotificationIcon 
                          type={notification.type || 'default'} 
                          size={16}
                          className={`${styles.notificationIcon} ${styles[`icon${colorType.charAt(0).toUpperCase() + colorType.slice(1)}`] || ''}`}
                        />
                        {!notification.read && <span className={styles.unreadIndicator} />}
                      </div>
                      <div className={styles.content}>
                        <p className={styles.notifTitle}>{notification.title}</p>
                        <p className={styles.message}>{notification.message}</p>
                        <p className={styles.time}>{formatTime(notification.createdAt)}</p>
                      </div>
                    </button>
                    
                    {/* Notification Actions */}
                    {(onMarkRead || onMarkUnread || onDelete) && (
                      <div className={styles.actions}>
                        <NotificationActions
                          notification={{
                            id: notification.id,
                            read: notification.read,
                            title: notification.title,
                          }}
                          {...(onMarkRead && { onMarkRead })}
                          {...(onMarkUnread && { onMarkUnread })}
                          {...(onDelete && { onDelete })}
                          compact={true}
                          showLabels={false}
                          showConfirm={true}
                          loading={isCurrentLoading && loadingActions}
                          {...(currentAction && { loadingAction: currentAction })}
                        />
                      </div>
                    )}
                  </div>
                );
              })
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
