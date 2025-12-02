'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, Building2, Car, Users, Inbox } from 'lucide-react';

/**
 * Notification History Tab
 * View all sent notifications
 * 
 * Compliant: <200 lines, 100% design tokens, TypeScript strict
 */
import { listSentNotifications, type NotificationData } from '@entities/notification';
import { formatNotificationDate } from '@admin-shared/utils/formatDate';
import styles from './NotificationHistoryTab.module.css';

interface GroupedNotification {
  title: string;
  message: string;
  createdAt: string;
  targetType: string;
  count: number;
}

export function NotificationHistoryTab() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await listSentNotifications(100);
      setNotifications(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.targetType === filter;
  });

  // Group by date and title
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const key = `${notif.title}-${new Date(notif.createdAt).toISOString().split('T')[0]}`;
    if (!acc[key]) {
      acc[key] = {
        title: notif.title,
        message: notif.message,
        createdAt: notif.createdAt,
        targetType: notif.targetType || 'unknown',
        count: 0,
      };
    }
    acc[key]!.count++;
    return acc;
  }, {} as Record<string, GroupedNotification>);

  const groupedArray = Object.values(groupedNotifications).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading history...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{notifications.length}</span>
            <span className={styles.statLabel}>Total Sent</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{groupedArray.length}</span>
            <span className={styles.statLabel}>Unique Messages</span>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <button
            className={filter === 'all' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'admin' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('admin')}
          >
            Admins
          </button>
          <button
            className={filter === 'operator' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('operator')}
          >
            Operators
          </button>
          <button
            className={filter === 'driver' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('driver')}
          >
            Drivers
          </button>
          <button
            className={filter === 'customer' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('customer')}
          >
            Customers
          </button>
        </div>
      </div>

      {/* List */}
      <div className={styles.list}>
        {groupedArray.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}><Inbox size={48} strokeWidth={1.5} /></span>
            <p>No notifications sent yet</p>
          </div>
        ) : (
          groupedArray.map((item, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemBadge}>
                  {item.targetType === 'admin' && <User size={14} />}
                  {item.targetType === 'operator' && <Building2 size={14} />}
                  {item.targetType === 'driver' && <Car size={14} />}
                  {item.targetType === 'customer' && <Users size={14} />}
                  <span>{item.count} {item.targetType}(s)</span>
                </span>
                <span className={styles.itemDate}>
                  {formatNotificationDate(item.createdAt)}
                </span>
              </div>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemMessage}>{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
