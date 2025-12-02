/**
 * UserDropdown Component
 *
 * Reusable dropdown menu for user actions (Profile, Settings, Logout).
 * Presentational component - ZERO business logic.
 * All logic in useUserDropdown hook.
 */

'use client';

import { useUserDropdown } from './hooks/useUserDropdown';
import { DropdownMenuItem } from './DropdownMenuItem';
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
      {menuItems.map((item) => (
        <DropdownMenuItem
          key={item.id}
          item={item}
          handleLinkClick={handleLinkClick}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      ))}
    </div>
  );
}
