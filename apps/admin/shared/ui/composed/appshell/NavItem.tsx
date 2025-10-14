/**
 * NavItem Component - Individual Navigation Item
 * 
 * Item de navigație reutilizabil cu icon, badge, children support.
 * A11y compliant cu aria-current și keyboard navigation.
 */

import React from 'react';
import { Icon } from '@admin/shared/ui/icons';
import { NavItemProps } from './types';
import styles from './NavItem.module.css';

export function NavItem({
  href,
  icon,
  label,
  badgeCount,
  isActive = false,
  hasChildren = false,
  isExpanded = false,
  children,
  onNavigate,
  variant = 'minimal'
}: NavItemProps) {
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const navItemClasses = [
    styles.navItem,
    styles[variant],
    isActive ? styles.active : '',
    hasChildren ? styles.hasChildren : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.navItemWrapper}>
      <a
        href={href}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={navItemClasses}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        role="menuitem"
        tabIndex={0}
      >
        <div className={styles.navItemContent}>
          <Icon 
            name={icon} 
            size={20} 
            className={styles.navIcon}
            aria-label={`${label} icon`}
          />
          
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
      {hasChildren && children && isExpanded && (
        <div className={styles.submenu} role="menu">
          {children.map((childPath) => (
            <a
              key={childPath}
              href={childPath}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(childPath);
              }}
              className={styles.submenuItem}
              role="menuitem"
              tabIndex={0}
            >
              {getPathLabel(childPath)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Helper pentru a obține label-ul din path
 */
function getPathLabel(path: string): string {
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  
  if (!lastSegment) {
    return 'Home';
  }
  
  // Transformă path-ul în label readable
  return lastSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
