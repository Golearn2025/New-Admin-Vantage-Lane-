/**
 * useLogout Hook
 * 
 * Client-side logout logic with spam protection and loading state.
 * Wraps signOutAction server action.
 */

'use client';

import { useState, useCallback } from 'react';
import { signOutAction } from '@admin-shared/api/auth/actions';

export interface UseLogoutReturn {
  isLoggingOut: boolean;
  handleLogout: () => Promise<void>;
}

export function useLogout(): UseLogoutReturn {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    // Spam protection - prevent multiple simultaneous logout attempts
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOutAction();
      // signOutAction will redirect, so this won't execute
    } catch (error) {
      // Reset state if logout fails
      setIsLoggingOut(false);
      // Error will be shown by server action or caught by error boundary
    }
  }, [isLoggingOut]);

  return {
    isLoggingOut,
    handleLogout,
  };
}
