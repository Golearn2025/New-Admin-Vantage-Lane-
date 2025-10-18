/**
 * AVATAR COMPONENT - PREMIUM
 * 
 * User avatar with image, initials, or icon fallback
 * Perfect for user profiles, lists, and cards
 * 
 * Features:
 * - Image support
 * - Initials fallback
 * - Icon fallback
 * - Multiple sizes
 * - Status indicator
 * - Theme colors
 */

'use client';

import React, { useState } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Name to generate initials from */
  name?: string;
  /** Icon to display (fallback if no src/name) */
  icon?: IconName;
  /** Avatar size */
  size?: AvatarSize;
  /** Status indicator */
  status?: AvatarStatus;
  /** Custom className */
  className?: string;
}

export function Avatar({
  src,
  alt,
  name,
  icon = 'user-circle',
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = (name: string) => {
    const words = name.trim().split(' ').filter(w => w.length > 0);
    if (words.length >= 2 && words[0] && words[1]) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    if (words[0] && words[0].length >= 2) {
      return words[0].slice(0, 2).toUpperCase();
    }
    return words[0]?.[0]?.toUpperCase() || '?';
  };

  const sizeClass = styles[`size-${size}`];
  const hasImage = src && !imageError;
  const initials = name ? getInitials(name) : null;

  // Get icon size based on avatar size
  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 'sm';
      case 'sm':
        return 'md';
      case 'md':
        return 'lg';
      case 'lg':
        return 'xl';
      case 'xl':
      case '2xl':
        return '2xl';
      default:
        return 'md';
    }
  };

  return (
    <div className={`${styles.avatar} ${sizeClass} ${className}`}>
      {/* Image */}
      {hasImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : initials ? (
        /* Initials */
        <span className={styles.initials}>{initials}</span>
      ) : (
        /* Icon fallback */
        <Icon name={icon} size={getIconSize() as any} color="inherit" />
      )}

      {/* Status indicator */}
      {status && (
        <span className={`${styles.status} ${styles[`status-${status}`]}`} />
      )}
    </div>
  );
}
