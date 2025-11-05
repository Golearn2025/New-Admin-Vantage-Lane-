'use client';

import { CheckCircle, Inbox, Bell } from 'lucide-react';
import React, { useState } from 'react';

/**
 * My Notifications Tab
 * View and manage personal notifications
 */
import { useNotifications } from '@admin-shared/hooks/useNotifications';
import { Button, Input } from '@vantage-lane/ui-core';
import { formatNotificationDate } from '@admin-shared/utils/formatDate';
import styles from './MyNotificationsTab.module.css';

export function MyNotificationsTab() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [search, setSearch] = useState('');

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
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className={styles.list}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.empty}>
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.item} ${!notification.read ? styles.unread : ''}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className={styles.itemHeader}>
                <h3 className={styles.itemTitle}>{notification.title}</h3>
                <span className={styles.itemTime}>{formatNotificationDate(notification.createdAt)}</span>
              </div>
              <p className={styles.itemMessage}>{notification.message}</p>
              {!notification.read && <span className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
