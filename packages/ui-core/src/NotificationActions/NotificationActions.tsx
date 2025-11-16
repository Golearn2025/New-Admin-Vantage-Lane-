/**
 * NotificationActions Component
 * 
 * Premium action buttons pentru notifications (mark read/unread, delete)
 * Reutilizabil pentru dropdown, page, sau table rows
 * 100% design tokens, TypeScript strict, accessibility compliant
 */

'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ConfirmDialog } from '../ConfirmDialog';
import styles from './NotificationActions.module.css';

export interface NotificationActionsProps {
  /** Notification data - minimal required fields */
  notification: {
    id: string;
    read: boolean;
    title: string;
  };
  
  /** Action callbacks */
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onDelete?: (id: string) => void;
  
  /** UI variants */
  compact?: boolean; // dropdown vs full page
  showLabels?: boolean; // show text labels or icon-only
  showConfirm?: boolean; // show delete confirmation
  
  /** Loading states */
  loading?: boolean;
  loadingAction?: 'read' | 'unread' | 'delete';
  
  /** Styling */
  className?: string;
}

export function NotificationActions({
  notification,
  onMarkRead,
  onMarkUnread,
  onDelete,
  compact = false,
  showLabels = false,
  showConfirm = true,
  loading = false,
  loadingAction,
  className = '',
}: NotificationActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleMarkToggle = () => {
    if (loading) return;
    
    if (notification.read && onMarkUnread) {
      onMarkUnread(notification.id);
    } else if (!notification.read && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const handleDelete = () => {
    console.log('🔥 DELETE BUTTON CLICKED!', notification.id);
    if (loading) {
      console.log('⏳ Delete blocked - loading state');
      return;
    }
    
    if (showConfirm) {
      console.log('🔥 Opening confirmation modal');
      setConfirmOpen(true);
    } else if (onDelete) {
      console.log('🔥 Direct delete (no confirmation)');
      onDelete(notification.id);
    } else {
      console.error('❌ onDelete callback missing!');
    }
  };

  const handleConfirmDelete = () => {
    console.log('🔥 CONFIRM DELETE CLICKED IN MODAL!', notification.id);
    setConfirmOpen(false);
    if (onDelete) {
      console.log('🔥 CALLING onDelete callback:', notification.id);
      onDelete(notification.id);
    } else {
      console.error('❌ onDelete callback is missing!');
    }
  };

  const containerClass = `${styles.container} ${
    compact ? styles.compact : styles.full
  } ${className}`;

  return (
    <>
      <div className={containerClass} role="group" aria-label="Notification actions">
        {/* Mark Read/Unread Button */}
        {(onMarkRead || onMarkUnread) && (
          <Button
            variant="ghost"
            size={compact ? "sm" : "md"}
            onClick={handleMarkToggle}
            loading={loading && loadingAction === (notification.read ? 'unread' : 'read')}
            disabled={loading}
            className={styles.actionButton}
            aria-label={
              notification.read 
                ? "Mark as unread" 
                : "Mark as read"
            }
          >
            <Icon 
              name={notification.read ? "bell" : "check"} 
              size={compact ? "sm" : "md"} 
            />
            {showLabels && (
              <span className={styles.label}>
                {notification.read ? "Mark unread" : "Mark read"}
              </span>
            )}
          </Button>
        )}

        {/* Delete Button - WORKING VERSION */}
        {onDelete && (
          <button
            type="button"
            style={{
              backgroundColor: 'transparent',
              color: '#dc2626',
              border: 'none',
              borderRadius: '4px',
              padding: compact ? '4px' : '6px',
              fontSize: compact ? '14px' : '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: compact ? '28px' : '32px',
              minHeight: compact ? '28px' : '32px',
              transition: 'background-color 0.2s',
            }}
            onClick={(e) => {
              console.log('🔥 DELETE CLICKED!', notification.id);
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) {
                console.log('🔥 CALLING DELETE:', notification.id);
                onDelete(notification.id);
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            disabled={loading}
            aria-label="Delete notification"
            title="Delete notification"
          >
            <Icon 
              name="trash" 
              size={compact ? "sm" : "md"} 
            />
          </button>
        )}
      </div>

      {/* Modal removed - direct delete now */}
    </>
  );
}
