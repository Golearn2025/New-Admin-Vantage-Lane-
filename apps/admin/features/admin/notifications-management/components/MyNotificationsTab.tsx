'use client';

import { CheckCircle, Inbox, Bell, Trash, RotateCcw } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

/**
 * My Notifications Tab
 * Enhanced with bulk operations and individual notification actions
 * Premium UX with selection, delete, mark read/unread functionality
 */
import { useNotificationsContext } from '@admin-shared/providers/NotificationsProvider';
import { Button, Input, NotificationActions, Checkbox } from '@vantage-lane/ui-core';
import { useBulkNotifications } from '../hooks/useBulkNotifications';
import { formatNotificationDate } from '@admin-shared/utils/formatDate';
import styles from './MyNotificationsTab.module.css';

interface MyNotificationsTabProps {
  highlightId?: string | null;
}

export function MyNotificationsTab({ highlightId }: MyNotificationsTabProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificationsContext();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');
  const highlightRef = useRef<HTMLDivElement>(null);
  
  // Bulk operations hook
  const bulk = useBulkNotifications();

  // Scroll to highlighted notification
  useEffect(() => {
    if (highlightId && highlightRef.current) {
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [highlightId, notifications]);

  const filteredNotifications = notifications
    .filter((n) => {
      if (filter === 'unread') return !n.read;
      if (filter === 'read') return n.read;
      return true;
    })
    .filter((n) => {
      if (!search) return true;
      return (
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase())
      );
    });

  // Computed values from hook
  const isAllSelected = bulk.isAllSelected(filteredNotifications);
  const isSomeSelected = bulk.isSomeSelected;

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Inbox size={18} strokeWidth={2} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total</p>
            <p className={styles.statValue}>{notifications.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Bell size={18} strokeWidth={2} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Unread</p>
            <p className={styles.statValue}>{unreadCount}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><CheckCircle size={18} strokeWidth={2} /></div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Read</p>
            <p className={styles.statValue}>{notifications.length - unreadCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'read' ? styles.active : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        <div className={styles.actions}>
          <Input
            type="search"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {unreadCount > 0 && !isSomeSelected && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {isSomeSelected && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            <span className={styles.selectedCount}>
              {bulk.selectedCount} notification{bulk.selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className={styles.bulkButtons}>
            <Button 
              variant="secondary" 
              onClick={bulk.handleBulkMarkRead}
              loading={bulk.loading}
              disabled={bulk.loading}
            >
              <CheckCircle size={16} />
              Mark Read
            </Button>
            <Button 
              variant="secondary" 
              onClick={bulk.handleBulkMarkUnread}
              loading={bulk.loading}
              disabled={bulk.loading}
            >
              <RotateCcw size={16} />
              Mark Unread
            </Button>
            <Button 
              variant="danger" 
              onClick={bulk.handleBulkDelete}
              loading={bulk.loading}
              disabled={bulk.loading}
            >
              <Trash size={16} />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Selection Header */}
      {filteredNotifications.length > 0 && (
        <div className={styles.selectionHeader}>
          <Checkbox
            checked={isAllSelected}
            indeterminate={isSomeSelected && !isAllSelected}
            onChange={() => bulk.handleSelectAll(filteredNotifications)}
            disabled={bulk.loading}
          />
          <span className={styles.selectionLabel}>
            {isAllSelected ? 'Deselect all' : 'Select all'}
          </span>
        </div>
      )}

      {/* Notifications List */}
      <div className={styles.list}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.empty}>
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const isSelected = bulk.selectedIds.has(notification.id);
            const isCurrentLoading = bulk.loadingAction?.id === notification.id;
            const currentAction = isCurrentLoading ? bulk.loadingAction?.action : undefined;
            
            const isHighlighted = highlightId === notification.id;

            return (
              <div
                key={notification.id}
                ref={isHighlighted ? highlightRef : null}
                className={`${styles.item} ${!notification.read ? styles.unread : ''} ${isSelected ? styles.selected : ''} ${isHighlighted ? styles.highlighted : ''}`}
              >
                <div className={styles.itemSelector}>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => bulk.handleSelectNotification(notification.id)}
                    disabled={bulk.loading}
                  />
                </div>
                
                <div 
                  className={styles.itemContent}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemTitle}>{notification.title}</h3>
                    <span className={styles.itemTime}>
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className={styles.itemMessage}>{notification.message}</p>
                  {!notification.read && <span className={styles.unreadDot} />}
                </div>

                <div className={styles.itemActions}>
                  <NotificationActions
                    notification={{
                      id: notification.id,
                      read: notification.read,
                      title: notification.title,
                    }}
                    onMarkRead={markAsRead}
                    onMarkUnread={bulk.handleMarkUnread}
                    onDelete={deleteNotification}
                    compact={false}
                    showLabels={true}
                    showConfirm={true}
                    loading={isCurrentLoading && !bulk.loading}
                    {...(currentAction && { loadingAction: currentAction })}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
