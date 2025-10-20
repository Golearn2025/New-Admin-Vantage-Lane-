/**
 * ICON COMPONENT - PREMIUM
 * 
 * Professional SVG icon wrapper with theme color support
 * All icons are stroke-based for consistency
 */

'use client';

import React from 'react';
import { ICON_PATHS, type IconName } from './icons';
import styles from './Icon.module.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconColor = 
  | 'theme' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'info' 
  | 'primary' 
  | 'secondary' 
  | 'muted'
  | 'inherit';

export interface IconProps {
  /** Icon name from the icon set */
  name: IconName;
  /** Size of the icon */
  size?: IconSize;
  /** Color variant */
  color?: IconColor;
  /** Custom className */
  className?: string;
  /** Accessible label */
  label?: string;
}

const SIZE_MAP: Record<IconSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
};

export function Icon({
  name,
  size = 'md',
  color = 'inherit',
  className = '',
  label,
}: IconProps) {
  const iconPath = ICON_PATHS[name];
  const iconSize = SIZE_MAP[size];
  
  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const colorClass = color !== 'inherit' ? styles[`color-${color}`] : '';
  const sizeClass = styles[`size-${size}`];

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.icon} ${sizeClass} ${colorClass} ${className}`}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
    >
      {iconPath}
    </svg>
  );
}

// Re-export IconName for convenience
export type { IconName };
