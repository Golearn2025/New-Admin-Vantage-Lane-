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
    if (loading) return;
    
    if (showConfirm) {
      setConfirmOpen(true);
    } else if (onDelete) {
      onDelete(notification.id);
    }
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    if (onDelete) {
      onDelete(notification.id);
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

        {/* Delete Button */}
        {onDelete && (
          <Button
            variant="ghost"
            size={compact ? "sm" : "md"}
            onClick={handleDelete}
            loading={loading && loadingAction === 'delete'}
            disabled={loading}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            aria-label="Delete notification"
          >
            <Icon 
              name="trash" 
              size={compact ? "sm" : "md"} 
            />
            {showLabels && (
              <span className={styles.label}>Delete</span>
            )}
          </Button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Notification"
          message={`Are you sure you want to delete "${notification.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          loading={loading && loadingAction === 'delete'}
        />
      )}
    </>
  );
}
