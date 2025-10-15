/**
 * SidebarNav Component - Role-Based Navigation
 * 
 * Sidebar cu meniu RBAC. Fără business logic, doar UI.
 * Folosește menu-config pentru definițiile de navigație.
 */

import React from 'react';
import { Icon } from '@admin/shared/ui/icons';
import { BrandName } from '@admin/shared/ui/composed/BrandName';
import { NavItem } from './NavItem';
import { SidebarNavProps } from './types';
import { getMenuForRole, isMenuItemActive, isMenuItemExpanded } from './menu-config';
import { signOutAction } from '@admin/shared/api/auth/actions';
import styles from './SidebarNav.module.css';

export function SidebarNav({
  role,
  currentPath,
  onNavigate
}: SidebarNavProps) {
  
  const menuItems = getMenuForRole(role);
  
  return (
    <nav 
      className={styles.sidebar}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <img 
          src="/brand/logo.png"
          alt="Vantage Lane"
          className={styles.logo}
          loading="eager"
        />
        
        <div className={styles.brandInfo}>
          <BrandName size="lg" />
          <span className={styles.brandSubtitle}>Admin Access</span>
        </div>
      </div>
      
      {/* Role indicator */}
      <div className={styles.roleIndicator}>
        <span className={styles.roleLabel}>
          {role === 'admin' ? 'Administrator' : 'Operator'}
        </span>
      </div>
      
      {/* Navigation Menu */}
      <div className={styles.menuSection}>
        <div className={styles.menuList} role="menu">
          {menuItems.map((item) => {
            const isActive = isMenuItemActive(item, currentPath);
            const isExpanded = isMenuItemExpanded(item, currentPath);
            
            return (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                {...(item.badgeCount && { badgeCount: item.badgeCount })}
                isActive={isActive}
                hasChildren={!!item.children}
                isExpanded={isExpanded}
                children={item.children}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      </div>
      
      {/* Sign Out - în josul sidebar-ului */}
      <div className={styles.sidebarFooter}>
        <form action={signOutAction}>
          <button 
            type="submit"
            className={styles.signOutLink}
          >
            <Icon name="settings" size={20} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
