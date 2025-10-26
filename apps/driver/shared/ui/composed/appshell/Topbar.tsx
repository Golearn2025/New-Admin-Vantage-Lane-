/**
 * Topbar Component - Driver Portal
 */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Icon } from '@vantage-lane/ui-icons';
import { BrandName } from '../BrandName';
import { signOutAction } from '../../../api/auth/actions';
import { TopbarProps } from './types';
import styles from './Topbar.module.css';

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter((p) => p.length > 0);
  if (parts.length >= 2) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    if (first && last) {
      return (first.charAt(0) + last.charAt(0)).toUpperCase();
    }
  }
  return name.substring(0, 2).toUpperCase() || 'U';
}

export function Topbar({ role, onMenuToggle, sidebarCollapsed = false, user }: TopbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className={`${styles.topbar} ${sidebarCollapsed ? styles.topbarCollapsed : ''}`}>
      <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
      
      <button className={styles.menuButton} onClick={onMenuToggle} type="button">
        <Icon name="menu" size={24} />
      </button>

      <div className={styles.mobileLogo}>
        <Image src="/brand/logo.png" alt="Vantage Lane" width={36} height={36} priority />
        <BrandName size="md" />
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} type="button">
          <Icon name="support" size={20} />
        </button>

        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            className={styles.userButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            type="button"
          >
            <div className={styles.userAvatar}>
              <span className={styles.userInitials}>{user ? getInitials(user.name) : 'D'}</span>
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Driver'}</span>
              <span className={styles.userRole}>Driver</span>
            </div>
            <Icon name="chevronDown" size={16} className={styles.userChevron} />
          </button>

          {isDropdownOpen && (
            <div className={styles.userDropdown}>
              <a href="/profile" className={styles.dropdownItem}>Profile</a>
              <form action={signOutAction}>
                <button type="submit" className={styles.dropdownItem}>Sign Out</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
