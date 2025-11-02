/**
 * Logout Page - Supabase Authentication
 *
 * Handles user sign out and redirects to login.
 * - Auto-executes signOut on page load
 * - Shows loading state
 * - Clears Supabase session and cookies
 * - Redirects to login after successful logout
 */

'use client';

import { useEffect } from 'react';
import { BrandBackground, AuthCard } from '@vantage-lane/ui-core';
import { signOut } from '@admin-shared/api/auth/actions';
import styles from './logout.module.css';

export default function LogoutPage() {
  useEffect(() => {
    // Auto-execute logout on mount
    async function handleLogout() {
      // signOut() will redirect to /login automatically
      await signOut();
    }
    handleLogout();
  }, []);

  return (
    <BrandBackground variant="login">
      <main className={styles['page']}>
        <AuthCard title="Signing out...">
          <div className={styles['content']}>
            <div className={styles['spinner']} aria-label="Loading" />
            <p className={styles['message']}>
              Please wait while we sign you out...
            </p>
          </div>
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
