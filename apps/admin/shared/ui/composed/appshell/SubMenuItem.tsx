/**
 * SubMenuItem Component
 *
 * Individual submenu item for NavItem children.
 * Performance optimized - extracted from inline map function.
 */

'use client';

import styles from './NavItem.module.css';

export interface SubMenuItemProps {
  childPath: string;
  onNavigate: (href: string) => void;
  formatPathToLabel: (path: string) => string;
}

export function SubMenuItem({ childPath, onNavigate, formatPathToLabel }: SubMenuItemProps) {
  return (
    <a
      href={childPath}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(childPath);
      }}
      className={styles.submenuItem}
      role="menuitem"
    >
      {formatPathToLabel(childPath)}
    </a>
  );
}
