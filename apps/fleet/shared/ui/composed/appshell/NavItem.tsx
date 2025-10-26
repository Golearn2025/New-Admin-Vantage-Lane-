/**
 * NavItem Component - Fleet Portal
 */

import React from 'react';
import { Icon, IconName } from '@vantage-lane/ui-icons';
import styles from './NavItem.module.css';

interface NavItemProps {
  href: string;
  icon: IconName;
  label: string;
  badgeCount?: number;
  isActive?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  subpages?: string[];
  onNavigate: (href: string) => void;
  onToggleExpand?: (href: string) => void;
}

export function NavItem({
  href,
  icon,
  label,
  badgeCount,
  isActive = false,
  hasChildren = false,
  isExpanded = false,
  subpages,
  onNavigate,
  onToggleExpand,
}: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasChildren && onToggleExpand) {
      onToggleExpand(href);
    } else {
      onNavigate(href);
    }
  };

  return (
    <div className={styles.navItemWrapper}>
      <a
        href={href}
        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        role="menuitem"
      >
        <div className={styles.navItemContent}>
          <Icon name={icon} size={20} className={styles.navIcon} />
          <span className={styles.navLabel}>{label}</span>
          {badgeCount && badgeCount > 0 && (
            <span className={styles.badge}>{badgeCount > 99 ? '99+' : badgeCount}</span>
          )}
        </div>
      </a>
    </div>
  );
}
