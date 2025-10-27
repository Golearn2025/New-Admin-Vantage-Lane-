/**
 * SidebarNav Component - Driver Portal
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@vantage-lane/ui-icons';
import { BrandName } from '../BrandName';
import { NavItem } from './NavItem';
import { SidebarNavProps } from './types';
import { getMenuForRole, isMenuItemActive } from './menu-config';
import { signOutAction } from '../../../api/auth/actions';
import styles from './SidebarNav.module.css';

export function SidebarNav({
  role,
  currentPath,
  onNavigate,
  collapsible = false,
  onToggleCollapse,
}: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = getMenuForRole(role);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse?.(newState);
  };

  return (
    <nav className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
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
            <span className={styles.brandSubtitle}>Driver Portal</span>
          </div>
        )}
      </div>

      <div className={styles.roleIndicator}>
        <span className={styles.roleLabel}>Driver</span>
        {collapsible && (
          <button onClick={handleToggleCollapse} className={styles.collapseToggle} type="button">
            <Icon name="chevronDown" size={14} />
          </button>
        )}
      </div>

      <div className={styles.menuSection}>
        <div className={styles.menuList}>
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={isMenuItemActive(item, currentPath)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>

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
