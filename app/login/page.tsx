/**
 * Login Page
 *
 * Minimal page component - ZERO business logic.
 * All logic is in @features/auth-login.
 * Uses lucide-react icons (no emoji).
 */

import { BrandBackground, AuthCard } from '@vantage-lane/ui-core';
import { LoginForm } from '@features/auth-login';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <BrandBackground variant="login">
      <main className={styles.page}>
        <AuthCard title="Sign In">
          <LoginForm />
        </AuthCard>
      </main>
    </BrandBackground>
  );
}
