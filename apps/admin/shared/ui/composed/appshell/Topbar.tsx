/**
 * Topbar Component - Application Header
 * 
 * Header cu logo, search, user menu și mobile burger.
 * A11y compliant cu skip link și keyboard navigation.
 */

import React from 'react';
import { Icon } from '@admin/shared/ui/icons';
import { BrandName } from '@admin/shared/ui/composed/BrandName';
import { TopbarProps } from './types';
import styles from './Topbar.module.css';

export function Topbar({
  role,
  onMenuToggle,
  searchPlaceholder = "Search..."
}: TopbarProps) {
  
  return (
    <header 
      className={styles.topbar}
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
        <img 
          src="/brand/logo.png"
          alt="Vantage Lane"
          className={styles.logoImage}
        />
        <BrandName size="md" />
      </div>
      
      {/* Search */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <Icon 
            name="support" 
            size={20} 
            className={styles.searchIcon}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            aria-label="Search application"
          />
        </div>
      </div>
      
      {/* Right section */}
      <div className={styles.rightSection}>
        {/* Notifications */}
        <button
          className={styles.iconButton}
          aria-label="Notifications"
          type="button"
        >
          <Icon name="support" size={20} />
          <span className={styles.notificationBadge}>3</span>
        </button>
        
        {/* User menu */}
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            aria-label="User menu"
            aria-expanded="false"
            type="button"
          >
            <div className={styles.userAvatar}>
              <span className={styles.userInitials}>JD</span>
            </div>
            
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Doe</span>
              <span className={styles.userRole}>
                {role === 'admin' ? 'Administrator' : 'Operator'}
              </span>
            </div>
            
            <Icon 
              name="chevronDown" 
              size={16} 
              className={styles.userChevron}
              aria-hidden="true"
            />
          </button>
          
          {/* User dropdown - placeholder pentru viitoare implementare */}
          <div className={styles.userDropdown} role="menu" aria-hidden="true">
            <a href="/settings/profile" className={styles.dropdownItem} role="menuitem">
              Profile Settings
            </a>
            <a href="/logout" className={styles.dropdownItem} role="menuitem">
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
