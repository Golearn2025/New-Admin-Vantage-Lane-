/**
 * Topbar Component - Application Header
 * 
 * Header cu logo, search, user menu și mobile burger.
 * A11y compliant cu skip link și keyboard navigation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@admin/shared/ui/icons';
import { BrandName } from '@admin/shared/ui/composed/BrandName';
import { signOutAction } from '@admin/shared/api/auth/actions';
import { TopbarProps } from './types';
import styles from './Topbar.module.css';

export function Topbar({
  role,
  onMenuToggle,
  searchPlaceholder = "Search..."
}: TopbarProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUserMenuToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleUserMenuClose = () => {
    setIsUserDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);
  
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
        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            className={styles.userButton}
            aria-label="User menu"
            aria-expanded={isUserDropdownOpen}
            onClick={handleUserMenuToggle}
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
              className={`${styles.userChevron} ${isUserDropdownOpen ? styles.chevronOpen : ''}`}
              aria-hidden="true"
            />
          </button>
          
          {/* User dropdown - REUTILIZABIL */}
          {isUserDropdownOpen && (
            <div className={styles.userDropdown} role="menu" aria-hidden="false">
              <a 
                href="/settings/profile" 
                className={styles.dropdownItem} 
                role="menuitem"
                onClick={handleUserMenuClose}
              >
                Profile Settings
              </a>
              <form action={signOutAction} style={{ margin: 0 }}>
                <button 
                  type="submit"
                  className={styles.dropdownItem} 
                  role="menuitem"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
