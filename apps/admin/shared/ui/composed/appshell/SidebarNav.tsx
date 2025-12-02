/**
 * SidebarNav Component - Role-Based Navigation
 *
 * Presentational component - ZERO business logic.
 * All logic in useSidebarNavigation hook.
 */

'use client';

import { signOutAction } from '@admin-shared/api/auth/actions';
import { BrandName } from '@admin-shared/ui/composed/BrandName';
import { Icon } from '@vantage-lane/ui-icons';
import Image from 'next/image';
import { useSidebarNavigation } from './hooks';
import { SidebarNavItem } from './SidebarNavItem';
import styles from './SidebarNav.module.css';
import { SidebarNavProps } from './types';

export function SidebarNav({
  role,
  currentPath,
  onNavigate,
  collapsible = false,
  defaultCollapsed = false,
  expandable = true,
  onToggleCollapse,
  onToggleExpand,
}: SidebarNavProps) {
  const {
    menuItems,
    expandedItems,
    isCollapsed,
    handleToggleExpand,
    handleToggleCollapse,
    isMenuItemActive,
    isMenuItemExpanded,
  } = useSidebarNavigation({
    role,
    currentPath,
    defaultCollapsed,
    expandable,
  });

  const onToggleExpandHandler = (href: string) => {
    handleToggleExpand(href);
    onToggleExpand?.(href, !expandedItems.includes(href));
  };

  const onToggleCollapseHandler = () => {
    handleToggleCollapse();
    onToggleCollapse?.(!isCollapsed);
  };

  return (
    <nav
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <Image
          src="/brand/logo.png"
          alt="Vantage Lane"
          width={48}
          height={48}
          className={styles.logo}
          priority
        />

        {!isCollapsed && (
          <div className={styles.brandInfo}>
            <BrandName size="lg" />
            <span className={styles.brandSubtitle}>Admin Access</span>
          </div>
        )}
      </div>

      {/* Role indicator cu collapse toggle */}
      <div className={styles.roleIndicator}>
        <span className={styles.roleLabel}>
          {role === 'admin' ? 'Administrator' : role === 'driver' ? 'Driver' : 'Operator'}
        </span>

        {collapsible && (
          <button
            onClick={onToggleCollapseHandler}
            className={styles.collapseToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            type="button"
          >
            <Icon name="chevronDown" size={14} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={styles.menuSection}>
        <div className={styles.menuList} role="menu">
          {menuItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              currentPath={currentPath}
              expandable={expandable}
              expandedItems={expandedItems}
              onNavigate={onNavigate}
              onToggleExpandHandler={onToggleExpandHandler}
              isMenuItemActive={isMenuItemActive}
              isMenuItemExpanded={isMenuItemExpanded}
            />
          ))}
        </div>
      </div>

      {/* Sign Out - în josul sidebar-ului */}
      <div className={styles.sidebarFooter}>
        <form action={signOutAction}>
          <button type="submit" className={styles.signOutLink}>
            <Icon name="settings" size={20} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
