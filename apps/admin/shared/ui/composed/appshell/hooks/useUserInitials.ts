/**
 * useUserInitials Hook
 * 
 * Extract user initials from name.
 */

'use client';

import { useMemo } from 'react';

export function useUserInitials(name?: string): string {
  return useMemo(() => {
    if (!name) return 'U';

    const parts = name
      .trim()
      .split(' ')
      .filter((p) => p.length > 0);

    if (parts.length >= 2) {
      const first = parts[0]?.charAt(0) || '';
      const last = parts[parts.length - 1]?.charAt(0) || '';
      if (first && last) {
        return (first + last).toUpperCase();
      }
    }

    return name.substring(0, Math.min(2, name.length)).toUpperCase() || 'U';
  }, [name]);
}
