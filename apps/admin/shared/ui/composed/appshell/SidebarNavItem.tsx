/**
 * SidebarNavItem Component
 *
 * Individual navigation item wrapper for SidebarNav.
 * Handles active state calculation and expanded state logic.
 * Performance optimized - extracted from inline map function.
 */

'use client';

import { NavItem } from './NavItem';
import type { IconName } from '@vantage-lane/ui-icons';

export interface SidebarNavItemProps {
  item: {
    href: string;
    icon: IconName;
    label: string;
    badgeCount?: number;
    children?: string[];
  };
  currentPath: string;
  expandable: boolean;
  expandedItems: string[];
  onNavigate?: (path: string) => void;
  onToggleExpandHandler?: (href: string) => void;
  isMenuItemActive: (item: any, path: string) => boolean;
  isMenuItemExpanded: (item: any, path: string) => boolean;
}

export function SidebarNavItem({ 
  item,
  currentPath,
  expandable,
  expandedItems,
  onNavigate,
  onToggleExpandHandler,
  isMenuItemActive,
  isMenuItemExpanded
}: SidebarNavItemProps) {
  const isActive = isMenuItemActive(item, currentPath);
  const isExpanded = expandable
    ? expandedItems.includes(item.href)  
    : isMenuItemExpanded(item, currentPath);

  return (
    <NavItem
      href={item.href}
      icon={item.icon}
      label={item.label}
      {...(item.badgeCount && { badgeCount: item.badgeCount })}
      isActive={isActive}
      hasChildren={!!item.children}
      isExpanded={isExpanded}
      subpages={item.children}
      onNavigate={onNavigate || (() => {})}
      {...(expandable && { onToggleExpand: onToggleExpandHandler })}
    />
  );
}
