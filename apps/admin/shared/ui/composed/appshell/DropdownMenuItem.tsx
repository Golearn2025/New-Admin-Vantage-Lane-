/**
 * DropdownMenuItem Component
 *
 * Reusable dropdown menu item for user actions.
 * Presentational component - handles link/action rendering.
 * Performance optimized - extracted from inline map function.
 */

'use client';

import styles from './UserDropdown.module.css';

export interface DropdownMenuItemProps {
  item: {
    id: string;
    type: 'link' | 'action';
    href?: string;
    label: string;
    icon: React.ReactNode;
  };
  handleLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  handleLogout: () => void;
  isLoggingOut: boolean;
}

export function DropdownMenuItem({ 
  item, 
  handleLinkClick, 
  handleLogout, 
  isLoggingOut 
}: DropdownMenuItemProps) {
  if (item.type === 'link') {
    return (
      <a
        href={item.href}
        data-id={item.id}
        className={styles.dropdownItem}
        role="menuitem"
        onClick={handleLinkClick}
        aria-label={item.label}
      >
        {item.icon}
        <span>{item.label}</span>
      </a>
    );
  }

  if (item.type === 'action') {
    return (
      <button
        type="button"
        data-id={item.id}
        className={styles.dropdownItem}
        role="menuitem"
        aria-label={item.label}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {item.icon}
        <span>{isLoggingOut ? 'Logging out...' : item.label}</span>
      </button>
    );
  }

  return null;
}
