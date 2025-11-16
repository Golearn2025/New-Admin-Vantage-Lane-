/**
 * Topbar Component - Application Header
 *
 * Presentational component - ZERO business logic.
 * All logic in useTopbarActions and useUserInitials hooks.
 */

'use client';

import { useNotificationsContext } from '@admin-shared/providers/NotificationsProvider';
import { BrandName } from '@admin-shared/ui/composed/BrandName';
import { NotificationBell } from '@vantage-lane/ui-core';
import { Icon } from '@vantage-lane/ui-icons';
import Image from 'next/image';
import { useMemo } from 'react';
import { useTopbarActions, useUserInitials } from './hooks';
import styles from './Topbar.module.css';
import { TopbarProps } from './types';
import { UserDropdown } from './UserDropdown';

export function Topbar({ role, onMenuToggle, sidebarCollapsed = false, user }: TopbarProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsContext();
  const {
    isUserDropdownOpen,
    dropdownRef,
    handleUserMenuToggle,
    handleUserMenuClose,
    handleNavigateToNotifications,
  } = useTopbarActions();
  const userInitials = useUserInitials(user?.name);

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
          onNotificationClick={markAsRead}
          onViewAll={handleNavigateToNotifications}
          onMarkAllRead={markAllAsRead}
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
