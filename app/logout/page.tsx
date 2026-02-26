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

import { AuthCard } from '@vantage-lane/ui-core/AuthCard';
import { BrandBackground } from '@vantage-lane/ui-core/BrandBackground';
import { useEffect } from 'react';
import styles from './logout.module.css';

export default function LogoutPage() {
  useEffect(() => {
    // Auto-execute logout on mount
    async function handleLogout() {
      try {
        // Call our new logout API endpoint
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          // Force reload to clear all client-side state
          window.location.href = '/login';
        } else {
          console.error('Logout failed');
          window.location.href = '/login'; // Fallback
        }
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/login'; // Fallback
      }
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
