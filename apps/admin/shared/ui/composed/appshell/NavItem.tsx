/**
 * NavItem Component - Individual Navigation Item
 *
 * Item de navigație reutilizabil cu icon, badge, children support.
 * A11y compliant cu aria-current și keyboard navigation.
 */

import React from 'react';
import { Icon } from '@vantage-lane/ui-icons';
import { SubMenuItem } from './SubMenuItem';
import { formatPathToLabel } from './utils/pathFormatting';
import styles from './NavItem.module.css';
import { NavItemProps } from './types';

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

    // If has children și onToggleExpand provided, toggle expand
    if (hasChildren && onToggleExpand) {
      onToggleExpand(href);
    } else {
      // Normal navigation
      onNavigate(href);
    }
  };

  return (
    <div className={styles.navItemWrapper}>
      <a
        href={href}
        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-current={isActive ? 'page' : undefined}
        role="menuitem"
        tabIndex={0}
      >
        <div className={styles.navItemContent}>
          <Icon name={icon} size={20} className={styles.navIcon} aria-label={`${label} icon`} />

          <span className={styles.navLabel}>{label}</span>

          {badgeCount && badgeCount > 0 && (
            <span className={styles.badge} aria-label={`${badgeCount} items`}>
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}

          {hasChildren && (
            <Icon
              name="chevronDown"
              size={16}
              className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
              aria-hidden="true"
            />
          )}
        </div>
      </a>

      {/* Children submenu */}
      {hasChildren && subpages && isExpanded && (
        <div className={styles.submenu} role="menu">
          {subpages.map((childPath: string) => (
            <SubMenuItem
              key={childPath}
              childPath={childPath}
              onNavigate={onNavigate}
              formatPathToLabel={formatPathToLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

