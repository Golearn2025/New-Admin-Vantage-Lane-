/**
 * UserDropdown Component
 *
 * Reusable dropdown menu for user actions (Profile, Settings, Logout).
 * Presentational component - ZERO business logic.
 * All logic in useUserDropdown hook.
 */

'use client';

import { useUserDropdown } from './hooks/useUserDropdown';
import styles from './UserDropdown.module.css';

export interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export function UserDropdown({ isOpen, onClose, onNavigate }: UserDropdownProps) {
  const { menuItems, handleLinkClick, handleLogout, isLoggingOut } = useUserDropdown({
    onClose,
    ...(onNavigate && { onNavigate }),
  });

  if (!isOpen) return null;

  return (
    <div className={styles.dropdown} role="menu" aria-label="User menu">
      {menuItems.map((item) => {
        if (item.type === 'link') {
          return (
            <a
              key={item.id}
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
              key={item.id}
              type="button"
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
      })}
    </div>
  );
}
