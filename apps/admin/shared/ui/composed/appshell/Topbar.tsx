/**
 * Topbar Component - Application Header
 *
 * Presentational component - ZERO business logic.
 * All logic in useTopbarActions and useUserInitials hooks.
 */

'use client';

import { NotificationBell, type Notification } from '@vantage-lane/ui-core';
import { useNotificationsContext } from '@admin-shared/providers/NotificationsProvider';
import { useRouter } from 'next/navigation';
import { BrandName } from '@admin-shared/ui/composed/BrandName';
import { Icon } from '@vantage-lane/ui-icons';
import Image from 'next/image';
import { useMemo } from 'react';
import { useTopbarActions, useUserInitials } from './hooks';
import styles from './Topbar.module.css';
import { TopbarProps } from './types';
import { UserDropdown } from './UserDropdown';

export function Topbar({ role, onMenuToggle, sidebarCollapsed = false, user }: TopbarProps) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    markAsUnread,
    deleteNotification,
  } = useNotificationsContext();
  const router = useRouter();

  // Hooks pentru business logic
  const { isUserDropdownOpen, handleUserMenuToggle, handleUserMenuClose, dropdownRef } =
    useTopbarActions();
  const userInitials = useUserInitials(user?.name || 'U');

  // Navigate to notifications page
  const handleNavigateToNotifications = () => {
    router.push('/notifications');
  };

  // Handle notification click with navigation
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate to specific notification or related page
    if (notification.link) {
      router.push(notification.link);
    } else {
      // Default: Go to notifications page with specific notification highlighted
      router.push(`/notifications?highlight=${notification.id}`);
    }
  };

  // Enterprise action handlers
  const handleMarkAllUnread = () => {
    // Implement mark all unread logic
    console.log('Mark all unread - not implemented yet');
  };

  const handleArchiveAll = () => {
    // Implement archive all logic
    console.log('Archive all - not implemented yet');
  };

  const handleClearAll = () => {
    // Implement clear all logic
    console.log('Clear all - not implemented yet');
  };

  const handleViewArchived = () => {
    router.push('/notifications?view=archived');
  };

  const handleSettings = () => {
    router.push('/settings/notifications');
  };

  const notificationsMapped = useMemo(
    () =>
      notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        read: n.read,
        type: n.type, // ✅ ADĂUGAT: type pentru iconițele specifice
      })),
    [notifications]
  );

  return (
    <header
      className={`${styles.topbar} ${sidebarCollapsed ? styles.topbarCollapsed : ''}`}
      role="banner"
    >
      {/* Skip to content link pentru A11y */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Mobile menu button */}
      <button
        className={styles.menuButton}
        onClick={onMenuToggle}
        aria-label="Toggle navigation menu"
        aria-expanded="false"
        type="button"
      >
        <Icon name="menu" size={24} />
      </button>

      {/* Logo - doar pe mobile când sidebar e hidden */}
      <div className={styles.mobileLogo}>
        <Image
          src="/brand/logo.png"
          alt="Vantage Lane"
          width={36}
          height={36}
          className={styles.logoImage}
          priority
        />
        <BrandName size="md" />
      </div>

      {/* Right section */}
      <div className={styles.rightSection}>
        {/* Notifications */}
        <NotificationBell
          notifications={notificationsMapped}
          unreadCount={unreadCount}
          onNotificationClick={handleNotificationClick}
          onViewAll={handleNavigateToNotifications}
          onMarkAllRead={markAllAsRead}
          onMarkRead={markAsRead}
          onMarkUnread={markAsUnread}
          onDelete={deleteNotification}
          onMarkAllUnread={handleMarkAllUnread}
          onArchiveAll={handleArchiveAll}
          onClearAll={handleClearAll}
          onViewArchived={handleViewArchived}
          onSettings={handleSettings}
        />

        {/* User menu */}
        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            className={styles.userButton}
            aria-label="User menu"
            aria-expanded={isUserDropdownOpen}
            onClick={handleUserMenuToggle}
            type="button"
          >
            <div className={styles.userAvatar}>
              <span className={styles.userInitials}>{userInitials}</span>
            </div>

            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'User'}</span>
              <span className={styles.userRole}>
                {role === 'admin' ? 'Administrator' : 'Operator'}
              </span>
            </div>

            <Icon
              name="chevronDown"
              size={16}
              className={`${styles.userChevron} ${isUserDropdownOpen ? styles.chevronOpen : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* User dropdown component */}
          <UserDropdown isOpen={isUserDropdownOpen} onClose={handleUserMenuClose} />
        </div>
      </div>
    </header>
  );
}
